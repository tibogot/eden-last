"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, Draggable, ScrollTrigger } from "@/app/lib/gsapConfig";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Dark mode colors for the "After dark" section
const LIGHT_BG = "#fffdf6";
const LIGHT_TEXT = "#465643";
const LIGHT_TEXT_MUTED = "rgba(70, 86, 67, 0.8)";
const LIGHT_TEXT_SUBTLE = "rgba(70, 86, 67, 0.7)";
const LIGHT_BORDER = "rgba(70, 86, 67, 0.3)";
const DARK_BG = "#0c0c0c";
const DARK_TEXT = "#fffdf6";
const DARK_TEXT_MUTED = "rgba(255, 253, 246, 0.85)";
const DARK_TEXT_SUBTLE = "rgba(255, 253, 246, 0.6)";
const DARK_BORDER = "rgba(255, 253, 246, 0.35)";

const CARD_COUNT = 8;
const MAX_ROTATION = 14; // degrees — total spread from front to back
const SWIPE_THRESHOLD_PX = 50;
const BOUNDS_PX = 400;
const MOBILE_BREAKPOINT = 768;

function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
}

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
  {
    id: 0,
    imageSrc: "/images/night/angelo-pantazis-lkUUCBKQL9E-unsplash.jpg",
    alt: "Nightlife 1",
  },
  {
    id: 1,
    imageSrc: "/images/night/axel-gallay-vTNBqfUfRxM-unsplash.jpg",
    alt: "Nightlife 2",
  },
  {
    id: 2,
    imageSrc: "/images/night/cheng-feng-fw8QYwDzp8k-unsplash.jpg",
    alt: "Nightlife 3",
  },
  {
    id: 3,
    imageSrc: "/images/night/ethan-rheams-fEM9otYJK4c-unsplash.jpg",
    alt: "Nightlife 4",
  },
  {
    id: 4,
    imageSrc: "/images/night/john-arano-_qADvinJi20-unsplash.jpg",
    alt: "Nightlife 5",
  },
  {
    id: 5,
    imageSrc: "/images/night/one-zone-studio-vj3WPY_QCJc-unsplash.jpg",
    alt: "Nightlife 6",
  },
  {
    id: 6,
    imageSrc: "/images/night/petar-avramoski-VzPqBD-UawI-unsplash.jpg",
    alt: "Nightlife 7",
  },
  {
    id: 7,
    imageSrc: "/images/night/richard-brutyo-jfy3H7O8198-unsplash.jpg",
    alt: "Nightlife 8",
  },
];

export default function NightLifeCardStack({
  className = "",
  cards = defaultCards,
  label = "AFTER DARK",
  title = "Parties, Shows & Unforgettable Nights",
  body = "Eden Garden comes alive after dark with live music, cocktails, and an atmosphere that turns every evening into an unforgettable experience.",
}: {
  className?: string;
  cards?: CardItem[];
  label?: string;
  title?: string;
  body?: string;
}) {
  const pool = cards.slice(0, CARD_COUNT);
  // deckOrder[stackPosition] = cardIndex.  Position 0 = top of stack.
  const deckOrderRef = useRef<number[]>(pool.map((_, i) => i));
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const draggablesRef = useRef<InstanceType<typeof Draggable>[]>([]);
  const isAnimatingRef = useRef(false);
  const isMobileRef = useRef(isMobileViewport());
  /** Each card keeps one rotation forever (like a real deck); never change after init. */
  const fixedRotationRef = useRef<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  // Ref-held functions so GSAP callbacks always call the latest version
  // and circular deps (setupDraggable ↔ sendTopToBack) are broken.
  const fns = useRef({
    applyZIndexOnly: () => {},
    setupDraggable: () => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- implementation uses the arg
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

    const mobile = isMobileRef.current;
    // On mobile: horizontal-only so vertical swipe scrolls the page
    const dragType = mobile ? "x" : "x,y";
    const bounds = mobile
      ? { minX: -BOUNDS_PX, maxX: BOUNDS_PX }
      : {
          minX: -BOUNDS_PX,
          maxX: BOUNDS_PX,
          minY: -BOUNDS_PX,
          maxY: BOUNDS_PX,
        };

    const [instance] = Draggable.create(topEl, {
      type: dragType,
      bounds,
      edgeResistance: 0.75,
      onDragEnd: function () {
        const dx = this.x;
        const dy = this.y;
        if (
          Math.abs(dx) >= SWIPE_THRESHOLD_PX ||
          (!mobile && Math.abs(dy) >= SWIPE_THRESHOLD_PX)
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

  useEffect(() => {
    isMobileRef.current = isMobileViewport();
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

    const handleResize = () => {
      const wasMobile = isMobileRef.current;
      isMobileRef.current = isMobileViewport();
      if (wasMobile !== isMobileRef.current) {
        fns.current.setupDraggable();
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      draggablesRef.current.forEach((d) => d.kill());
      draggablesRef.current = [];
    };
  }, []);

  /* ---------- Dark mode: mobile = always dark, desktop = scroll-triggered transition ---------- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mobile = isMobileViewport();

    if (mobile) {
      // Mobile: always night mode, no animation
      gsap.set(section, {
        "--ad-bg": DARK_BG,
        "--ad-text": DARK_TEXT,
        "--ad-text-muted": DARK_TEXT_MUTED,
        "--ad-text-subtle": DARK_TEXT_SUBTLE,
        "--ad-border": DARK_BORDER,
      } as gsap.TweenVars);
      return;
    }

    // Desktop: start light, animate to dark on scroll
    gsap.set(section, {
      "--ad-bg": LIGHT_BG,
      "--ad-text": LIGHT_TEXT,
      "--ad-text-muted": LIGHT_TEXT_MUTED,
      "--ad-text-subtle": LIGHT_TEXT_SUBTLE,
      "--ad-border": LIGHT_BORDER,
    } as gsap.TweenVars);

    let trigger: ScrollTrigger | null = null;
    const setupTrigger = () => {
      trigger = ScrollTrigger.create({
        trigger: section,
        start: "top 50%",
        onEnter: () => {
          gsap.to(section, {
            "--ad-bg": DARK_BG,
            "--ad-text": DARK_TEXT,
            "--ad-text-muted": DARK_TEXT_MUTED,
            "--ad-text-subtle": DARK_TEXT_SUBTLE,
            "--ad-border": DARK_BORDER,
            duration: 1.1,
            ease: "power2.inOut",
          } as gsap.TweenVars);
        },
        onLeaveBack: () => {
          gsap.to(section, {
            "--ad-bg": LIGHT_BG,
            "--ad-text": LIGHT_TEXT,
            "--ad-text-muted": LIGHT_TEXT_MUTED,
            "--ad-text-subtle": LIGHT_TEXT_SUBTLE,
            "--ad-border": LIGHT_BORDER,
            duration: 1.1,
            ease: "power2.inOut",
          } as gsap.TweenVars);
        },
      });
    };

    const raf = requestAnimationFrame(() => setupTrigger());
    return () => {
      cancelAnimationFrame(raf);
      trigger?.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative flex min-h-[120vh] flex-col items-center justify-center overflow-hidden px-4 py-24 [--ad-bg:#0c0c0c] [--ad-text:#fffdf6] [--ad-text-muted:rgba(255,253,246,0.85)] [--ad-text-subtle:rgba(255,253,246,0.6)] [--ad-border:rgba(255,253,246,0.35)] md:[--ad-bg:#fffdf6] md:[--ad-text:#465643] md:[--ad-text-muted:rgba(70,86,67,0.8)] md:[--ad-text-subtle:rgba(70,86,67,0.7)] md:[--ad-border:rgba(70,86,67,0.3)] ${className}`}
      style={{
        backgroundColor: "var(--ad-bg)",
        color: "var(--ad-text)",
      }}
    >
      <div className="mb-20 flex flex-col items-center text-center">
        <span
          className="font-neue-haas mb-6 text-xs tracking-wider uppercase"
          style={{ color: "var(--ad-text)" }}
        >
          {label}
        </span>
        <h2
          className="font-ivy-headline mb-8 max-w-3xl text-4xl leading-tight md:text-5xl"
          style={{ color: "var(--ad-text)" }}
        >
          {title}
        </h2>
        <p
          className="mx-auto max-w-xl text-center text-lg"
          style={{ color: "var(--ad-text-muted)" }}
        >
          {body}
        </p>
      </div>

      <div
        className="relative flex min-h-[380px] w-full max-w-xl items-center justify-center sm:min-h-[440px] md:min-h-[640px] md:max-w-2xl"
        style={{ perspective: "1200px" }}
      >
        {pool.map((card, index) => (
          <div
            key={card.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="absolute top-1/2 left-1/2 h-[320px] w-[280px] cursor-grab touch-none select-none active:cursor-grabbing sm:h-[380px] sm:w-[320px] md:h-[520px] md:w-[440px]"
            style={{ position: "absolute" }}
          >
            <div
              className="relative h-full w-full overflow-hidden rounded-xl shadow-lg"
              style={{
                backgroundColor: "rgba(255, 253, 246, 0.08)",
                border: "1px solid var(--ad-border)",
              }}
            >
              <Image
                src={card.imageSrc}
                alt={card.alt}
                fill
                sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 440px"
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
          onClick={() => fns.current.sendTopToBack("left")}
          className="focus:ring-primary/50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 transition-colors focus:ring-2 focus:outline-none"
          style={{
            borderColor: "var(--ad-border)",
            backgroundColor: "var(--ad-bg)",
            color: "var(--ad-text)",
          }}
          aria-label="Send top card to back (left)"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
        <button
          type="button"
          onClick={() => fns.current.sendTopToBack("right")}
          className="focus:ring-primary/50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 transition-colors focus:ring-2 focus:outline-none"
          style={{
            borderColor: "var(--ad-border)",
            backgroundColor: "var(--ad-bg)",
            color: "var(--ad-text)",
          }}
          aria-label="Send top card to back"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>

      <p
        className="font-neue-haas mx-auto mt-6 max-w-sm text-center text-sm"
        style={{ color: "var(--ad-text-subtle)" }}
      >
        Swipe the top card or use the arrows to send it to the back
      </p>
    </section>
  );
}
