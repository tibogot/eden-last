import Image from "next/image";

const SERVICES = [
  {
    title: "Live Music & Dance",
    image: "/images/hero.jpg",
    align: "left" as const,
  },
  {
    title: "Traditional Cuisine",
    image: "/images/hero-2.jpg",
    align: "right" as const,
  },
  {
    title: "Football & Sports",
    image: "/images/roberto-nickson.jpg",
    align: "left" as const,
  },
  {
    title: "Garden & Relaxation",
    image: "/images/annie-lang.jpg",
    align: "right" as const,
  },
];

export default function ServicesGrid() {
  return (
    <section
      className="bg-secondary text-primary grid w-full grid-cols-1 px-4 md:grid-cols-2 md:gap-x-12 md:px-8"
      style={{
        minHeight: "200vh",
        gridTemplateRows: "repeat(4, 50vh)",
        gap: "0",
        paddingTop: "10vh",
        paddingBottom: "10vh",
      }}
    >
      {SERVICES.map((service, index) => (
        <div
          key={service.title}
          className={`flex min-h-[45vh] flex-col ${
            service.align === "right"
              ? "md:col-start-2 md:items-end"
              : "md:col-start-1 md:items-start"
          }`}
          style={{
            gridRow: index + 1,
          }}
        >
          <div className="relative aspect-4/3 w-full overflow-hidden md:max-w-md">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <p className="font-neue-haas text-primary mt-4 text-sm font-medium tracking-wide md:text-base">
            {service.title}
          </p>
        </div>
      ))}
    </section>
  );
}
