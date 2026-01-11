"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { useRouter } from "next/navigation";
import { gsap, SplitText, useGSAP } from "../lib/gsapConfig";

// Custom ease - using expo.out for snappier, more dynamic animation
// If this doesn't match the original, import the old project to compare
const customEase = "expo.out"; // Try: "expo.out", "power3.out", "power4.out", or keep original: "cubic-bezier(0.87, 0, 0.13, 1)"

export default function PushOverNav() {
  const lenis = useLenis();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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

  const handleMenuToggle = () => {
    // Get the content container (this will be the main page content)
    const contentContainer = document.querySelector(
      ".content-container",
    ) as HTMLElement;

    if (!contentContainer) {
      console.warn("Content container not found");
      return;
    }

    // Kill any running animations immediately
    if (currentTimelineRef.current) {
      currentTimelineRef.current.kill();
      currentTimelineRef.current = null;
    }

    if (!isMenuOpen) {
      // Opening menu
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
          if (lenis) lenis.start();
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

        // Show middle bar and change colors back to gray
        tl.to(
          hamburgerBar2Ref.current,
          {
            opacity: 1,
            duration: 0.3,
            ease: customEase,
          },
          "<0.2",
        );

        tl.to(
          [
            hamburgerBar1Ref.current,
            hamburgerBar2Ref.current,
            hamburgerBar3Ref.current,
          ],
          {
            backgroundColor: "#5f5f5f",
            duration: 0.3,
            ease: customEase,
          },
          "<",
        );

        // Change logo back to gray (same timing as hamburger)
        if (logoRef.current) {
          tl.to(
            logoRef.current,
            {
              filter:
                "brightness(0) saturate(100%) invert(37%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)",
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

      // Kill any running animations immediately
      if (currentTimelineRef.current) {
        currentTimelineRef.current.kill();
        currentTimelineRef.current = null;
      }

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

      // Scroll to top immediately so the hero section is visible when animation starts
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        // Fallback if Lenis is not available
        window.scrollTo(0, 0);
      }

      // Wait one frame to ensure scroll position is fully set
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          resolve();
        });
      });

      // Now wait for hero images to be fully loaded
      await waitForHeroImages();

      // Start the slide-up animation now that content is ready
      handleMenuToggle();
    } else {
      // Menu is not open, navigate normally (don't prevent default)
      // Let Next.js handle navigation normally
    }
  };

  return (
    <>
      <nav className="pointer-events-none fixed inset-0 z-[50] overflow-hidden">
        {/* Menu Bar */}
        <div className="pointer-events-auto fixed inset-x-0 top-0 z-[50] flex w-full items-center justify-between px-8 py-8 text-[#5f5f5f]">
          <div className="relative h-12 w-24">
            <Link href="/" className="relative block h-full w-full">
              <div
                ref={logoRef}
                className="relative h-full w-full will-change-[filter]"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(37%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)",
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
                className="absolute h-[1.5px] w-full origin-center overflow-visible bg-[#5f5f5f] transition-colors duration-300 ease-in-out will-change-transform"
                style={{ transform: "translateY(-6px)" }}
              ></span>
              <span
                ref={hamburgerBar2Ref}
                className="absolute h-[1.5px] w-full origin-center overflow-visible bg-[#5f5f5f] opacity-100 transition-colors duration-300 ease-in-out will-change-transform"
                style={{ transform: "translateY(0)" }}
              ></span>
              <span
                ref={hamburgerBar3Ref}
                className="absolute h-[1.5px] w-full origin-center overflow-visible bg-[#5f5f5f] transition-colors duration-300 ease-in-out will-change-transform"
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
              <div className="absolute top-1/2 left-4 flex w-full -translate-y-1/2 transform flex-col items-start gap-12 py-8 md:left-8 lg:w-3/4 lg:flex-row lg:items-end lg:gap-8">
                {/* Main Menu Links */}
                <div className="menu-col text-secondary flex flex-[3] flex-col gap-2">
                  <div className="menu-link">
                    <Link
                      href="/"
                      onClick={(e) => handleLinkClick(e, "/")}
                      className="font-ivy-headline text-secondary block text-5xl leading-tight font-medium lg:text-7xl"
                    >
                      Home
                    </Link>
                  </div>
                  <div className="menu-link">
                    <Link
                      href="/restaurant"
                      onClick={(e) => handleLinkClick(e, "/restaurant")}
                      className="font-ivy-headline text-secondary block text-5xl leading-tight font-medium lg:text-7xl"
                    >
                      Restaurant
                    </Link>
                  </div>
                  <div className="menu-link">
                    <Link
                      href="/experiences"
                      onClick={(e) => handleLinkClick(e, "/experiences")}
                      className="font-ivy-headline text-secondary block text-5xl leading-tight font-medium lg:text-7xl"
                    >
                      Experiences
                    </Link>
                  </div>
                  <div className="menu-link">
                    <Link
                      href="/events"
                      onClick={(e) => handleLinkClick(e, "/events")}
                      className="font-ivy-headline text-secondary block text-5xl leading-tight font-medium lg:text-7xl"
                    >
                      Events
                    </Link>
                  </div>
                  <div className="menu-link">
                    <Link
                      href="/contact"
                      onClick={(e) => handleLinkClick(e, "/contact")}
                      className="font-ivy-headline text-secondary block text-5xl leading-tight font-medium lg:text-7xl"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto flex w-full flex-col items-start gap-8 py-8 pl-4 md:pl-8 lg:w-3/4 lg:flex-row">
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
              className="hidden flex-[2] pr-4 opacity-0 will-change-[clip-path] md:pr-8 lg:flex lg:items-center lg:justify-end"
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
