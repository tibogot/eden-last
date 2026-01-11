"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { useRouter, usePathname } from "next/navigation";
import { gsap, SplitText, useGSAP } from "../lib/gsapConfig";

// Custom ease - using expo.out for snappier, more dynamic animation
// If this doesn't match the original, import the old project to compare
const customEase = "expo.out"; // Try: "expo.out", "power3.out", "power4.out", or keep original: "cubic-bezier(0.87, 0, 0.13, 1)"

export default function PushOverNav() {
  const lenis = useLenis();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInHero, setIsInHero] = useState(true);
  const isInHeroRef = useRef(true); // Ref to track current hero state for closures
  const wasInHeroBeforeOpenRef = useRef(true); // Store hero state when opening menu

  const menuToggleBtnRef = useRef<HTMLButtonElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const menuOverlayContainerRef = useRef<HTMLDivElement>(null);
  const menuMediaWrapperRef = useRef<HTMLDivElement>(null);
  const hamburgerIconRef = useRef<HTMLDivElement>(null);
  const hamburgerBar1Ref = useRef<HTMLSpanElement>(null);
  const hamburgerBar2Ref = useRef<HTMLSpanElement>(null);
  const hamburgerBar3Ref = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  // Store SplitText instances for cleanup
  const splitTextInstancesRef = useRef<
    Array<ReturnType<typeof SplitText.create>>
  >([]);

  // Store timeline refs so we can kill them when needed
  const currentTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Track if menu is closing due to navigation (to prevent premature scroll unblock)
  const isNavigatingRef = useRef(false);

  // Initialize SplitText once on mount using best practices
  // Using scoped useGSAP with proper cleanup
  useGSAP(
    () => {
      // Use requestAnimationFrame for better timing (best practice)
      const initRAF = requestAnimationFrame(() => {
        // Double RAF to ensure DOM is fully rendered
        requestAnimationFrame(() => {
          if (!menuOverlayRef.current) return;

          const menuCols =
            menuOverlayRef.current.querySelectorAll<HTMLElement>(".menu-col");

          if (menuCols.length === 0) {
            console.warn(
              "Menu columns not found during SplitText initialization",
            );
            return;
          }

          menuCols.forEach((container) => {
            const textElements = container.querySelectorAll("a, p");

            textElements.forEach((element) => {
              if (!(element instanceof HTMLElement)) return;

              // Skip if already split to avoid duplicates
              if (element.querySelector(".line")) return;

              try {
                // Use latest SplitText best practices
                const split = SplitText.create(element, {
                  type: "lines",
                  mask: "lines", // v3.13.0+ adds overflow: clip wrapper for reveal effects
                  linesClass: "line",
                  // autoSplit: true, // Optional: enables responsive re-splitting on resize
                  // reduceWhiteSpace: true, // Optional: removes extra whitespace
                });

                if (split && split.lines && split.lines.length > 0) {
                  splitTextInstancesRef.current.push(split);

                  // Immediately hide the lines using GSAP (best practice)
                  // Using yPercent for better performance in some cases, but y works fine too
                  gsap.set(split.lines, { y: "-110%" });
                }
              } catch (error) {
                console.error("SplitText initialization error:", error);
              }
            });
          });
        });
      });

      // Cleanup function (best practice with useGSAP)
      return () => {
        cancelAnimationFrame(initRAF);
        // SplitText instances will be cleaned up in the separate cleanup useGSAP
      };
    },
    { scope: menuOverlayRef, dependencies: [] },
  );

  // Set initial state for overlay container
  useGSAP(
    () => {
      if (menuOverlayContainerRef.current) {
        gsap.set(menuOverlayContainerRef.current, { yPercent: -50 });
      }

      // Set initial media wrapper state (hidden from bottom, opacity 0)
      if (menuMediaWrapperRef.current) {
        gsap.set(menuMediaWrapperRef.current, {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          opacity: 0,
        });
      }

      // Set initial hamburger bar positions
      if (
        hamburgerBar1Ref.current &&
        hamburgerBar2Ref.current &&
        hamburgerBar3Ref.current
      ) {
        gsap.set(hamburgerBar1Ref.current, { y: -6, rotation: 0 });
        gsap.set(hamburgerBar2Ref.current, { opacity: 1 });
        gsap.set(hamburgerBar3Ref.current, { y: 6, rotation: 0 });
      }
    },
    { scope: menuOverlayContainerRef, dependencies: [] },
  );

  // Cleanup SplitText instances on unmount (best practice)
  // This is separate from useGSAP's auto-cleanup because SplitText.revert()
  // is explicit and needed to restore DOM elements to original state
  useGSAP(
    () => {
      return () => {
        // Revert all SplitText instances to restore original DOM structure
        splitTextInstancesRef.current.forEach((split) => {
          try {
            split.revert();
          } catch (error) {
            console.error("Error reverting SplitText:", error);
          }
        });
        splitTextInstancesRef.current = [];
      };
    },
    { dependencies: [] },
  );

  // Detect hero section using IntersectionObserver
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let raf: number | null = null;

    // Wait for DOM to be ready
    raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Find the first section with an image (hero section)
        const heroSection = document.querySelector(
          "main > section:first-of-type",
        ) as HTMLElement;

        if (!heroSection) {
          // If no hero section found, default to not in hero
          isInHeroRef.current = false;
          setIsInHero(false);
          return;
        }

        // Check if hero section has an image
        const hasImage = heroSection.querySelector("img") !== null;
        if (!hasImage) {
          isInHeroRef.current = false;
          setIsInHero(false);
          return;
        }

        // Initial check: see if hero section is currently visible
        const rect = heroSection.getBoundingClientRect();
        const isCurrentlyVisible =
          rect.top < window.innerHeight && rect.bottom > 80; // 80px accounts for nav
        isInHeroRef.current = isCurrentlyVisible;
        setIsInHero(isCurrentlyVisible);

        // Use IntersectionObserver to detect when hero section is in view
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              // If hero section is intersecting (visible), we're in hero
              // Use a threshold that triggers when we've scrolled past most of it
              const isInHeroNow =
                entry.isIntersecting && entry.intersectionRatio > 0.1;
              isInHeroRef.current = isInHeroNow;
              setIsInHero(isInHeroNow);
            });
          },
          {
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
            rootMargin: "-80px 0px 0px 0px", // Account for nav height
          },
        );

        observer.observe(heroSection);
      });
    });

    return () => {
      if (raf !== null) {
        cancelAnimationFrame(raf);
      }
      if (observer) {
        observer.disconnect();
      }
    };
  }, [pathname]); // Re-run when route changes

  // Update nav colors based on hero section and menu state
  // Only applies when menu is closed (when menu is open, keep existing behavior)
  useEffect(() => {
    if (isMenuOpen || isAnimating) {
      // Don't change colors when menu is open or animating
      return;
    }

    // Colors: secondary (#fffdf6) when in hero, primary (#465643) when past hero
    const targetColor = isInHero ? "#fffdf6" : "#465643";
    const logoFilter = isInHero
      ? "brightness(0) invert(1) sepia(5%) saturate(100%) hue-rotate(0deg) brightness(99.8%) contrast(99%)"
      : "brightness(0) saturate(100%) invert(27%) sepia(12%) saturate(600%) hue-rotate(60deg) brightness(95%) contrast(85%)";

    // Update burger colors
    if (
      hamburgerBar1Ref.current &&
      hamburgerBar2Ref.current &&
      hamburgerBar3Ref.current
    ) {
      gsap.to(
        [
          hamburgerBar1Ref.current,
          hamburgerBar2Ref.current,
          hamburgerBar3Ref.current,
        ],
        {
          backgroundColor: targetColor,
          duration: 0.3,
          ease: "power2.out",
        },
      );
    }

    // Update logo filter
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        filter: logoFilter,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isInHero, isMenuOpen, isAnimating]);

  // Reset navigation flag when page transition completes
  useEffect(() => {
    const handlePageTransitionComplete = () => {
      // Reset navigation flag after transition is complete
      isNavigatingRef.current = false;
    };

    window.addEventListener(
      "pageTransitionComplete",
      handlePageTransitionComplete,
    );

    return () => {
      window.removeEventListener(
        "pageTransitionComplete",
        handlePageTransitionComplete,
      );
    };
  }, []);

  // Reset all elements to their initial state for opening menu
  const resetToOpeningState = () => {
    // Reset menu columns to full opacity (they might be at 0.25 from close animation)
    const allMenuCols = document.querySelectorAll<HTMLElement>(".menu-col");
    if (allMenuCols.length > 0) {
      gsap.set(allMenuCols, { opacity: 1 });
    }

    // Reset SplitText lines to hidden position
    splitTextInstancesRef.current.forEach((split) => {
      if (
        split &&
        split.lines &&
        Array.isArray(split.lines) &&
        split.lines.length > 0
      ) {
        const validLines = split.lines.filter(
          (line) => line && line.parentNode,
        );
        if (validLines.length > 0) {
          gsap.set(validLines, { y: "-110%" });
        }
      }
    });

    // Reset overlay container position
    if (menuOverlayContainerRef.current) {
      gsap.set(menuOverlayContainerRef.current, { yPercent: -50 });
    }

    // Reset overlay clip-path to hidden
    if (menuOverlayRef.current) {
      gsap.set(menuOverlayRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      });
    }

    // Reset media wrapper to initial state for opening
    // Note: opacity is set to 1 when opening (see opening animation code)
    if (menuMediaWrapperRef.current) {
      gsap.set(menuMediaWrapperRef.current, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        opacity: 1,
      });
    }

    // Reset content container position
    const contentContainer = document.querySelector(
      ".content-container",
    ) as HTMLElement;
    if (contentContainer) {
      gsap.set(contentContainer, { y: "0svh" });
    }
  };

  // Comprehensive cleanup function to kill all animations
  const killAllAnimations = () => {
    // Kill the timeline and clear callbacks to prevent onComplete from firing
    if (currentTimelineRef.current) {
      // Clear callbacks before killing to prevent state updates
      currentTimelineRef.current.eventCallback("onComplete", null);
      currentTimelineRef.current.eventCallback("onUpdate", null);
      currentTimelineRef.current.eventCallback("onStart", null);
      currentTimelineRef.current.kill();
      currentTimelineRef.current = null;
    }

    // Get all animation targets
    const contentContainer = document.querySelector(
      ".content-container",
    ) as HTMLElement;

    // Kill all tweens on all animation targets
    if (contentContainer) {
      gsap.killTweensOf(contentContainer);
    }
    if (menuOverlayRef.current) {
      gsap.killTweensOf(menuOverlayRef.current);
    }
    if (menuOverlayContainerRef.current) {
      gsap.killTweensOf(menuOverlayContainerRef.current);
    }
    if (menuMediaWrapperRef.current) {
      gsap.killTweensOf(menuMediaWrapperRef.current);
    }
    if (hamburgerBar1Ref.current) {
      gsap.killTweensOf(hamburgerBar1Ref.current);
    }
    if (hamburgerBar2Ref.current) {
      gsap.killTweensOf(hamburgerBar2Ref.current);
    }
    if (hamburgerBar3Ref.current) {
      gsap.killTweensOf(hamburgerBar3Ref.current);
    }
    if (logoRef.current) {
      gsap.killTweensOf(logoRef.current);
    }

    // Kill tweens on all menu columns and SplitText lines
    const allMenuCols = document.querySelectorAll<HTMLElement>(".menu-col");
    if (allMenuCols.length > 0) {
      gsap.killTweensOf(allMenuCols);
    }

    // Kill tweens on all SplitText lines
    splitTextInstancesRef.current.forEach((split) => {
      if (
        split &&
        split.lines &&
        Array.isArray(split.lines) &&
        split.lines.length > 0
      ) {
        const validLines = split.lines.filter(
          (line) => line && line.parentNode,
        );
        if (validLines.length > 0) {
          gsap.killTweensOf(validLines);
        }
      }
    });
  };

  const handleMenuToggle = () => {
    // Get the content container (this will be the main page content)
    const contentContainer = document.querySelector(
      ".content-container",
    ) as HTMLElement;

    if (!contentContainer) {
      console.warn("Content container not found");
      return;
    }

    // Kill all running animations immediately using comprehensive cleanup
    killAllAnimations();

    // Immediately reset animating state since we killed animations
    setIsAnimating(false);

    // If lenis was stopped, restart it (only if not currently navigating)
    // During navigation, LenisProvider will restart Lenis after pageTransitionComplete
    if (lenis && !isNavigatingRef.current) lenis.start();

    if (!isMenuOpen) {
      // When opening, reset everything to initial state first
      // This ensures clean state even if we killed animations mid-close
      resetToOpeningState();
      // Opening menu - store current hero state before opening
      wasInHeroBeforeOpenRef.current = isInHeroRef.current;

      setIsAnimating(true);
      if (lenis) lenis.stop();

      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
          currentTimelineRef.current = null;
        },
      });

      // Store timeline ref so we can kill it if needed
      currentTimelineRef.current = tl;

      // Push content container down
      tl.to(
        contentContainer,
        {
          y: "100svh",
          duration: 1,
          ease: customEase,
        },
        "<",
      );

      // Reveal overlay with clip-path
      if (menuOverlayRef.current) {
        tl.to(
          menuOverlayRef.current,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1,
            ease: customEase,
          },
          "<",
        );
      }

      // Slide overlay content in
      // Start from -50% and animate to center (0)
      if (menuOverlayContainerRef.current) {
        gsap.set(menuOverlayContainerRef.current, { yPercent: -50 });
        tl.to(
          menuOverlayContainerRef.current,
          {
            yPercent: 0,
            duration: 1,
            ease: customEase,
          },
          "<",
        );
      }

      // Animate media with clip-path from bottom to top
      if (menuMediaWrapperRef.current) {
        // Set initial state: hidden from bottom (clip from bottom) and make visible
        gsap.set(menuMediaWrapperRef.current, {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          opacity: 1,
        });

        // Animate clip-path to reveal from bottom to top
        tl.to(
          menuMediaWrapperRef.current,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.75,
            ease: "power2.out",
            delay: 0.5,
          },
          "<",
        );
      }

      // Animate the already-created SplitText lines
      // Collect all lines from existing SplitText instances (best practice: check validity)
      const allLines: Element[] = [];
      splitTextInstancesRef.current.forEach((split) => {
        // Verify split instance is still valid and has lines
        if (
          split &&
          split.lines &&
          Array.isArray(split.lines) &&
          split.lines.length > 0
        ) {
          // Filter out any null/undefined lines (safety check)
          const validLines = split.lines.filter(
            (line) => line && line.parentNode,
          );
          allLines.push(...validLines);
        }
      });

      // Animate all lines together with proper timing (matching original)
      if (allLines.length > 0) {
        tl.to(
          allLines,
          {
            y: "0%", // Using y instead of yPercent for percentage-based movement
            duration: 2,
            ease: customEase,
            stagger: -0.075, // Negative stagger creates overlapping animation
          },
          -0.15, // Start slightly before other animations complete (overlap)
        );
      }

      // Animate hamburger to X and logo to white (part of timeline)
      if (
        hamburgerBar1Ref.current &&
        hamburgerBar2Ref.current &&
        hamburgerBar3Ref.current
      ) {
        // Change bar colors to secondary color
        tl.to(
          [
            hamburgerBar1Ref.current,
            hamburgerBar2Ref.current,
            hamburgerBar3Ref.current,
          ],
          {
            backgroundColor: "#fffdf6",
            duration: 0.3,
            ease: customEase,
          },
          "<",
        );

        // Change logo to secondary color (#fffdf6 - warm white/cream)
        if (logoRef.current) {
          tl.to(
            logoRef.current,
            {
              filter:
                "brightness(0) invert(1) sepia(5%) saturate(100%) hue-rotate(0deg) brightness(99.8%) contrast(99%)",
              duration: 0.3,
              ease: customEase,
            },
            "<",
          );
        }

        // Hide middle bar and rotate top/bottom to form X
        tl.to(
          hamburgerBar2Ref.current,
          {
            opacity: 0,
            duration: 0.3,
            ease: customEase,
          },
          "<",
        );

        tl.to(
          hamburgerBar1Ref.current,
          {
            y: 0,
            rotation: 45,
            duration: 0.5,
            ease: customEase,
          },
          "<0.1",
        );

        tl.to(
          hamburgerBar3Ref.current,
          {
            y: 0,
            rotation: -45,
            duration: 0.5,
            ease: customEase,
          },
          "<",
        );
      }

      setIsMenuOpen(true);
    } else {
      // Closing menu
      setIsAnimating(true);

      const tl = gsap.timeline({
        onComplete: () => {
          // Reset SplitText lines back to hidden position (best practice: verify instances)
          splitTextInstancesRef.current.forEach((split) => {
            if (
              split &&
              split.lines &&
              Array.isArray(split.lines) &&
              split.lines.length > 0
            ) {
              // Only reset lines that still exist in DOM
              const validLines = split.lines.filter(
                (line) => line && line.parentNode,
              );
              if (validLines.length > 0) {
                gsap.set(validLines, { y: "-110%" });
              }
            }
          });

          // Reset other elements
          const allMenuCols =
            document.querySelectorAll<HTMLElement>(".menu-col");
          gsap.set(allMenuCols, { opacity: 1 });
          if (menuMediaWrapperRef.current) {
            gsap.set(menuMediaWrapperRef.current, {
              opacity: 1,
              clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            });
          }

          setIsAnimating(false);
          // Only restart Lenis if not navigating
          // During navigation, LenisProvider handles restarting after pageTransitionComplete
          if (lenis && !isNavigatingRef.current) {
            lenis.start();
          }
          currentTimelineRef.current = null;
        },
      });

      // Store timeline ref so we can kill it if needed
      currentTimelineRef.current = tl;

      // Slide content container back
      tl.to(contentContainer, {
        y: "0svh",
        duration: 1,
        ease: customEase,
      });

      // Hide overlay with clip-path
      if (menuOverlayRef.current) {
        tl.to(
          menuOverlayRef.current,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 1,
            ease: customEase,
          },
          "<",
        );
      }

      // Slide overlay content back up
      if (menuOverlayContainerRef.current) {
        tl.to(
          menuOverlayContainerRef.current,
          {
            yPercent: -50,
            duration: 1,
            ease: customEase,
          },
          "<",
        );
      }

      // Fade out menu content (like the original)
      const allMenuCols = document.querySelectorAll<HTMLElement>(".menu-col");
      if (allMenuCols.length > 0) {
        tl.to(
          allMenuCols,
          {
            opacity: 0.25,
            duration: 1,
            ease: customEase,
          },
          "<",
        );
      }

      // Fade out media with opacity animation (same as text)
      if (menuMediaWrapperRef.current) {
        tl.to(
          menuMediaWrapperRef.current,
          {
            opacity: 0,
            duration: 1,
            ease: customEase,
          },
          "<",
        );
      }

      // Animate hamburger back to 3 bars (part of timeline)
      if (
        hamburgerBar1Ref.current &&
        hamburgerBar2Ref.current &&
        hamburgerBar3Ref.current
      ) {
        // Rotate top and bottom bars back to original position
        tl.to(
          hamburgerBar1Ref.current,
          {
            y: -6,
            rotation: 0,
            duration: 0.5,
            ease: customEase,
          },
          "<",
        );

        tl.to(
          hamburgerBar3Ref.current,
          {
            y: 6,
            rotation: 0,
            duration: 0.5,
            ease: customEase,
          },
          "<",
        );

        // Show middle bar
        tl.to(
          hamburgerBar2Ref.current,
          {
            opacity: 1,
            duration: 0.3,
            ease: customEase,
          },
          "<0.2",
        );

        // Use the color that was active BEFORE opening the menu
        const targetColor = wasInHeroBeforeOpenRef.current
          ? "#fffdf6"
          : "#465643";
        const logoFilter = wasInHeroBeforeOpenRef.current
          ? "brightness(0) invert(1) sepia(5%) saturate(100%) hue-rotate(0deg) brightness(99.8%) contrast(99%)"
          : "brightness(0) saturate(100%) invert(27%) sepia(12%) saturate(600%) hue-rotate(60deg) brightness(95%) contrast(85%)";

        tl.to(
          [
            hamburgerBar1Ref.current,
            hamburgerBar2Ref.current,
            hamburgerBar3Ref.current,
          ],
          {
            backgroundColor: targetColor,
            duration: 0.3,
            ease: customEase,
          },
          "<",
        );

        // Change logo color based on hero section state (same timing as hamburger)
        if (logoRef.current) {
          tl.to(
            logoRef.current,
            {
              filter: logoFilter,
              duration: 0.3,
              ease: customEase,
            },
            "<",
          );
        }
      }

      setIsMenuOpen(false);
    }
  };

  // Helper function to wait for images in the hero section to load
  const waitForHeroImages = (): Promise<void> => {
    return new Promise((resolve) => {
      let hasResolved = false;

      // Give React time to render the new page content
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Find all images in the hero section (first section)
          const heroSection = document.querySelector(
            "main section:first-of-type, main > section:first-child",
          );
          if (!heroSection) {
            // If no hero section found, wait a bit more and resolve
            if (!hasResolved) {
              hasResolved = true;
              setTimeout(resolve, 100);
            }
            return;
          }

          // Check for both regular img tags and Next.js Image component images
          const images = Array.from(
            heroSection.querySelectorAll<HTMLImageElement>("img"),
          );

          if (images.length === 0) {
            // No images in hero, resolve after a short delay to ensure layout is ready
            if (!hasResolved) {
              hasResolved = true;
              setTimeout(resolve, 50);
            }
            return;
          }

          let loadedCount = 0;
          const totalImages = images.length;

          // Set a timeout to resolve even if images don't load (max 3 seconds)
          const timeout = setTimeout(() => {
            if (!hasResolved) {
              hasResolved = true;
              resolve();
            }
          }, 3000);

          const checkComplete = () => {
            if (hasResolved) return;
            loadedCount++;
            if (loadedCount >= totalImages) {
              hasResolved = true;
              clearTimeout(timeout); // Clear timeout since we resolved early
              // All images loaded, wait one more frame for layout to settle
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  resolve();
                });
              });
            }
          };

          images.forEach((img) => {
            // For Next.js Image components, check if the underlying img is loaded
            if (img.complete && img.naturalHeight !== 0) {
              // Image already loaded
              checkComplete();
            } else if (img.complete && img.naturalHeight === 0) {
              // Image failed to load, count it anyway
              checkComplete();
            } else {
              // Wait for image to load
              const onLoad = () => {
                checkComplete();
              };
              const onError = () => {
                checkComplete();
              };
              img.addEventListener("load", onLoad, { once: true });
              img.addEventListener("error", onError, { once: true });
            }
          });

          // If all images were already loaded when we checked, resolve immediately
          if (loadedCount >= totalImages && !hasResolved) {
            clearTimeout(timeout);
            hasResolved = true;
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                resolve();
              });
            });
          }
        });
      });
    });
  };

  const handleLinkClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    // Always close menu when clicking a link, even if animations are running
    if (isMenuOpen) {
      e.preventDefault();

      // Set navigation flag to prevent premature scroll unblock
      isNavigatingRef.current = true;

      // Kill all running animations immediately using comprehensive cleanup
      killAllAnimations();

      // CRITICAL: Reset content container position immediately
      // So the new page content is visible at the correct position
      const contentContainer = document.querySelector(
        ".content-container",
      ) as HTMLElement;
      if (contentContainer) {
        gsap.set(contentContainer, { y: "100svh" }); // Keep it pushed down initially
      }

      // Dispatch page transition start event
      window.dispatchEvent(new Event("pageTransitionStart"));

      // Prefetch the route to start loading assets early
      router.prefetch(href);

      // Navigate to the new page (this starts the navigation process)
      router.push(href);

      // Wait for the route to actually change and React to render the new page
      await new Promise<void>((resolve) => {
        let checkCount = 0;
        const maxChecks = 100; // Max 100 frames (~1.6 seconds at 60fps)

        const checkRouteChange = () => {
          checkCount++;
          // Check if the URL has changed
          if (window.location.pathname === href || checkCount >= maxChecks) {
            // Give React multiple frames to fully render the new page content
            // This ensures the DOM is updated with the new page structure
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  resolve();
                });
              });
            });
          } else {
            // Check again on next frame
            requestAnimationFrame(checkRouteChange);
          }
        };
        // Start checking immediately
        checkRouteChange();
      });

      // CRITICAL: Scroll to top IMMEDIATELY after route change
      // Even though content is hidden at y: "100svh", scrolling now ensures
      // the hero section will be at the top when the slide animation reveals it
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Now wait for hero images to be fully loaded
      await waitForHeroImages();

      // Start the slide-up animation now that content is ready
      handleMenuToggle();

      // Wait for the slide animation to complete (~1s) then dispatch completion event
      // This allows ScrollTrigger to refresh after content is in final position
      setTimeout(() => {
        window.dispatchEvent(new Event("pageTransitionComplete"));
      }, 1100); // Animation duration (1s) + small buffer
    } else {
      // Menu is not open, navigate normally (don't prevent default)
      // Let Next.js handle navigation normally
    }
  };

  return (
    <>
      <style>{`
        .menu-col:has(.menu-link:hover) .menu-link:not(:hover) {
          opacity: 0.3;
        }
        .menu-link {
          transition: opacity 0.3s ease;
        }
        .menu-link-active {
          opacity: 0.3;
        }
        .menu-link-active:hover {
          opacity: 1;
        }
      `}</style>
      <nav className="pointer-events-none fixed inset-0 z-[50] overflow-hidden">
        {/* Menu Bar */}
        <div className="text-primary pointer-events-auto fixed inset-x-0 top-0 z-[50] flex w-full items-center justify-between px-8 py-8">
          <div className="relative h-12 w-24">
            <Link href="/" className="relative block h-full w-full">
              <div
                ref={logoRef}
                className="relative h-full w-full will-change-[filter]"
                style={{
                  filter:
                    "brightness(0) invert(1) sepia(5%) saturate(100%) hue-rotate(0deg) brightness(99.8%) contrast(99%)",
                }}
              >
                <Image
                  src="/navlogo.svg"
                  alt="Logo"
                  fill
                  className="object-contain"
                  priority
                  sizes="96px"
                />
              </div>
            </Link>
          </div>
          <button
            ref={menuToggleBtnRef}
            onClick={handleMenuToggle}
            className="flex cursor-pointer items-center justify-center overflow-visible border-none bg-transparent p-2"
            aria-label="Toggle menu"
          >
            <div
              ref={hamburgerIconRef}
              className="menu-hamburger-icon relative flex h-8 min-h-8 w-8 min-w-8 flex-col items-center justify-center overflow-visible transition-colors duration-300 ease-in-out"
            >
              <span
                ref={hamburgerBar1Ref}
                className="bg-secondary absolute h-[1.5px] w-full origin-center overflow-visible transition-colors duration-300 ease-in-out will-change-transform"
                style={{ transform: "translateY(-6px)" }}
              ></span>
              <span
                ref={hamburgerBar2Ref}
                className="bg-secondary absolute h-[1.5px] w-full origin-center overflow-visible opacity-100 transition-colors duration-300 ease-in-out will-change-transform"
                style={{ transform: "translateY(0)" }}
              ></span>
              <span
                ref={hamburgerBar3Ref}
                className="bg-secondary absolute h-[1.5px] w-full origin-center overflow-visible transition-colors duration-300 ease-in-out will-change-transform"
                style={{ transform: "translateY(6px)" }}
              ></span>
            </div>
          </button>
        </div>

        {/* Menu Overlay */}
        <div
          ref={menuOverlayRef}
          className="bg-primary text-secondary fixed inset-0 z-[1] overflow-hidden will-change-[clip-path]"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          }}
        >
          <div
            ref={menuOverlayContainerRef}
            className="pointer-events-auto fixed inset-0 flex h-full w-full will-change-transform"
          >
            {/* Content Wrapper - Now on the left */}
            <div className="relative flex w-full flex-[3] flex-col">
              <div className="absolute top-1/2 left-4 flex w-full -translate-y-1/2 transform flex-col items-start gap-12 py-8 md:left-8 md:w-3/4 md:flex-row md:items-end md:gap-8">
                {/* Main Menu Links */}
                <div className="menu-col text-secondary flex flex-[3] flex-col gap-2">
                  <div className={`menu-link ${pathname === "/" ? "menu-link-active" : ""}`}>
                    <Link
                      href="/"
                      onClick={(e) => handleLinkClick(e, "/")}
                      className="font-ivy-headline text-secondary block text-5xl leading-tight font-medium md:text-7xl"
                    >
                      Home
                    </Link>
                  </div>
                  <div className={`menu-link ${pathname === "/restaurant" ? "menu-link-active" : ""}`}>
                    <Link
                      href="/restaurant"
                      onClick={(e) => handleLinkClick(e, "/restaurant")}
                      className="font-ivy-headline text-secondary block text-5xl leading-tight font-medium md:text-7xl"
                    >
                      Restaurant
                    </Link>
                  </div>
                  <div className={`menu-link ${pathname === "/experiences" ? "menu-link-active" : ""}`}>
                    <Link
                      href="/experiences"
                      onClick={(e) => handleLinkClick(e, "/experiences")}
                      className="font-ivy-headline text-secondary block text-5xl leading-tight font-medium md:text-7xl"
                    >
                      Experiences
                    </Link>
                  </div>
                  <div className={`menu-link ${pathname === "/events" ? "menu-link-active" : ""}`}>
                    <Link
                      href="/events"
                      onClick={(e) => handleLinkClick(e, "/events")}
                      className="font-ivy-headline text-secondary block text-5xl leading-tight font-medium md:text-7xl"
                    >
                      Events
                    </Link>
                  </div>
                  <div className={`menu-link ${pathname === "/about" ? "menu-link-active" : ""}`}>
                    <Link
                      href="/about"
                      onClick={(e) => handleLinkClick(e, "/about")}
                      className="font-ivy-headline text-secondary block text-5xl leading-tight font-medium md:text-7xl"
                    >
                      About
                    </Link>
                  </div>
                  <div className={`menu-link ${pathname === "/contact" ? "menu-link-active" : ""}`}>
                    <Link
                      href="/contact"
                      onClick={(e) => handleLinkClick(e, "/contact")}
                      className="font-ivy-headline text-secondary block text-5xl leading-tight font-medium md:text-7xl"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto flex w-full flex-col items-start gap-8 py-8 pl-4 md:pl-8 md:w-3/4 md:flex-row">
                <div className="menu-col flex flex-col gap-2">
                  <p className="text-secondary text-sm font-medium">
                    Eden Garden
                  </p>
                </div>
                <div className="menu-col flex flex-col gap-2">
                  <p className="text-secondary text-sm font-medium">
                    +1 437 555 0199
                  </p>
                  <p className="text-secondary text-sm font-medium">
                    hello@edengarden.com
                  </p>
                </div>
              </div>
            </div>

            {/* Media Wrapper - Now on the right */}
            <div
              ref={menuMediaWrapperRef}
              className="hidden flex-[2] pr-4 opacity-0 will-change-[clip-path] md:pr-8 md:flex md:items-center md:justify-end"
              style={{
                clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
              }}
            >
              <div className="relative h-[60vh] w-full max-w-md">
                <Image
                  src="/images/jordan.jpg"
                  alt="Menu background"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
