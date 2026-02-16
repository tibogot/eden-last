"use client";

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
    title: "Live Music",
    description:
      "Sunset sessions with curated sound experiences. From acoustic evenings to full-band performances, Eden Garden comes alive with live music that sets the perfect mood.",
    image: "/images/annie-lang.jpg",
    imageAlt: "Live music at Eden Garden",
  },
  {
    number: "02",
    title: "Garden Dining",
    description:
      "Seasonal plates served in the open air. Indulge in authentic traditional cuisine and contemporary dishes while surrounded by lush greenery and the warmth of shared moments.",
    image: "/images/colin.jpg",
    imageAlt: "Garden dining at Eden Garden",
  },
  {
    number: "03",
    title: "Events & Celebrations",
    description:
      "Weekends with a slow glow. Whether it is a birthday, corporate gathering, or wedding, we create unforgettable experiences that bring people together in our vibrant oasis.",
    image: "/images/mche-lee-Bribs3.jpg",
    imageAlt: "Events and celebrations at Eden Garden",
  },
  {
    number: "04",
    title: "Terrace Bar & Night Life",
    description:
      "Drinks under the stars. Eden Garden comes alive after dark with crafted cocktails, live entertainment, and an atmosphere that turns every evening into an unforgettable experience.",
    image: "/images/iris-lavoie.jpg",
    imageAlt: "Terrace bar and night life at Eden Garden",
  },
];

function Card({ data }: { data: CardData }) {
  return (
    <div className="card relative w-full">
      <div className="card-inner bg-secondary text-primary border-primary/20 h-[400px] w-full overflow-hidden border-t px-4 pt-4 md:h-[400px] md:px-8 md:pt-6">
        <div className="flex h-full w-full flex-col md:flex-row">
          {/* Number */}
          <div className="mb-3 flex w-full items-start md:mb-0 md:w-1/12">
            <span className="font-pp-neue-montreal text-primary/60 text-sm leading-none">
              {data.number}
            </span>
          </div>

          {/* Title + Copy */}
          <div className="mb-4 flex w-full flex-col items-start md:mb-0 md:w-5/12 md:pr-6">
            <div>
              <h3 className="font-ivy-headline text-primary -mt-1 text-4xl leading-none">
                {data.title}
              </h3>

              <div className="mt-12" />

              <p className="font-pp-neue-montreal text-primary/80 max-w-lg text-lg leading-relaxed">
                {data.description}
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-48 w-full overflow-hidden rounded-sm md:h-full md:w-1/2">
            <Image
              src={data.image}
              alt={data.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={data.number === "01"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StickyStackScrollCSS() {
  return (
    <div className="bg-secondary overflow-x-clip">
      {/* Intro */}
      <section className="bg-secondary text-primary intro mx-auto px-4 py-20 text-center md:px-8 md:py-30">
        <AnimatedText delay={0.0} stagger={0.3}>
          <h2 className="font-ivy-headline mx-auto mb-6 max-w-4xl text-4xl md:text-5xl lg:text-6xl">
            From guided experiences to immersive moments
          </h2>
          <p className="font-pp-neue-montreal text-primary/80 mx-auto max-w-2xl text-lg">
            Discover what Eden Park & Garden has to offer. Live music, garden
            dining, events, and night life—all in one vibrant oasis in Abuja.
          </p>
        </AnimatedText>
      </section>

      {/* Sticky stacking cards — mobile & desktop */}
      <section className="relative">
        {cardData.map((data, index) => {
          const isLast = index === cardData.length - 1;
          return (
            <div
              key={data.number}
              className={
                isLast
                  ? "relative w-full"
                  : "sticky top-[10vh] w-full md:top-[20vh]"
              }
              style={{
                zIndex: index + 1,
                marginTop: index === 0 ? 0 : "10vh",
              }}
            >
              <Card data={data} />
            </div>
          );
        })}
      </section>
    </div>
  );
}
