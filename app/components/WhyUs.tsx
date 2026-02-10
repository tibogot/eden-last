"use client";

import Link from "next/link";
import Image from "next/image";
import AnimatedText from "./AnimatedText3";

interface WhyUsSectionProps {
  pinnedImageSrc?: string;
  pinnedImageAlt?: string;
}

export default function WhyUsSection({
  pinnedImageSrc = "/images/iris-lavoie.jpg",
  pinnedImageAlt = "Eden Garden",
}: WhyUsSectionProps) {
  return (
    <section className="bg-secondary relative w-full px-4 py-8 md:px-8 md:py-20">
      <span className="font-neue-haas text-primary mb-6 block text-xs tracking-wider uppercase">
        WHY CHOOSE US
      </span>
      <AnimatedText>
        <h2 className="font-ivy-headline text-primary mt-20 max-w-xl text-left text-4xl leading-tight md:text-5xl">
          A place where nature meets the table.
        </h2>
      </AnimatedText>
      <div className="w-full">
        {/* Two column layout - items-stretch so left column is tall; sticky needs a tall containing block */}
        <div className="mt-20 flex flex-col md:mt-24 md:flex-row md:items-stretch md:gap-16">
          {/* Left: CSS sticky title + image (pin together) */}
          <div className="shrink-0 pb-12 md:w-1/2 md:pb-0">
            <div className="flex flex-col gap-6 md:sticky md:top-30">
              {/* <h2 className="font-ivy-headline text-primary max-w-xl text-left text-4xl leading-tight font-normal md:text-5xl">
                A place where nature meets the table.
              </h2> */}
              <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-[5/6] md:max-w-[75%]">
                <Image
                  src={pinnedImageSrc}
                  alt={pinnedImageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 38vw"
                />
              </div>
            </div>
          </div>

          {/* Right: 5 cards - horizontal scroll on mobile, stacked on desktop */}
          <div className="md:w-1/2">
            <div className="-mx-4 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] md:mx-0 md:snap-none md:flex-col md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
              <div className="border-primary/15 w-[260px] min-w-[260px] shrink-0 snap-center border p-5 md:min-h-[280px] md:w-auto md:min-w-0 md:p-10">
                <h3 className="font-ivy-headline text-primary mb-8 text-xl leading-tight md:mb-10 md:text-2xl">
                  (01)
                </h3>
                <p className="font-neue-haas text-primary/90 max-w-lg text-base leading-relaxed md:text-lg">
                  From our garden to your plate — we grow and source with care,
                  so every dish tells a story of quality and sustainability.
                </p>
              </div>

              <div className="border-primary/15 w-[260px] min-w-[260px] shrink-0 snap-center border p-5 md:min-h-[280px] md:w-auto md:min-w-0 md:p-10">
                <h3 className="font-ivy-headline text-primary mb-8 text-xl leading-tight md:mb-10 md:text-2xl">
                  (02)
                </h3>
                <p className="font-neue-haas text-primary/90 max-w-lg text-base leading-relaxed md:text-lg">
                  Years of passion for food and hospitality mean every detail —
                  from the setting to the service — is crafted for you.
                </p>
              </div>

              <div className="border-primary/15 w-[260px] min-w-[260px] shrink-0 snap-center border p-5 md:min-h-[280px] md:w-auto md:min-w-0 md:p-10">
                <h3 className="font-ivy-headline text-primary mb-8 text-xl leading-tight md:mb-10 md:text-2xl">
                  (03)
                </h3>
                <p className="font-neue-haas text-primary/90 max-w-lg text-base leading-relaxed md:text-lg">
                  We bring together seasonal ingredients, a unique atmosphere,
                  and a team that loves what they do — so your experience is
                  memorable.
                </p>
              </div>

              <div className="border-primary/15 w-[260px] min-w-[260px] shrink-0 snap-center border p-5 md:min-h-[280px] md:w-auto md:min-w-0 md:p-10">
                <h3 className="font-ivy-headline text-primary mb-8 text-xl leading-tight md:mb-10 md:text-2xl">
                  (04)
                </h3>
                <p className="font-neue-haas text-primary/90 max-w-lg text-base leading-relaxed md:text-lg">
                  Whether it&apos;s a quiet dinner or a special celebration, we
                  create moments that matter — with warmth and attention to
                  every guest.
                </p>
              </div>

              <div className="border-primary/15 w-[260px] min-w-[260px] shrink-0 snap-center border p-5 md:min-h-[280px] md:w-auto md:min-w-0 md:p-10">
                <h3 className="font-ivy-headline text-primary mb-8 text-xl leading-tight md:mb-10 md:text-2xl">
                  (05)
                </h3>
                <p className="font-neue-haas text-primary/90 max-w-lg text-base leading-relaxed md:text-lg">
                  Live music, dance, and sport come together in one place — an
                  oasis where entertainment and relaxation meet under the stars.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
