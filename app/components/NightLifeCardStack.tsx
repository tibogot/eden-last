"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, Draggable } from "@/app/lib/gsapConfig";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CARD_COUNT = 8;
const ROTATION_TILT = 4; // degrees — each card tilts left or right (alternating)
const SWIPE_THRESHOLD_PX = 50;
const BOUNDS_PX = 400;

function getRotationForIndex(index: number, _total: number): number {
  // Alternate: even index = tilt left (negative), odd = tilt right (positive)
  return index % 2 === 0 ? -ROTATION_TILT : ROTATION_TILT;
}

type CardItem = {
  id: number;
  imageSrc: string;
  alt: string;
};

const defaultCards: CardItem[] = [
  { id: 0, imageSrc: "/images/hero.jpg", alt: "Nightlife 1" },
  { id: 1, imageSrc: "/images/roberto-nickson.jpg", alt: "Nightlife 2" },
  { id: 2, imageSrc: "/images/annie-lang.jpg", alt: "Nightlife 3" },
  { id: 3, imageSrc: "/images/pool-game.jpg", alt: "Nightlife 4" },
  { id: 4, imageSrc: "/images/obinna-okerekeocha.jpg", alt: "Nightlife 5" },
  { id: 5, imageSrc: "/images/hero.jpg", alt: "Nightlife 6" },
  { id: 6, imageSrc: "/images/roberto-nickson.jpg", alt: "Nightlife 7" },
  { id: 7, imageSrc: "/images/annie-lang.jpg", alt: "Nightlife 8" },
];

export default function NightLifeCardStack({
  className = "",
  cards = defaultCards,
  title = "Night Life",
}: {
  className?: string;
  cards?: CardItem[];
  title?: string;
}) {
  const initialDeck = cards.slice(0, CARD_COUNT);
  const [deck, setDeck] = useState<CardItem[]>(initialDeck);
  const [rightTrigger, setRightTrigger] = useState(0);
  const [leftTrigger, setLeftTrigger] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastActionRef = useRef<"left" | "right">("left");
  const draggablesRef = useRef<InstanceType<typeof Draggable>[]>([]);
  const animateToBackRef = useRef<(target: HTMLDivElement, fromIndex: number) => void>(() => {});
  const animateToFrontRef = useRef<(target: HTMLDivElement, fromIndex: number) => void>(() => {});

  useEffect(() => {
    const len = deck.length;

    const animateToBackOfDeck = (
      target: HTMLDivElement,
      fromIndex: number
    ) => {
      const backRotation = getRotationForIndex(len - 1, len);
      // Set rotation immediately so the card already has its "back" tilt while moving — no rotate-after-arrive
      gsap.set(target, { rotation: backRotation });

      gsap.to(target, {
        x: 0,
        y: 0,
        scale: 0.92,
        zIndex: 0,
        duration: 0.35,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(target, { scale: 1 });
          setDeck((prev) => {
            const next = [...prev];
            const [removed] = next.splice(fromIndex, 1);
            next.push(removed);
            return next;
          });
        },
      });
    };

    const animateToFrontOfDeck = (
      target: HTMLDivElement,
      fromIndex: number
    ) => {
      gsap.set(target, { zIndex: len + 1 });
      gsap.fromTo(
        target,
        { x: 300, y: 0 },
        {
          x: 0,
          y: 0,
          scale: 1,
          rotation: getRotationForIndex(0, len),
          duration: 0.35,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(target, { scale: 1 });
            setDeck((prev) => {
              const next = [...prev];
              const [removed] = next.splice(fromIndex, 1);
              next.unshift(removed);
              return next;
            });
          },
        }
      );
    };

    animateToBackRef.current = animateToBackOfDeck;
    animateToFrontRef.current = animateToFrontOfDeck;

    // Kill previous Draggable instances
    draggablesRef.current.forEach((d) => d.kill());
    draggablesRef.current = [];

    cardRefs.current.forEach((cardEl, index) => {
      if (!cardEl) return;

      // Center card and set stack position; only set rotation for non-top cards so the new top doesn't snap-rotate
      const targetRotation = getRotationForIndex(index, len);
      const setProps: Record<string, unknown> = {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        scale: 1,
        zIndex: len - index,
      };
      if (index !== 0) {
        setProps.rotation = targetRotation;
      }
      gsap.set(cardEl, setProps);

      // Only the top card (index 0) is draggable — otherwise you can drag a lower card and the wrong one goes to the back
      if (index === 0) {
        const [instance] = Draggable.create(cardEl, {
          type: "x,y",
          bounds: {
            minX: -BOUNDS_PX,
            maxX: BOUNDS_PX,
            minY: -BOUNDS_PX,
            maxY: BOUNDS_PX,
          },
          edgeResistance: 0.75,
          onDragEnd: function () {
            lastActionRef.current = "left";
            const dx = this.x;
            const dy = this.y;
            if (
              Math.abs(dx) >= SWIPE_THRESHOLD_PX ||
              Math.abs(dy) >= SWIPE_THRESHOLD_PX
            ) {
              gsap.set(this.target, { zIndex: 0 });
              animateToBackOfDeck(this.target as HTMLDivElement, 0);
            } else {
              gsap.to(this.target, { x: 0, y: 0, duration: 0.25 });
            }
          },
        });
        draggablesRef.current.push(instance);
      }
    });

    return () => {
      draggablesRef.current.forEach((d) => d.kill());
      draggablesRef.current = [];
    };
  }, [deck]);

  // Right arrow: send top card to back
  useEffect(() => {
    if (rightTrigger === 0) return;
    const topCard = cardRefs.current[0];
    if (!topCard) return;
    lastActionRef.current = "left";
    gsap.to(topCard, {
      x: -300,
      scale: 1.08,
      duration: 0.25,
      ease: "power2.out",
      onComplete: () => {
        animateToBackRef.current(topCard, 0);
      },
    });
  }, [rightTrigger]);

  // Left arrow: bring last card to front
  useEffect(() => {
    if (leftTrigger === 0) return;
    const lastIndex = deck.length - 1;
    const backCard = cardRefs.current[lastIndex];
    if (!backCard) return;
    lastActionRef.current = "right";
    gsap.set(backCard, { scale: 0.92 });
    gsap.to(backCard, {
      x: 300,
      scale: 1.08,
      duration: 0.25,
      ease: "power2.out",
      onComplete: () => {
        animateToFrontRef.current(backCard, lastIndex);
      },
    });
  }, [leftTrigger]);

  return (
    <section
      className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-secondary px-4 py-20 ${className}`}
    >
      <h2 className="font-ivy-headline text-primary mb-10 text-center text-3xl md:text-4xl">
        {title}
      </h2>

      <div
        className="relative flex min-h-[460px] w-full max-w-xl items-center justify-center md:min-h-[560px] md:max-w-2xl"
        style={{ perspective: "1200px" }}
      >
        {deck.map((card, index) => (
          <div
            key={card.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="absolute left-1/2 top-1/2 h-[420px] w-[360px] cursor-grab touch-none select-none active:cursor-grabbing md:h-[520px] md:w-[440px]"
            style={{ position: "absolute" }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-xl bg-primary/10 shadow-lg ring-1 ring-primary/10">
              <Image
                src={card.imageSrc}
                alt={card.alt}
                fill
                sizes="(max-width: 768px) 360px, 440px"
                className="object-cover"
                draggable={false}
                priority={index < 2}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => setLeftTrigger((c) => c + 1)}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary/30 bg-secondary text-primary transition-colors hover:border-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Bring previous card to front"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
        <button
          type="button"
          onClick={() => setRightTrigger((c) => c + 1)}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary/30 bg-secondary text-primary transition-colors hover:border-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Send top card to back"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>

      <p className="font-neue-haas text-primary/70 mt-6 max-w-sm text-center text-sm">
        Swipe the top card or use the arrows to send it to the back
      </p>
    </section>
  );
}
