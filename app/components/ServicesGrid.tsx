import Image from "next/image";

const SERVICES = [
  {
    title: "Bar lounge",
    description:
      "Unwind with crafted drinks and a relaxed atmosphere in the heart of the garden.",
    image: "/images/iris-lavoie.jpg",
    imageClass: "aspect-4/3 w-full max-w-[560px]",
    textMaxWidth: "max-w-[360px]",
  },
  {
    title: "Pool game",
    description: "Friendly games and tournaments in a laid-back setting.",
    image: "/images/pool-game.jpg",
    imageClass: "aspect-[3/4] w-full max-w-[520px]",
    textMaxWidth: "max-w-[520px]",
  },
  {
    title: "Table tennis",
    description: "Quick matches and casual play for all skill levels.",
    image: "/images/table-tennis.jpg",
    imageClass: "aspect-square w-full max-w-[280px]",
    textMaxWidth: "max-w-[280px]",
  },
  {
    title: "Traditional food",
    description: "Authentic flavours and seasonal dishes in a unique setting.",
    image: "/images/chicken.jpg",
    imageClass: "aspect-4/3 w-full max-w-[320px]",
    textMaxWidth: "max-w-[320px]",
  },
];

export default function ServicesGrid() {
  const [barLounge, poolGame, tableTennis, traditionalFood] = SERVICES;

  return (
    <section
      className="bg-secondary text-primary w-full px-4 py-12 md:px-8 md:py-16"
      aria-label="Our services"
    >
      {/* First two images in grid */}
      <div className="grid h-auto grid-cols-1 grid-rows-2 gap-4 md:h-[680px] md:grid-cols-8 md:grid-rows-5">
        <div className="col-span-1 row-span-1 flex flex-col md:col-span-3 md:row-span-4">
          <div className="relative min-h-[280px] w-full flex-1 overflow-hidden md:min-h-0">
            <Image
              src={barLounge.image}
              alt={barLounge.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 38vw"
            />
          </div>
          <div className={`w-full text-left ${barLounge.textMaxWidth}`}>
            <h3 className="font-ivy-headline text-primary mt-3 text-lg font-normal md:text-2xl">
              {barLounge.title}
            </h3>
            <p className="font-neue-haas text-primary/80 mt-2 max-w-[240px] text-sm md:text-base">
              {barLounge.description}
            </p>
          </div>
        </div>
        <div className="col-span-1 row-span-1 row-start-2 flex flex-col md:col-span-2 md:col-start-6 md:row-span-4 md:row-start-2 md:items-end">
          <div className="relative min-h-[280px] w-full flex-1 overflow-hidden md:min-h-0">
            <Image
              src={poolGame.image}
              alt={poolGame.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </div>
          <div className={`w-full text-left ${poolGame.textMaxWidth}`}>
            <h3 className="font-ivy-headline text-primary mt-3 text-lg font-normal md:text-2xl">
              {poolGame.title}
            </h3>
            <p className="font-neue-haas text-primary/80 mt-2 max-w-[240px] text-sm md:text-base">
              {poolGame.description}
            </p>
          </div>
        </div>
      </div>

      {/* Table tennis and Traditional food in grid */}
      <div className="mt-8 grid h-auto grid-cols-1 grid-rows-2 gap-4 md:mt-12 md:h-[680px] md:grid-cols-8 md:grid-rows-5">
        <div className="col-span-1 row-span-1 flex flex-col md:col-span-2 md:col-start-2 md:row-span-4">
          <div className="relative min-h-[280px] w-full flex-1 overflow-hidden md:min-h-0">
            <Image
              src={tableTennis.image}
              alt={tableTennis.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </div>
          <div className={`w-full text-left ${tableTennis.textMaxWidth}`}>
            <h3 className="font-ivy-headline text-primary mt-3 text-lg font-normal md:text-2xl">
              {tableTennis.title}
            </h3>
            <p className="font-neue-haas text-primary/80 mt-2 max-w-[240px] text-sm md:text-base">
              {tableTennis.description}
            </p>
          </div>
        </div>
        <div className="col-span-1 row-span-1 row-start-2 flex flex-col md:col-span-3 md:col-start-6 md:row-span-4 md:row-start-2">
          <div className="relative min-h-[280px] w-full flex-1 overflow-hidden md:min-h-0">
            <Image
              src={traditionalFood.image}
              alt={traditionalFood.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 38vw"
            />
          </div>
          <div className={`w-full text-left ${traditionalFood.textMaxWidth}`}>
            <h3 className="font-ivy-headline text-primary mt-3 text-lg font-normal md:text-2xl">
              {traditionalFood.title}
            </h3>
            <p className="font-neue-haas text-primary/80 mt-2 max-w-[240px] text-sm md:text-base">
              {traditionalFood.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
