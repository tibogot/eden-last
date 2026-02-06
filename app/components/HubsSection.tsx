"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap, Draggable } from "@/app/lib/gsapConfig";
import AnimatedText from "./AnimatedText3";

const TAP_THRESHOLD = 12;

const HUB_CARDS = [
  {
    id: "1",
    src: "/images/colin.jpg",
    alt: "Culinary excellence at Eden Garden",
    title: "Culinary excellence",
    href: "/restaurant",
  },
  {
    id: "2",
    src: "/images/mche-lee-Bribs3.jpg",
    alt: "Live entertainment experiences",
    title: "Live entertainment",
    href: "/experiences",
  },
  {
    id: "3",
    src: "/images/obinna-okerekeocha.jpg",
    alt: "Events and celebrations",
    title: "Events and celebrations",
    href: "/events",
  },
];

// --- horizontalLoop (seamless infinite carousel with draggable) ---
interface HorizontalLoopConfig {
  repeat?: number;
  paused?: boolean;
  speed?: number;
  snap?: number | boolean;
  paddingRight?: number;
  center?: boolean | HTMLElement;
  draggable?: boolean;
  reversed?: boolean;
  onChange?: (element: HTMLElement, index: number) => void;
  onPressInit?: () => void;
  onPress?: (event?: MouseEvent | TouchEvent) => void;
  onDragStart?: () => void;
  minimumMovement?: number;
  onDragEnd?: () => void;
  onClick?: (event: MouseEvent | TouchEvent) => void;
}

interface ExtendedTimeline extends gsap.core.Timeline {
  toIndex?: (index: number, vars?: gsap.TweenVars) => gsap.core.Tween | number;
  closestIndex?: (setCurrent?: boolean) => number;
  current?: () => number;
  next?: (vars?: gsap.TweenVars) => gsap.core.Tween | number;
  previous?: (vars?: gsap.TweenVars) => gsap.core.Tween | number;
  times?: number[];
  draggable?: Draggable;
}

function horizontalLoop(
  items: HTMLElement[],
  config: HorizontalLoopConfig = {}
): ExtendedTimeline {
  items = gsap.utils.toArray(items) as HTMLElement[];

  const onChange = config.onChange;
  let lastIndex = 0;
  const tl = gsap.timeline({
    repeat: config.repeat,
    onUpdate:
      onChange &&
      function () {
        const i = (tl as ExtendedTimeline).closestIndex?.() ?? 0;
        if (lastIndex !== i) {
          lastIndex = i;
          onChange(items[i], i);
        }
      },
    paused: config.paused,
    defaults: { ease: "none" },
    onReverseComplete: () => {
      tl.totalTime(tl.rawTime() + tl.duration() * 100);
    },
  }) as ExtendedTimeline;
  const length = items.length;
  const startX = items[0].offsetLeft;
  const times: number[] = [];
  const widths: number[] = [];
  const spaceBefore: number[] = [];
  const xPercents: number[] = [];
  let curIndex = 0;
  let indexIsDirty = false;
  const center = config.center;
  const pixelsPerSecond = (config.speed || 1) * 100;
  const snap =
    config.snap === false
      ? (v: number) => v
      : gsap.utils.snap(typeof config.snap === "number" ? config.snap : 1);
  let timeOffset = 0;
  const container =
    center === true
      ? items[0].parentNode
      : (center ? gsap.utils.toArray(center as HTMLElement)[0] : null) ||
        items[0].parentNode;
  let totalWidth: number;
  const getTotalWidth = () => {
    const scaleX = gsap.getProperty(items[length - 1], "scaleX") as number;
    return (
      items[length - 1].offsetLeft +
      (xPercents[length - 1] / 100) * widths[length - 1] -
      startX +
      spaceBefore[0] +
      items[length - 1].offsetWidth *
        (typeof scaleX === "number" ? scaleX : 1) +
      (parseFloat(config.paddingRight?.toString() || "0") || 0)
    );
  };
  const populateWidths = () => {
    let b1 = (container as HTMLElement).getBoundingClientRect();
    let b2: DOMRect;
    items.forEach((el, i) => {
      widths[i] = parseFloat(gsap.getProperty(el, "width", "px") as string);
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, "x", "px") as string) / widths[i]) *
          100 +
          (gsap.getProperty(el, "xPercent") as number)
      );
      b2 = el.getBoundingClientRect();
      spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
      b1 = b2;
    });
    gsap.set(items, {
      xPercent: (i: number) => xPercents[i],
    });
    totalWidth = getTotalWidth();
  };
  let timeWrap: (time: number) => number = (time: number) => time;
  const populateOffsets = () => {
    timeOffset = center
      ? (tl.duration() * (container as HTMLElement).offsetWidth) /
        2 /
        totalWidth
      : 0;
    if (center) {
      times.forEach((t, i) => {
        const labels = (
          tl as ExtendedTimeline & { labels: Record<string, number> }
        ).labels;
        times[i] = timeWrap(
          (labels?.["label" + i] ?? 0) +
            (tl.duration() * widths[i]) / 2 / totalWidth -
            timeOffset
        );
      });
    }
  };
  const getClosest = (values: number[], value: number, wrap: number) => {
    let i = values.length,
      closest = 1e10,
      index = 0,
      d;
    while (i--) {
      d = Math.abs(values[i] - value);
      if (d > wrap / 2) {
        d = wrap - d;
      }
      if (d < closest) {
        closest = d;
        index = i;
      }
    }
    return index;
  };
  const populateTimeline = () => {
    let i: number;
    let item: HTMLElement;
    let curX: number;
    let distanceToStart: number;
    let distanceToLoop: number;
    tl.clear();
    for (i = 0; i < length; i++) {
      item = items[i];
      curX = (xPercents[i] / 100) * widths[i];
      distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
      const scaleX = gsap.getProperty(item, "scaleX") as number;
      distanceToLoop =
        distanceToStart + widths[i] * (typeof scaleX === "number" ? scaleX : 1);
      tl.to(
        item,
        {
          xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
          duration: distanceToLoop / pixelsPerSecond,
        },
        0
      )
        .fromTo(
          item,
          {
            xPercent: snap(
              ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
            ),
          },
          {
            xPercent: xPercents[i],
            duration:
              (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
            immediateRender: false,
          },
          distanceToLoop / pixelsPerSecond
        )
        .add("label" + i, distanceToStart / pixelsPerSecond);
      times[i] = distanceToStart / pixelsPerSecond;
    }
    timeWrap = gsap.utils.wrap(0, tl.duration());
  };
  const refresh = (deep?: boolean) => {
    const progress = tl.progress();
    tl.progress(0, true);
    populateWidths();
    if (deep) {
      populateTimeline();
    }
    populateOffsets();
    if (deep && tl.draggable) {
      tl.time(times[curIndex], true);
    } else {
      tl.progress(progress, true);
    }
  };
  const onResize = () => refresh(true);
  let proxy: HTMLDivElement;

  gsap.set(items, { x: 0 });
  populateWidths();
  populateTimeline();
  populateOffsets();
  window.addEventListener("resize", onResize);

  function toIndex(
    index: number,
    vars?: gsap.TweenVars
  ): gsap.core.Tween | number {
    const tweenVars: gsap.TweenVars = vars || {};
    if (Math.abs(index - curIndex) > length / 2) {
      index += index > curIndex ? -length : length;
    }
    const newIndex = gsap.utils.wrap(0, length, index);
    let time = times[newIndex];
    if (time > tl.time() !== index > curIndex && index !== curIndex) {
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    if (time < 0 || time > tl.duration()) {
      tweenVars.modifiers = { time: timeWrap };
    }
    curIndex = newIndex;
    tweenVars.overwrite = true;
    gsap.killTweensOf(proxy);
    if (tweenVars.duration === 0) {
      const result = tl.time(timeWrap(time));
      return result as unknown as number;
    }
    return tl.tweenTo(time, tweenVars);
  }

  tl.toIndex = (
    index: number,
    vars?: gsap.TweenVars
  ): gsap.core.Tween | number => toIndex(index, vars);
  tl.closestIndex = (setCurrent?: boolean) => {
    const index = getClosest(times, tl.time(), tl.duration());
    if (setCurrent) {
      curIndex = index;
      indexIsDirty = false;
    }
    return index;
  };
  tl.current = () => (indexIsDirty ? (tl.closestIndex?.(true) ?? 0) : curIndex);
  tl.next = (vars?: gsap.TweenVars) => toIndex((tl.current?.() ?? 0) + 1, vars);
  tl.previous = (vars?: gsap.TweenVars) =>
    toIndex((tl.current?.() ?? 0) - 1, vars);
  tl.times = times;
  tl.progress(1, true).progress(0, true);

  if (config.reversed) {
    const vars = tl.vars as gsap.TimelineVars;
    if (vars.onReverseComplete) {
      vars.onReverseComplete();
    }
    tl.reverse();
  }

  if (config.draggable && typeof Draggable === "function") {
    proxy = document.createElement("div");
    const wrap = gsap.utils.wrap(0, 1);
    let ratio: number;
    let startProgress: number;
    let lastSnap: number;
    let initChangeX: number;
    let wasPlaying: boolean;

    const draggableInstance = Draggable.create(proxy, {
      trigger: items[0].parentNode as HTMLElement,
      type: "x",
      dragClickables: true,
      minimumMovement: config.minimumMovement ?? 12,
      onPressInit() {
        const x = this.x;
        gsap.killTweensOf(tl);
        wasPlaying = !tl.paused();
        tl.pause();
        startProgress = tl.progress();
        refresh();
        ratio = 1 / totalWidth;
        initChangeX = startProgress / -ratio - x;
        gsap.set(proxy, { x: startProgress / -ratio });
        config.onPressInit?.();
      },
      onPress(event?: MouseEvent | TouchEvent) {
        config.onPress?.(event);
      },
      onDragStart: () => config.onDragStart?.(),
      onDrag() {
        tl.progress(
          wrap(
            startProgress +
              (draggableInstance.startX - draggableInstance.x) * ratio
          )
        );
      },
      onThrowUpdate() {
        tl.progress(
          wrap(
            startProgress +
              (draggableInstance.startX - draggableInstance.x) * ratio
          )
        );
      },
      overshootTolerance: 0,
      inertia: true,
      snap(value: number) {
        if (Math.abs(startProgress / -ratio - this.x) < 10) {
          return lastSnap + initChangeX;
        }
        const time = -(value * ratio) * tl.duration();
        const wrappedTime = timeWrap(time);
        const snapTime = times[getClosest(times, wrappedTime, tl.duration())];
        let dif = snapTime - wrappedTime;
        if (Math.abs(dif) > tl.duration() / 2) {
          dif += dif < 0 ? tl.duration() : -tl.duration();
        }
        lastSnap = (time + dif) / tl.duration() / -ratio;
        return lastSnap;
      },
      onRelease() {
        tl.closestIndex?.(true);
        if (draggableInstance.isThrowing) {
          indexIsDirty = true;
        }
        config.onDragEnd?.();
      },
      onThrowComplete: () => {
        tl.closestIndex?.(true);
        if (wasPlaying) {
          tl.play();
        }
        config.onDragEnd?.();
      },
      onClick(e: MouseEvent | TouchEvent) {
        config.onClick?.(e);
      },
    })[0];
    tl.draggable = draggableInstance as unknown as Draggable;
  }

  tl.closestIndex?.(true);
  lastIndex = curIndex;
  if (onChange) {
    onChange(items[curIndex], curIndex);
  }

  const originalKill = tl.kill.bind(tl);
  tl.kill = function (this: ExtendedTimeline): ExtendedTimeline {
    window.removeEventListener("resize", onResize);
    if (tl.draggable) tl.draggable.kill();
    originalKill();
    return tl;
  };
  return tl;
}

// --- HubsSection component ---
export default function HubsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<ExtendedTimeline | null>(null);

  const dragStateRef = useRef({
    isDragging: false,
    startPointerX: 0,
    startPointerY: 0,
    pointerMoved: false,
  });

  const go = useCallback((direction: 1 | -1) => {
    const loop = loopRef.current;
    if (!loop) return;
    const vars = { duration: 0.35, ease: "power2.out" as const };
    if (direction === 1) loop.next?.(vars);
    else loop.previous?.(vars);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = gsap.utils.toArray(
      container.querySelectorAll(".hub-card")
    ) as HTMLElement[];
    if (items.length === 0) return;

    const loop = horizontalLoop(items, {
      repeat: -1,
      paused: true,
      draggable: true,
      center: false,
      paddingRight: 24,
      minimumMovement: TAP_THRESHOLD,
      onPressInit() {
        dragStateRef.current.isDragging = false;
        dragStateRef.current.pointerMoved = false;
      },
      onPress(event?: MouseEvent | TouchEvent) {
        dragStateRef.current.pointerMoved = false;
        if (event) {
          if ("touches" in event && event.touches.length > 0) {
            dragStateRef.current.startPointerX = event.touches[0].clientX;
            dragStateRef.current.startPointerY = event.touches[0].clientY;
          } else if ("clientX" in event) {
            dragStateRef.current.startPointerX = event.clientX;
            dragStateRef.current.startPointerY = event.clientY;
          }
        }
      },
      onDragStart() {
        dragStateRef.current.isDragging = true;
        dragStateRef.current.pointerMoved = true;
      },
      onDragEnd() {
        setTimeout(() => {
          dragStateRef.current.isDragging = false;
        }, 50);
      },
      onClick() {
        // Allow default link behavior on tap (no drag) - Link handles navigation
      },
    });
    loopRef.current = loop;

    const handlePointerDown = (e: PointerEvent) => {
      dragStateRef.current.pointerMoved = false;
      dragStateRef.current.startPointerX = e.clientX;
      dragStateRef.current.startPointerY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const deltaX = Math.abs(
        e.clientX - dragStateRef.current.startPointerX
      );
      const deltaY = Math.abs(
        e.clientY - dragStateRef.current.startPointerY
      );
      if (deltaX > TAP_THRESHOLD || deltaY > TAP_THRESHOLD) {
        dragStateRef.current.pointerMoved = true;
      }
    };

    const handleLinkClick = (e: Event) => {
      if (
        dragStateRef.current.isDragging ||
        dragStateRef.current.pointerMoved
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    container.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });
    container.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    const links = container.querySelectorAll("a.hub-card-link");
    links.forEach((link) => {
      link.addEventListener("click", handleLinkClick, { capture: true });
    });

    return () => {
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      links.forEach((link) => {
        link.removeEventListener("click", handleLinkClick, { capture: true });
      });
      loop.kill();
      loopRef.current = null;
    };
  }, []);

  return (
    <section className="relative w-full bg-primary py-16 md:py-24">
      <div className="px-4 md:px-8">
        <span className="font-neue-haas mb-6 block text-xs uppercase tracking-wider text-white">
          Experiences
        </span>
        <div className="mt-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
          <AnimatedText>
            <h2 className="max-w-3xl font-ivy-headline text-4xl leading-tight font-normal text-white md:text-5xl lg:text-6xl">
              Discover the best of Eden Park & Garden
            </h2>
          </AnimatedText>
          <Link
            href="/experiences"
            className="shrink-0 font-neue-haas text-xs uppercase tracking-wider text-white underline transition-opacity hover:opacity-70"
          >
            View all experiences
          </Link>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-10 pl-4 md:pl-8 lg:mt-40 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div className="flex flex-col gap-8 lg:max-w-md">
          <p className="font-neue-haas text-base leading-relaxed text-white md:text-lg">
            Culinary excellence, live entertainment, and unforgettable events —
            all in one vibrant oasis.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center bg-white/10 text-white transition-opacity hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Previous hub"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center bg-white/10 text-white transition-opacity hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Next hub"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>
        <div className="relative min-w-0 flex-1 overflow-hidden lg:max-w-3xl xl:max-w-4xl">
          <div
            ref={containerRef}
            className="flex w-max cursor-grab gap-6 pl-0 select-none active:cursor-grabbing"
            style={{ touchAction: "pan-y" }}
          >
            {HUB_CARDS.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                className="hub-card hub-card-link relative block aspect-3/4 w-[320px] shrink-0 overflow-hidden md:aspect-4/5 md:w-[400px] lg:aspect-4/5 lg:w-[480px]"
                draggable={false}
              >
                <Image
                  src={card.src}
                  alt={card.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 480px, (min-width: 768px) 400px, 320px"
                  draggable={false}
                />
                <div className="absolute bottom-0 left-0 p-4 md:p-5">
                  <p className="max-w-xs font-neue-haas text-base font-normal text-white md:text-2xl lg:text-2xl">
                    {card.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
