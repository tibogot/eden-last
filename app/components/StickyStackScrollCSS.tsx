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
      <div className="card-inner bg-secondary text-primary border-primary/20 h-[600px] w-full overflow-hidden border-t px-4 py-4 md:h-[600px] md:px-8 md:py-6">
        <div className="flex h-full w-full flex-col md:flex-row">
          {/* Number */}
          <div className="flex w-full items-start md:w-1/12">
            <span className="text-sm leading-none font-pp-neue-montreal text-primary/60">
              {data.number}
            </span>
          </div>

          {/* Title + Copy */}
          <div className="flex w-full flex-col items-start md:w-5/12 md:pr-6">
            <div>
              <h3 className="font-ivy-headline -mt-1 text-4xl leading-none text-primary">
                {data.title}
              </h3>

              <div className="mt-12" />

              <p className="font-pp-neue-montreal max-w-lg text-lg leading-relaxed text-primary/80">
                {data.description}
              </p>
            </div>
          </div>

          {/* Desktop Image */}
          <div className="relative hidden h-full w-full overflow-hidden rounded-sm md:flex md:w-1/2">
            <Image
              src={data.image}
              alt={data.imageAlt}
              fill
              className="object-cover"
              sizes="50vw"
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
    <div className="overflow-x-clip bg-secondary">
      {/* Mobile: intro + cards list */}
      <section className="bg-secondary text-primary intro mx-auto px-4 py-20 text-center md:hidden md:px-8 md:py-30">
        <AnimatedText delay={0.0} stagger={0.3}>
          <h2 className="font-ivy-headline mx-auto mb-6 max-w-4xl text-4xl md:text-5xl lg:text-6xl">
            From guided experiences to immersive moments
          </h2>
          <p className="font-pp-neue-montreal mx-auto max-w-2xl text-lg text-primary/80">
            Discover what Eden Park & Garden has to offer. Live music, garden
            dining, events, and night life—all in one vibrant oasis in Abuja.
          </p>
        </AnimatedText>
      </section>

      <section className="text-primary block w-full bg-secondary py-8 md:hidden">
        <div className="space-y-8 px-4">
          {cardData.map((data) => (
            <div
              key={data.number}
              className="bg-secondary border-primary/20 overflow-hidden border-t py-6"
            >
              <span className="text-sm leading-none font-pp-neue-montreal text-primary/60">
                {data.number}
              </span>
              <h3 className="font-ivy-headline mt-4 text-4xl leading-none text-primary">
                {data.title}
              </h3>
              <div className="mt-8" />
              <p className="font-pp-neue-montreal text-lg leading-relaxed text-primary/80">
                {data.description}
              </p>
              <div className="mt-8">
                <div className="relative h-[400px] w-full overflow-hidden rounded-sm">
                  <Image
                    src={data.image}
                    alt={data.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Desktop: native-scroll viewport so CSS sticky works with Lenis (data-lenis-prevent).
          Content scrolls inside this box; intro and cards use position:sticky. */}
      <div
        className="relative hidden h-screen overflow-y-auto overflow-x-hidden bg-secondary md:block"
        data-lenis-prevent
      >
        <section className="relative min-h-full">
          <div className="sticky top-0 z-0 bg-secondary text-primary intro mx-auto px-4 py-20 text-center md:px-8 md:py-30">
            <AnimatedText delay={0.0} stagger={0.3}>
              <h2 className="font-ivy-headline mx-auto mb-6 max-w-4xl text-4xl md:text-5xl lg:text-6xl">
                From guided experiences to immersive moments
              </h2>
              <p className="font-pp-neue-montreal mx-auto max-w-2xl text-lg text-primary/80">
                Discover what Eden Park & Garden has to offer. Live music, garden
                dining, events, and night life—all in one vibrant oasis in Abuja.
              </p>
            </AnimatedText>
          </div>

          {cardData.map((data, index) => {
            const isLast = index === cardData.length - 1;
            if (isLast) {
              return (
                <div key={data.number} className="relative z-10">
                  <Card data={data} />
                </div>
              );
            }
            return (
              <div
                key={data.number}
                className="relative z-10"
                style={{ height: "100vh" }}
              >
                <div className="sticky top-[20vh] w-full">
                  <Card data={data} />
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
