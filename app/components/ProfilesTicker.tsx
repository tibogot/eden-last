"use client";

import { useRef, useEffect } from "react";
import { gsap, Draggable } from "../lib/gsapConfig";
import Image from "next/image";

// Define TypeScript interfaces
interface ProfileType {
  id: number;
  name: string;
  title: string;
  description: string;
  image: string;
  countries: string[];
}

const PROFILES: ProfileType[] = [
  {
    id: 1,
    name: "Chief Christian Nwogu",
    title: "Chairman",
    description:
      "Leading the company with decades of construction experience and strategic vision.",
    image: "/images/Chairman-scaled-tiny.jpg",
    countries: ["Allemagne", "Luxembourg"],
  },
  {
    id: 2,
    name: "Engr. Chukwudi Nwogu",
    title: "Co-Founder & CEO",
    description:
      "Driving innovation and excellence in construction and engineering solutions.",
    image:
      "https://coanwaltd.com/wp-content/uploads/2022/04/MD-scaled-e1692892180900.jpg",
    countries: ["Allemagne", "France"],
  },
  {
    id: 3,
    name: "Nonso Nwogwu",
    title: "Director",
    description:
      "Overseeing strategic operations and ensuring project delivery excellence.",
    image:
      "https://coanwaltd.com/wp-content/uploads/2022/04/pexels-dellon-thomas-1405963.jpg",
    countries: ["France"],
  },
  {
    id: 4,
    name: "Engr Ralf Jonas",
    title: "CTO",
    description:
      "Leading technological innovation and digital transformation initiatives.",
    image:
      "https://coanwaltd.com/wp-content/uploads/2022/04/pexels-dellon-thomas-2474307.jpg",
    countries: ["USA"],
  },
  {
    id: 5,
    name: "Mr Ugwu Osita Sabastine",
    title: "Accountant",
    description:
      "Managing financial operations and ensuring fiscal responsibility.",
    image:
      "https://coanwaltd.com/wp-content/uploads/2018/12/Mr-Ugwu-Osita-Sabastine.jpg",
    countries: ["UK"],
  },
  {
    id: 6,
    name: "Akubor George",
    title: "Secretary",
    description:
      "Coordinating administrative functions and organizational communications.",
    image:
      "https://coanwaltd.com/wp-content/uploads/2022/04/George-Edited.jpg ",
    countries: ["UK"],
  },
  {
    id: 7,
    name: "Mr Osagie Omoragbon",
    title: "Admin Manager",
    description: "Managing daily operations and administrative excellence.",
    image:
      "https://coanwaltd.com/wp-content/uploads/2018/12/Mr-Omoragbon-Paul-Osagie-768x1024.jpg ",
    countries: ["UK"],
  },
];

// Config interface for horizontalLoop
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
}

// Extended Timeline interface with custom methods
interface ExtendedTimeline extends gsap.core.Timeline {
  toIndex?: (index: number, vars?: gsap.TweenVars) => gsap.core.Tween | number;
  closestIndex?: (setCurrent?: boolean) => number;
  current?: () => number;
  next?: (vars?: gsap.TweenVars) => gsap.core.Tween | number;
  previous?: (vars?: gsap.TweenVars) => gsap.core.Tween | number;
  times?: number[];
  draggable?: Draggable;
}

/**
 * GSAP horizontalLoop helper function
 * Creates a seamless infinite horizontal loop with draggable support
 * Based on official GSAP helper: https://gsap.com/docs/v3/HelperFunctions/helpers/seamlessLoop/
 */
function horizontalLoop(
  items: HTMLElement[],
  config: HorizontalLoopConfig = {},
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
          (gsap.getProperty(el, "xPercent") as number),
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
            timeOffset,
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
        0,
      )
        .fromTo(
          item,
          {
            xPercent: snap(
              ((curX - distanceToLoop + totalWidth) / widths[i]) * 100,
            ),
          },
          {
            xPercent: xPercents[i],
            duration:
              (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
            immediateRender: false,
          },
          distanceToLoop / pixelsPerSecond,
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
    vars?: gsap.TweenVars,
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
    vars?: gsap.TweenVars,
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

  // DRAGGABLE CONFIGURATION
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
      },
      onDrag() {
        tl.progress(
          wrap(
            startProgress +
              (draggableInstance.startX - draggableInstance.x) * ratio,
          ),
        );
      },
      onThrowUpdate() {
        tl.progress(
          wrap(
            startProgress +
              (draggableInstance.startX - draggableInstance.x) * ratio,
          ),
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
      },
      onThrowComplete: () => {
        tl.closestIndex?.(true);
        if (wasPlaying) {
          tl.play();
        }
      },
    })[0];
    tl.draggable = draggableInstance as unknown as Draggable;
  }

  tl.closestIndex?.(true);
  lastIndex = curIndex;
  if (onChange) {
    onChange(items[curIndex], curIndex);
  }

  return tl;
}

const ProfilesTicker = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const items = gsap.utils.toArray(".profile-card") as HTMLElement[];

    // Create the horizontal loop with draggable enabled
    const loop = horizontalLoop(items, {
      repeat: -1,
      speed: 0.5, // Adjust speed (lower = slower)
      draggable: true,
      center: false,
      paddingRight: 0,
    });

    // Cleanup
    return () => {
      loop.kill();
    };
  }, []);

  return (
    <div className="relative z-10 w-full overflow-hidden py-0">
      <div
        ref={containerRef}
        className="flex cursor-grab active:cursor-grabbing"
      >
        {PROFILES.map((profile) => (
          <div
            key={profile.id}
            className="profile-card group relative m-4 flex h-[400px] w-[280px] shrink-0 cursor-pointer flex-col md:h-[600px] md:w-[400px]"
          >
            {/* Profile Image */}
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={profile.image}
                alt={profile.name}
                fill
                className="object-cover transition-transform duration-600 ease-in-out group-hover:scale-105"
                sizes="(max-width: 768px) 280px, 400px"
                unoptimized={profile.image.startsWith("http")}
              />
              {/* Info Card - moves up on hover to reveal full content */}
              <div className="absolute right-0 bottom-0 left-0 h-16 overflow-hidden transition-all duration-500 ease-out group-hover:h-32 md:h-20 md:group-hover:h-40">
                <div className="bg-secondary absolute right-0 bottom-0 left-0 flex h-32 translate-y-16 flex-col justify-between px-4 py-3 transition-transform duration-500 ease-out group-hover:translate-y-0 md:h-40 md:translate-y-20 md:px-6 md:py-4">
                  <div className="flex flex-col">
                    <h3 className="font-pp-neue-montreal text-left text-lg text-white md:text-2xl">
                      {profile.name}
                    </h3>
                    <p className="font-pp-neue-montreal-mono text-left text-sm text-white/80 uppercase md:text-sm">
                      {profile.title}
                    </p>
                  </div>
                  <div>
                    <p className="font-pp-neue-montreal text-left text-xs text-white/70 md:text-sm">
                      {profile.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilesTicker;
