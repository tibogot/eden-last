"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, Draggable } from "@/app/lib/gsapConfig";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CARD_COUNT = 8;
const MAX_ROTATION = 14; // degrees — total spread from front to back
const SWIPE_THRESHOLD_PX = 50;
const BOUNDS_PX = 400;

function getRotationForIndex(index: number, total: number): number {
  if (index === 0) return 0; // top card is straight
  const step = total > 1 ? MAX_ROTATION / (total - 1) : 0;
  const magnitude = index * step;
  const direction = index % 2 === 0 ? 1 : -1;
  return magnitude * direction;
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
  const pool = cards.slice(0, CARD_COUNT);
  // deckOrder[stackPosition] = cardIndex.  Position 0 = top of stack.
  const deckOrderRef = useRef<number[]>(pool.map((_, i) => i));
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const draggablesRef = useRef<InstanceType<typeof Draggable>[]>([]);
  const isAnimatingRef = useRef(false);
  /** Each card keeps one rotation forever (like a real deck); never change after init. */
  const fixedRotationRef = useRef<number[]>([]);

  // Ref-held functions so GSAP callbacks always call the latest version
  // and circular deps (setupDraggable ↔ sendTopToBack) are broken.
  const fns = useRef({
    applyZIndexOnly: () => {},
    setupDraggable: () => {},
    sendTopToBack: (_?: "left" | "right") => {},
    bringBackToFront: () => {},
  });

  /* ---------- function implementations (updated every render) ---------- */

  /** Only update zIndex so the new top card is on top; never touch rotation (cards keep their fixed rotation). */
  fns.current.applyZIndexOnly = () => {
    const order = deckOrderRef.current;
    const len = order.length;
    order.forEach((cardIdx, stackPos) => {
      const el = cardRefs.current[cardIdx];
      if (!el) return;
      gsap.set(el, { zIndex: len - stackPos });
    });
  };

  fns.current.setupDraggable = () => {
    draggablesRef.current.forEach((d) => d.kill());
    draggablesRef.current = [];

    const topCardIdx = deckOrderRef.current[0];
    const topEl = cardRefs.current[topCardIdx];
    if (!topEl) return;

    const [instance] = Draggable.create(topEl, {
      type: "x,y",
      bounds: {
        minX: -BOUNDS_PX,
        maxX: BOUNDS_PX,
        minY: -BOUNDS_PX,
        maxY: BOUNDS_PX,
      },
      edgeResistance: 0.75,
      onDragEnd: function () {
        const dx = this.x;
        const dy = this.y;
        if (
          Math.abs(dx) >= SWIPE_THRESHOLD_PX ||
          Math.abs(dy) >= SWIPE_THRESHOLD_PX
        ) {
          fns.current.sendTopToBack(dx >= 0 ? "right" : "left");
        } else {
          gsap.to(this.target, { x: 0, y: 0, duration: 0.25 });
        }
      },
    });
    draggablesRef.current.push(instance);
  };

  fns.current.sendTopToBack = (direction: "left" | "right" = "right") => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const order = deckOrderRef.current;
    const topCardIdx = order[0];
    const topEl = cardRefs.current[topCardIdx];
    if (!topEl) {
      isAnimatingRef.current = false;
      return;
    }

    // Kill draggable while animating
    draggablesRef.current.forEach((d) => d.kill());
    draggablesRef.current = [];

    const cardRotation = fixedRotationRef.current[topCardIdx] ?? 0;
    const offX = direction === "right" ? 400 : -400;

    // 1) Fling card off-screen in the swipe/arrow direction
    gsap.to(topEl, {
      x: offX,
      scale: 1.08,
      duration: 0.25,
      ease: "power2.out",
      onComplete: () => {
        // 2) Instantly drop behind the stack
        gsap.set(topEl, { zIndex: 0, rotation: cardRotation });
        // 3) Slide back to centre behind everything
        gsap.to(topEl, {
          x: 0,
          y: 0,
          scale: 0.92,
          duration: 0.35,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(topEl, { scale: 1 });
            const [removed] = order.splice(0, 1);
            order.push(removed);
            fns.current.applyZIndexOnly();
            fns.current.setupDraggable();
            isAnimatingRef.current = false;
          },
        });
      },
    });
  };

  fns.current.bringBackToFront = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const order = deckOrderRef.current;
    const len = order.length;
    const backCardIdx = order[len - 1];
    const backEl = cardRefs.current[backCardIdx];
    if (!backEl) {
      isAnimatingRef.current = false;
      return;
    }

    // Kill draggable while animating
    draggablesRef.current.forEach((d) => d.kill());
    draggablesRef.current = [];

    const backCardRotation = fixedRotationRef.current[backCardIdx] ?? 0;
    gsap.set(backEl, { zIndex: len + 1 });
    gsap.fromTo(
      backEl,
      { x: -400, y: 0 },
      {
        x: 0,
        y: 0,
        scale: 1,
        rotation: backCardRotation,
        duration: 0.35,
        ease: "power2.out",
        onComplete: () => {
          const removed = order.pop()!;
          order.unshift(removed);
          fns.current.applyZIndexOnly();
          fns.current.setupDraggable();
          isAnimatingRef.current = false;
        },
      },
    );
  };

  /* ---------- initial setup — runs once ---------- */

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const order = deckOrderRef.current;
    const len = order.length;

    // Assign each card a fixed rotation once (by initial stack position); never change it.
    order.forEach((cardIdx, stackPos) => {
      fixedRotationRef.current[cardIdx] = getRotationForIndex(stackPos, len);
    });

    order.forEach((cardIdx, stackPos) => {
      const el = cardRefs.current[cardIdx];
      if (!el) return;
      const rotation = fixedRotationRef.current[cardIdx] ?? 0;
      gsap.set(el, {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        scale: 1,
        zIndex: len - stackPos,
        rotation,
      });
    });

    fns.current.setupDraggable();

    return () => {
      draggablesRef.current.forEach((d) => d.kill());
      draggablesRef.current = [];
    };
  }, []);

  return (
    <section
      className={`bg-secondary relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20 ${className}`}
    >
      <h2 className="font-ivy-headline text-primary mb-10 text-center text-3xl md:text-4xl">
        {title}
      </h2>

      <div
        className="relative flex min-h-[460px] w-full max-w-xl items-center justify-center md:min-h-[560px] md:max-w-2xl"
        style={{ perspective: "1200px" }}
      >
        {pool.map((card, index) => (
          <div
            key={card.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="absolute top-1/2 left-1/2 h-[420px] w-[360px] cursor-grab touch-none select-none active:cursor-grabbing md:h-[520px] md:w-[440px]"
            style={{ position: "absolute" }}
          >
            <div className="bg-primary/10 ring-primary/10 relative h-full w-full overflow-hidden rounded-xl shadow-lg ring-1">
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
          onClick={() => fns.current.bringBackToFront()}
          className="border-primary/30 bg-secondary text-primary hover:border-primary hover:bg-primary/10 focus:ring-primary/50 flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors focus:ring-2 focus:outline-none"
          aria-label="Bring previous card to front"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
        <button
          type="button"
          onClick={() => fns.current.sendTopToBack("right")}
          className="border-primary/30 bg-secondary text-primary hover:border-primary hover:bg-primary/10 focus:ring-primary/50 flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors focus:ring-2 focus:outline-none"
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
