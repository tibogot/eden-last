"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/app/lib/gsapConfig";

export type ServiceItem = {
  title: string;
  number: string;
  imageSrc: string;
  imageAlt: string;
};

const defaultServices: ServiceItem[] = [
  {
    title: "Brand Identity",
    number: "01",
    imageSrc: "https://picsum.photos/id/180/800/600",
    imageAlt: "Brand Identity",
  },
  {
    title: "Web Development",
    number: "02",
    imageSrc: "https://picsum.photos/id/60/800/600",
    imageAlt: "Web Development",
  },
  {
    title: "Motion Design",
    number: "03",
    imageSrc: "https://picsum.photos/id/137/800/600",
    imageAlt: "Motion Design",
  },
  {
    title: "Digital Strategy",
    number: "04",
    imageSrc: "https://picsum.photos/id/119/800/600",
    imageAlt: "Digital Strategy",
  },
  {
    title: "Product Design",
    number: "05",
    imageSrc: "https://picsum.photos/id/96/800/600",
    imageAlt: "Product Design",
  },
];

export interface ServicesScrollAnimationProps {
  /** Total scroll height in vh units. Required for Lenis to work without bugs (fixed scroll length). Default 500. */
  scrollHeightVh?: number;
  /** Hero background image URL */
  heroImageSrc?: string;
  /** Footer background image URL */
  footerImageSrc?: string;
  /** Hero title */
  heroTitle?: React.ReactNode;
  /** Hero description */
  heroDescription?: string;
  /** Section header label */
  sectionLabel?: string;
  /** Section header description */
  sectionDescription?: string;
  /** Services list (title, number, image). Defaults to built-in list. */
  services?: ServiceItem[];
  /** Footer title */
  footerTitle?: React.ReactNode;
  /** Footer copyright text */
  footerCopyright?: string;
  /** Optional class for the root container */
  className?: string;
}

export default function ServicesScrollAnimation({
  scrollHeightVh = 500,
  heroImageSrc = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
  footerImageSrc = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
  heroTitle = (
    <>
      We build digital
      <br />
      experiences
    </>
  ),
  heroDescription =
    "Crafting immersive interfaces that push the boundaries of what's possible on the web.",
  sectionLabel = "Our Services",
  sectionDescription =
    "We offer a range of services designed to elevate your brand and deliver meaningful results through design, technology, and strategy.",
  services = defaultServices,
  footerTitle = (
    <>
      Let&apos;s work
      <br />
      together
    </>
  ),
  footerCopyright = "© 2025",
  className = "",
}: ServicesScrollAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const serviceEls = gsap.utils.toArray<HTMLElement>(".service");
      if (serviceEls.length === 0) return;

      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const service = entry.target as HTMLElement;
          const imgContainer = service.querySelector<HTMLElement>(".img");
          if (!imgContainer) return;

          // Image width: 30% → 100%
          const st1 = ScrollTrigger.create({
            trigger: service,
            start: "bottom bottom",
            end: "top top",
            scrub: true,
            onUpdate: (self) => {
              gsap.to(imgContainer, {
                width: `${30 + 70 * self.progress}%`,
                duration: 0.1,
                ease: "none",
              });
            },
          });

          // Row height: 150px → 600px
          const st2 = ScrollTrigger.create({
            trigger: service,
            start: "top bottom",
            end: "top top",
            scrub: true,
            onUpdate: (self) => {
              gsap.to(service, {
                height: `${150 + 450 * self.progress}px`,
                duration: 0.1,
                ease: "none",
              });
            },
          });

          scrollTriggersRef.current.push(st1, st2);
          observer.unobserve(service);
        });
      };

      const observer = new IntersectionObserver(observerCallback, {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      });

      serviceEls.forEach((el) => observer.observe(el));

      return () => {
        observer.disconnect();
        scrollTriggersRef.current.forEach((st) => st.kill());
        scrollTriggersRef.current = [];
      };
    },
    { scope: containerRef, dependencies: [services.length] },
  );

  return (
    <div
      ref={containerRef}
      className={`font-sans text-white antialiased ${className}`}
      style={{ height: `${scrollHeightVh}vh` }}
    >
        {/* Hero */}
        <section className="relative flex h-screen w-full items-end overflow-hidden bg-[#111] p-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImageSrc}
            alt="Hero"
            className="hero-bg absolute inset-0 h-full w-full object-cover"
          />
          <div className="hero-overlay absolute inset-0 bg-gradient-to-t from-black/75 from-15% via-black/15 to-transparent" />
          <div className="hero-content relative z-10 mb-12 max-w-[600px]">
            <h1 className="mb-4 text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight">
              {heroTitle}
            </h1>
            <p className="max-w-[420px] text-[1.1rem] leading-relaxed text-white/55">
              {heroDescription}
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="services flex flex-col bg-black px-8 py-[8em]">
          <div className="services-header mb-8 flex w-full gap-16">
            <div className="col flex-[2]">
              <span className="col-label text-xs uppercase tracking-[0.2em] text-white/35">
                {sectionLabel}
              </span>
            </div>
            <div className="col flex-[5] p-4">
              <p className="max-w-[520px] text-base leading-[1.7] text-white/45">
                {sectionDescription}
              </p>
            </div>
          </div>

          {services.map((item) => (
            <div
              key={item.number}
              className="service flex h-[150px] gap-8 border-t border-white/20 last:border-b last:border-white/20"
            >
              <div className="service-info flex flex-[2] flex-col justify-between p-4">
                <h2 className="text-[clamp(1.5rem,2.5vw,1.875rem)] font-bold tracking-tight">
                  {item.title}
                </h2>
                <span className="number text-sm text-white/30">
                  {item.number}
                </span>
              </div>
              <div className="service-img flex flex-[5] p-4">
                <div className="img h-full w-[30%] overflow-hidden rounded-[10px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    className="block h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Footer */}
        <section className="footer relative flex h-screen w-full items-end overflow-hidden bg-[#111] p-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={footerImageSrc}
            alt="Footer"
            className="footer-bg absolute inset-0 h-full w-full object-cover"
          />
          <div className="footer-overlay absolute inset-0 bg-gradient-to-t from-black/80 from-25% via-black/25 to-transparent" />
          <div className="footer-content relative z-10 mb-8 flex w-full items-end justify-between">
            <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-bold leading-tight tracking-tight">
              {footerTitle}
            </h2>
            <span className="text-sm text-white/35">{footerCopyright}</span>
          </div>
        </section>
      </div>
  );
}
