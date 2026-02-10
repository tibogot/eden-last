"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, Flip, useGSAP } from "@/app/lib/gsapConfig";

interface HorizontalScrollSectionProps {
  images?: string[];
  pinnedImageIndex?: number;
  slides?: {
    text: string;
    image: string;
  }[];
  heroText?: string;
  outroText?: string;
}

const DEFAULT_IMAGES = [
  "/images/hero.jpg",
  "/images/hero-2.jpg",
  "/images/pool-game.jpg",
  "/images/table-tennis.jpg",
  "/images/annie-lang.jpg",
  "/images/colin.jpg",
  "/images/daniel-park.jpg",
  "/images/sasuke.jpg",
  "/images/jordan.jpg",
  "/images/iris-lavoie.jpg",
  "/images/macdavis.jpg",
  "/images/roberto-nickson.jpg",
  "/images/mche-lee-Bribs3.jpg",
];

const DEFAULT_SLIDES = [
  {
    text: "A landscape in constant transition, where every shape, sound, and shadow refuses to stay still. What seems stable begins to dissolve, and what fades returns again in a new form.",
    image: "/images/obinna-okerekeocha.jpg",
  },
  {
    text: "The rhythm of motion carries us forward into spaces that feel familiar yet remain undefined. Each shift is subtle, yet together they remind us that nothing we see is ever permanent.",
    image: "/images/shourav-sheikh.jpg",
  },
];

export default function HorizontalScrollSection({
  images = DEFAULT_IMAGES,
  pinnedImageIndex = 6,
  slides = DEFAULT_SLIDES,
  heroText = "Fragments of thought arranged in sequence become patterns. They unfold step by step, shaping meaning as they move forward.",
  outroText = "Shadows fold into light. Shapes shift across the frame, reminding us that stillness is only temporary.",
}: HorizontalScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedMarqueeImgCloneRef = useRef<HTMLImageElement | null>(null);
  const isImgCloneActiveRef = useRef(false);
  const flipAnimationRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // This component was originally tuned for 2 slides. Make all distances and
      // translate values depend on the number of slides so it behaves consistently.
      const slidesCount = Math.max(slides.length, 1);
      const totalPanels = slidesCount + 1; // spacer + slides
      const wrapperEndXPercent = -(slidesCount / totalPanels) * 100;
      const pinnedImageEndXPercent = -slidesCount * 100;
      const pinDistanceMultiplier = 2.5; // 2 slides => 5vh * innerHeight
      const updateDistanceMultiplier = 2.75; // 2 slides => 5.5vh * innerHeight

      const lightColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--color-secondary")
          .trim() || "#fffdf6";
      const darkColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--color-primary")
          .trim() || "#465643";

      function interpolateColor(
        color1: string,
        color2: string,
        factor: number,
      ) {
        return gsap.utils.interpolate(color1, color2, factor);
      }

      gsap.to(".marquee-images", {
        scrollTrigger: {
          trigger: ".marquee",
          start: "top bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const xPosition = -75 + progress * 25;
            gsap.set(".marquee-images", {
              x: `${xPosition}%`,
            });
          },
        },
      });

      function createPinnedMarqueeImgClone() {
        if (isImgCloneActiveRef.current) return;

        const originalMarqueeImg = document.querySelector(
          ".marquee-img.pin img",
        ) as HTMLImageElement;
        if (!originalMarqueeImg) return;

        const rect = originalMarqueeImg.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        pinnedMarqueeImgCloneRef.current = originalMarqueeImg.cloneNode(
          true,
        ) as HTMLImageElement;

        gsap.set(pinnedMarqueeImgCloneRef.current, {
          position: "fixed",
          left: centerX - originalMarqueeImg.offsetWidth / 2 + "px",
          top: centerY - originalMarqueeImg.offsetHeight / 2 + "px",
          width: originalMarqueeImg.offsetWidth + "px",
          height: originalMarqueeImg.offsetHeight + "px",
          transform: "rotate(-5deg)",
          transformOrigin: "center center",
          pointerEvents: "none",
          willChange: "transform",
          zIndex: 40,
        });

        document.body.appendChild(pinnedMarqueeImgCloneRef.current);
        gsap.set(originalMarqueeImg, { opacity: 0 });
        isImgCloneActiveRef.current = true;
      }

      function removePinnedMarqueeImgClone() {
        if (!isImgCloneActiveRef.current) return;
        if (pinnedMarqueeImgCloneRef.current) {
          pinnedMarqueeImgCloneRef.current.remove();
          pinnedMarqueeImgCloneRef.current = null;
        }
        const originalMarqueeImg = document.querySelector(
          ".marquee-img.pin img",
        ) as HTMLImageElement;
        if (originalMarqueeImg) {
          gsap.set(originalMarqueeImg, { opacity: 1 });
        }
        isImgCloneActiveRef.current = false;
      }

      ScrollTrigger.create({
        trigger: ".horizontal-scroll",
        start: "top top",
        end: () =>
          `+=${window.innerHeight * pinDistanceMultiplier * slidesCount}`,
        pin: true,
      });

      ScrollTrigger.create({
        trigger: ".marquee",
        start: "top top",
        onEnter: createPinnedMarqueeImgClone,
        onEnterBack: createPinnedMarqueeImgClone,
        onLeaveBack: removePinnedMarqueeImgClone,
      });

      ScrollTrigger.create({
        trigger: ".horizontal-scroll",
        start: "top 50%",
        end: () =>
          `+=${window.innerHeight * updateDistanceMultiplier * slidesCount}`,
        onEnter: () => {
          if (
            pinnedMarqueeImgCloneRef.current &&
            isImgCloneActiveRef.current &&
            !flipAnimationRef.current
          ) {
            const state = Flip.getState(pinnedMarqueeImgCloneRef.current);

            gsap.set(pinnedMarqueeImgCloneRef.current, {
              position: "fixed",
              left: "0px",
              top: "0px",
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
              transform: "rotate(0deg)",
              transformOrigin: "center center",
            });

            flipAnimationRef.current = Flip.from(state, {
              duration: 1,
              ease: "none",
              paused: true,
            });
          }
        },
        onLeaveBack: () => {
          if (flipAnimationRef.current) {
            flipAnimationRef.current.kill();
            flipAnimationRef.current = null;
          }
          if (containerRef.current) {
            gsap.set(containerRef.current, {
              backgroundColor: lightColor,
            });
          }
          gsap.set(".horizontal-scroll-wrapper", {
            x: "0%",
          });
        },
      });

      ScrollTrigger.create({
        trigger: ".horizontal-scroll",
        start: "top 50%",
        end: () =>
          `+=${window.innerHeight * updateDistanceMultiplier * slidesCount}`,
        onUpdate: (self) => {
          const progress = self.progress;

          if (progress <= 0.05) {
            const bgColorProgress = Math.min(progress / 0.05, 1);
            const newBgColor = interpolateColor(
              lightColor,
              darkColor,
              bgColorProgress,
            );
            if (containerRef.current) {
              gsap.set(containerRef.current, {
                backgroundColor: newBgColor,
              });
            }
          } else if (progress > 0.05) {
            if (containerRef.current) {
              gsap.set(containerRef.current, {
                backgroundColor: darkColor,
              });
            }
          }

          if (progress <= 0.2) {
            const scaleProgress = progress / 0.2;
            if (flipAnimationRef.current) {
              flipAnimationRef.current.progress(scaleProgress);
            }
          }

          if (progress > 0.2 && progress <= 0.95) {
            if (flipAnimationRef.current) {
              flipAnimationRef.current.progress(1);
            }

            const horizontalProgress = (progress - 0.2) / 0.75;

            const wrapperTranslateX = wrapperEndXPercent * horizontalProgress;
            gsap.set(".horizontal-scroll-wrapper", {
              x: `${wrapperTranslateX}%`,
            });

            if (pinnedMarqueeImgCloneRef.current) {
              gsap.set(pinnedMarqueeImgCloneRef.current, {
                x: `${pinnedImageEndXPercent * horizontalProgress}%`,
              });
            }
          } else if (progress > 0.95) {
            if (flipAnimationRef.current) {
              flipAnimationRef.current.progress(1);
            }
            if (pinnedMarqueeImgCloneRef.current) {
              gsap.set(pinnedMarqueeImgCloneRef.current, {
                x: `${pinnedImageEndXPercent}%`,
              });
            }
            gsap.set(".horizontal-scroll-wrapper", {
              x: `${wrapperEndXPercent}%`,
            });
          }
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        if (pinnedMarqueeImgCloneRef.current) {
          pinnedMarqueeImgCloneRef.current.remove();
        }
      };
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="bg-secondary text-primary relative w-full"
    >
      <section className="hero relative flex h-svh w-full items-center justify-center p-8 text-center">
        <h1 className="font-ivy-headline mx-auto w-full text-4xl leading-tight font-medium tracking-tight lg:w-3/4 lg:text-[4rem]">
          {heroText}
        </h1>
      </section>

      <section className="marquee relative h-[70svh] w-full overflow-hidden py-[10svh]">
        <div className="marquee-wrapper absolute top-1/2 left-1/2 h-[50svh] w-[150%] -translate-x-1/2 -translate-y-1/2 -rotate-[5deg] lg:w-[300%]">
          <div className="marquee-images absolute top-1/2 left-1/2 flex h-full w-[200%] -translate-x-3/4 -translate-y-1/2 items-center justify-between gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className={`marquee-img aspect-[5/3] w-full flex-1 ${
                  index === pinnedImageIndex ? "pin" : ""
                }`}
              >
                <img
                  src={img}
                  alt={`Marquee image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="horizontal-scroll relative h-svh w-full overflow-hidden">
        <div className="horizontal-scroll-wrapper absolute top-0 left-0 flex h-svh translate-x-0 will-change-transform">
          <div className="horizontal-slide horizontal-spacer h-full w-screen min-w-screen bg-transparent"></div>
          {slides.map((slide, index) => (
            <div
              key={index}
              className="horizontal-slide bg-primary text-secondary flex h-full w-screen min-w-screen flex-col-reverse gap-8 p-16 lg:flex-row lg:p-8"
            >
              <div className="col flex flex-[3] items-center justify-center lg:items-start">
                <h3 className="font-ivy-headline w-full text-2xl leading-tight font-medium tracking-tight lg:w-3/4 lg:text-[2.25rem]">
                  {slide.text}
                </h3>
              </div>
              <div className="col flex flex-[2] items-center justify-center">
                <img
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  className="h-full w-full object-cover lg:h-3/4 lg:w-3/4"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="outro bg-primary text-secondary relative flex h-svh w-full items-center justify-center p-8 text-center">
        <h1 className="font-ivy-headline mx-auto w-full text-4xl leading-tight font-medium tracking-tight lg:w-3/4 lg:text-[4rem]">
          {outroText}
        </h1>
      </section>
    </div>
  );
}
