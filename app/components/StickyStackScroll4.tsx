"use client";

import { useRef, useState, useEffect } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsapConfig";
import { useLenis } from "lenis/react";
import Image from "next/image";
import AnimatedText from "./AnimatedText3";

interface CardData {
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

const cardData: CardData[] = [
  {
    number: "01",
    title: "Custom Web Development",
    description:
      "We provide bespoke web development solutions tailored to your business needs. Our team ensures top-notch performance and scalability. Every project is designed with modern technologies and best practices in mind.",
    image: "/images/hero-2.jpg",
    imageAlt: "Web Development",
  },
  {
    number: "02",
    title: "Mobile App Development",
    description:
      "Crafting intuitive and engaging mobile applications for both Android and iOS platforms. Enhance your user experience with our expert team. We combine cutting-edge design with robust functionality.",
    image: "/images/daniel-park.jpg",
    imageAlt: "App Development",
  },
  {
    number: "03",
    title: "Digital Marketing",
    description:
      "Comprehensive digital marketing services to boost your online presence. From SEO to social media campaigns, we cover it all. Our strategies are data-driven and results-oriented.",
    image: "/images/colin.jpg",
    imageAlt: "Digital Marketing",
  },
  {
    number: "04",
    title: "Cloud Solutions",
    description:
      "Reliable and secure cloud solutions to streamline your business operations. Leverage the power of the cloud with our expertise. We ensure scalability, security, and optimal performance.",
    image: "/images/table-tennis.jpg",
    imageAlt: "Cloud Solutions",
  },
];

function Card({ data }: { data: CardData }) {
  return (
    <div className="card relative w-full">
      <div className="card-inner h-[600px] w-full overflow-hidden border-t border-white/20 bg-black px-4 py-4 text-white md:h-[600px] md:px-8 md:py-6">
        <div className="flex h-full w-full flex-col md:flex-row">
          {/* Number */}
          <div className="flex w-full items-start md:w-1/12">
            <span className="font-pp-neue-montreal text-sm leading-none text-white/60">
              {data.number}
            </span>
          </div>

          {/* Title + Copy */}
          <div className="flex w-full flex-col items-start md:w-5/12 md:pr-6">
            <div>
              <h3 className="font-pp-neue-montreal -mt-1 text-4xl leading-none font-medium text-white">
                {data.title}
              </h3>

              <div className="mt-12" />

              <p className="font-pp-neue-montreal max-w-lg text-lg leading-relaxed text-white/80">
                {data.description}
              </p>
            </div>
          </div>

          {/* Desktop Image */}
          <div className="relative hidden h-full w-full overflow-hidden rounded-sm md:flex md:w-1/2">
            <Image
              src={data.image}
              alt={data.imageAlt}
              fill
              className="object-cover"
              sizes="50vw"
              priority={data.number === "01"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StickyStackScroll() {
  const lenis = useLenis();
  const container = useRef<HTMLDivElement>(null);
  const [domReady, setDomReady] = useState(false);

  // Wait for images to load before initializing ScrollTrigger
  useEffect(() => {
    let initialCheck: NodeJS.Timeout | null = null;
    let fallbackTimeout: NodeJS.Timeout | null = null;
    let imageLoadHandlers: Array<() => void> = [];

    const checkImagesLoaded = () => {
      if (!container.current) return false;

      // Only check on desktop (md breakpoint and above)
      const mediaQuery = window.matchMedia("(min-width: 768px)");
      if (!mediaQuery.matches) {
        return true; // Skip image check on mobile
      }

      const cards = container.current.querySelectorAll(".card");
      if (cards.length === 0) return false;

      // Get all img elements within cards (Next.js Image renders as img)
      const images = Array.from(
        container.current.querySelectorAll(".card img"),
      ) as HTMLImageElement[];

      if (images.length === 0) return false;

      // Check if all images are loaded
      return images.every((img) => {
        // Image is loaded if complete is true and naturalWidth > 0
        return img.complete && img.naturalWidth > 0;
      });
    };

    // Check if images are loaded immediately
    if (checkImagesLoaded()) {
      setDomReady(true);
      return;
    }

    // Wait a bit for DOM to render, then check again
    initialCheck = setTimeout(() => {
      if (checkImagesLoaded()) {
        setDomReady(true);
        return;
      }

      // If images aren't loaded yet, wait for them
      const images = Array.from(
        container.current?.querySelectorAll(".card img") || [],
      ) as HTMLImageElement[];

      if (images.length === 0) {
        // Fallback: if no images found, proceed anyway
        setDomReady(true);
        return;
      }

      let loadedCount = 0;
      const totalImages = images.length;
      let isReady = false;

      const handleImageLoad = () => {
        if (isReady) return;
        loadedCount++;
        if (loadedCount === totalImages) {
          isReady = true;
          // Small delay to ensure layout is stable after images load
          setTimeout(() => {
            setDomReady(true);
          }, 50);
        }
      };

      // Attach load handlers to images that aren't loaded yet
      images.forEach((img) => {
        if (img.complete && img.naturalWidth > 0) {
          loadedCount++;
        } else {
          const loadHandler = () => handleImageLoad();
          const errorHandler = () => handleImageLoad(); // Proceed even on error
          img.addEventListener("load", loadHandler, { once: true });
          img.addEventListener("error", errorHandler, { once: true });
          imageLoadHandlers.push(() => {
            img.removeEventListener("load", loadHandler);
            img.removeEventListener("error", errorHandler);
          });
        }
      });

      // If all images were already loaded
      if (loadedCount === totalImages && !isReady) {
        isReady = true;
        setTimeout(() => {
          setDomReady(true);
        }, 50);
      }

      // Fallback timeout: proceed after max 2 seconds even if images haven't loaded
      fallbackTimeout = setTimeout(() => {
        if (!isReady) {
          isReady = true;
          setDomReady(true);
        }
      }, 2000);
    }, 100);

    // Cleanup function
    return () => {
      if (initialCheck) clearTimeout(initialCheck);
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
      imageLoadHandlers.forEach((cleanup) => cleanup());
      imageLoadHandlers = [];
    };
  }, []);

  useGSAP(
    () => {
      if (!container.current || !domReady || !lenis) return;

      // Only run animations on desktop (md breakpoint and above)
      const mediaQuery = window.matchMedia("(min-width: 768px)");
      if (!mediaQuery.matches) {
        return;
      }

      const cards = gsap.utils.toArray(".card") as Element[];
      if (cards.length === 0) return;

      // Note: scrollerProxy is already set up in LenisProvider, so we don't need to set it here
      // Just update ScrollTrigger on Lenis scroll with throttling
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            ScrollTrigger.update();
            ticking = false;
          });
          ticking = true;
        }
      };

      lenis.on("scroll", handleScroll);

      // Desktop settings only
      const startPosition = "top 20%";
      const endPosition = "top 30%";
      const yOffset = 8;

      // Create a context for the intro pin
      const introPinCtx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: cards[0],
          start: startPosition,
          endTrigger: cards[cards.length - 1],
          end: endPosition,
          pin: ".intro",
          pinSpacing: false,
        });
      });

      // Array to store all card animation contexts
      const cardContexts: gsap.Context[] = [];

      cards.forEach((card, index) => {
        const isLastCard = index === cards.length - 1;
        const cardInner = card.querySelector(".card-inner") as HTMLElement;

        if (!isLastCard && cardInner) {
          // Pin each card except the last one
          const pinCtx = gsap.context(() => {
            ScrollTrigger.create({
              trigger: card,
              start: startPosition,
              endTrigger: cards[cards.length - 1], // End when last card starts
              end: "top 20%", // Stop pinning when last card reaches start position
              pin: true,
              pinSpacing: false,
            });
          });

          // Create stacking animation - move card up slightly
          const animCtx = gsap.context(() => {
            gsap.to(cardInner, {
              y: `-${(cards.length - index - 1) * yOffset}vh`,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: startPosition,
                endTrigger: cards[cards.length - 1],
                end: "top 20%",
                scrub: true,
              },
            });
          });

          cardContexts.push(pinCtx, animCtx);
        }
      });

      // Consolidated ScrollTrigger refresh function (following best practices)
      // Debounce multiple refresh calls into a single refresh after all animations are ready
      let refreshTimeout: NodeJS.Timeout | null = null;
      const scheduleRefresh = (delay: number = 100) => {
        if (refreshTimeout) {
          clearTimeout(refreshTimeout);
        }
        refreshTimeout = setTimeout(() => {
          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            refreshTimeout = null;
          });
        }, delay);
      };

      // Initial refresh after all animations are set up
      scheduleRefresh(100);

      // Listen for page loader completion to refresh after scrollbar appears
      const handlePageLoaderComplete = () => {
        // Wait for scrollbar to appear and layout to settle
        // The loader removes overflow:hidden, causing scrollbar to appear
        // Use double RAF to ensure scrollbar rendering is complete
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scheduleRefresh(150);
          });
        });
      };

      // Check if loader is already complete (for navigation between pages)
      if (document.documentElement.classList.contains("page-loader-complete")) {
        // Loader already completed, but wait a bit for layout to be stable
        scheduleRefresh(100);
      } else {
        // Listen for loader completion event
        window.addEventListener("pageLoaderComplete", handlePageLoaderComplete);
      }

      // Return cleanup function
      return () => {
        // Clear any pending refresh timeout
        if (refreshTimeout) {
          clearTimeout(refreshTimeout);
          refreshTimeout = null;
        }

        // Clean up Lenis listener
        if (lenis) {
          lenis.off("scroll", handleScroll);
        }

        // Clean up page loader event listener
        window.removeEventListener(
          "pageLoaderComplete",
          handlePageLoaderComplete,
        );

        // Clean up all contexts
        introPinCtx.revert();
        cardContexts.forEach((ctx) => ctx.revert());
      };
    },
    {
      scope: container,
      dependencies: [domReady, lenis],
    },
  );

  return (
    <div className="overflow-x-hidden" ref={container}>
      <section className="intro mx-auto bg-black px-4 py-20 text-center text-white md:px-8 md:py-30">
        <AnimatedText delay={0.0} stagger={0.3}>
          <h2 className="font-pp-neue-montreal mx-auto mb-6 max-w-4xl text-4xl font-medium md:text-5xl lg:text-6xl">
            Technology that ships and scales
          </h2>
          <p className="font-pp-neue-montreal mx-auto max-w-2xl text-lg text-white/80">
            We build modern, scalable technology solutions that help businesses
            move faster and adapt to change.
          </p>
        </AnimatedText>
      </section>

      {/* Mobile Layout */}
      <section className="block w-full py-8 text-white md:hidden">
        <div className="space-y-8 px-4">
          {cardData.map((data) => (
            <div
              key={data.number}
              className="overflow-hidden border-t border-white/20 bg-black py-6"
            >
              <span className="font-pp-neue-montreal text-sm leading-none text-white/60">
                {data.number}
              </span>
              <h3 className="font-pp-neue-montreal mt-4 text-4xl leading-none font-medium text-white">
                {data.title}
              </h3>
              <div className="mt-8" />
              <p className="font-pp-neue-montreal text-lg leading-relaxed text-white/80">
                {data.description}
              </p>
              <div className="mt-8">
                <div className="h-[400px] w-full overflow-hidden rounded-sm">
                  <Image
                    src={data.image}
                    alt={data.imageAlt}
                    width={1000}
                    height={400}
                    className="h-full w-full object-cover"
                    style={{ width: "100%", height: "100%" }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Desktop Layout */}
      <section className="cards relative hidden space-y-0 md:block md:space-y-0">
        {cardData.map((data) => (
          <Card key={data.number} data={data} />
        ))}
      </section>
    </div>
  );
}
