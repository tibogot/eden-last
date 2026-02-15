"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/app/lib/gsapConfig";

const HorizontalScrollCards = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = gsap.utils.toArray<HTMLElement>(".scroll-card");
    const images = gsap.utils.toArray<HTMLElement>(".parallax-image");

    // Store animations for proper cleanup
    const animations: gsap.core.Tween[] = [];
    const triggers: ScrollTrigger[] = [];

    // Horizontal Scroll Animation without pin
    const horizontalScrollAnimation = gsap.to(container, {
      x: () =>
        -(container.scrollWidth - document.documentElement.clientWidth) + "px",
      ease: "none",
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    animations.push(horizontalScrollAnimation);
    if (horizontalScrollAnimation.scrollTrigger) {
      triggers.push(horizontalScrollAnimation.scrollTrigger as ScrollTrigger);
    }

    // Individual card rotation animations
    cards.forEach((card, index) => {
      const cardAnimation = gsap.to(card, {
        rotation: index % 2 === 0 ? -15 : 15, // Alternate rotation direction
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      animations.push(cardAnimation);
      if (cardAnimation.scrollTrigger) {
        triggers.push(cardAnimation.scrollTrigger as ScrollTrigger);
      }
    });

    // Parallax effect for images - they move at a different speed than the cards
    images.forEach((image, index) => {
      const imageAnimation = gsap.to(image, {
        x: index % 2 === 0 ? -100 : 100, // Alternate direction for variety
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2, // Different scrub value for parallax effect
        },
      });

      animations.push(imageAnimation);
      if (imageAnimation.scrollTrigger) {
        triggers.push(imageAnimation.scrollTrigger as ScrollTrigger);
      }
    });

    return () => {
      // Kill only animations created by this component
      animations.forEach((anim) => anim.kill());
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  const cards = [
    {
      id: 1,
      title: "Bar & Drinks",
      description: "Experience ultimate comfort and elegance",
      image: "/images/iris-lavoie.jpg",
    },
    {
      id: 2,
      title: "Traditional Food",
      description: "Authentic Nigerian flavors with contemporary technique",
      image: "/images/food1.jpeg",
    },
    {
      id: 3,
      title: "Garden Dining",
      description: "Dine in the heart of the garden",
      image: "/images/colin.jpg",
    },
    {
      id: 4,
      title: "Weddings & Events",
      description: "Celebrate in a stunning Abuja setting",
      image: "/images/shourav-sheikh.jpg",
    },
    {
      id: 5,
      title: "Live Music",
      description: "Sunset sessions and curated sound experiences",
      image: "/images/annie-lang.jpg",
    },
    {
      id: 6,
      title: "Recreation",
      description: "Pool, games, and outdoor activities",
      image: "/images/pool-game.jpg",
    },
  ];

  // Deterministic rotation values to avoid hydration mismatch
  const getRotation = (index: number) => {
    const rotations = [2.5, -3.2, 4.1, -1.8, 3.7, -2.9];
    return rotations[index % rotations.length];
  };

  return (
    <div
      ref={triggerRef}
      className="relative w-full overflow-hidden bg-[#FAF3EB]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          ref={containerRef}
          className="flex h-full w-max items-center gap-20 md:gap-40"
        >
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="scroll-card mx-8 flex h-full w-[300px] shrink-0 items-center justify-center md:w-[400px]"
              style={{
                transform: `rotate(${getRotation(index)}deg)`,
              }}
            >
              <div className="h-full max-h-[400px] w-full max-w-[500px] overflow-hidden md:max-h-[650px]">
                <div className="h-3/4 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="parallax-image h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollCards;
