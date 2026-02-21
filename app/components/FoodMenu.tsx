"use client";

const FOOD_SECTIONS = [
  {
    label: "Soups & stews",
    items: [
      "Egusi soup",
      "Pepper soup (goat / fish / assorted)",
      "Isi ewu (spiced goat head)",
      "Oha soup",
      "Ogbono soup",
      "Afang soup",
      "Efo riro",
      "Banga soup",
      "Ofe akwu",
      "Native soup",
    ],
  },
  {
    label: "Swallow & sides",
    items: [
      "Pounded yam",
      "Eba",
      "Fufu",
      "Semo",
      "Amala",
      "Tuwo shinkafa",
      "Plantain (fried / boiled)",
    ],
  },
  {
    label: "Rice",
    items: [
      "Jollof rice",
      "Fried rice",
      "Coconut rice",
      "Ofada rice & ayamase",
      "White rice & stew",
      "Jollof with plantain & coleslaw",
    ],
  },
  {
    label: "Grills & proteins",
    items: [
      "Suya (beef / chicken / mutton)",
      "Grilled fish (tilapia / catfish)",
      "Pepper soup goat",
      "Asun (spiced roasted goat)",
      "Grilled chicken",
      "Fish pepper soup",
      "Snails (pepper soup or grilled)",
    ],
  },
  {
    label: "Snacks & small plates",
    items: [
      "Puff puff",
      "Chin chin",
      "Akara",
      "Moi moi",
      "Suya wrap",
      "Pepper soup (small bowl)",
      "Grilled fish (small)",
    ],
  },
] as const;

const DRINK_SECTIONS = [
  {
    label: "Beer",
    items: [
      "Nigerian Star lager",
      "Gulder",
      "Hero",
      "Trophy",
      "33 Export",
      "Legend",
      "International lagers (Heineken, Stella, etc.)",
    ],
  },
  {
    label: "Spirits & more",
    items: [
      "Palm wine",
      "Ogogoro (local spirit)",
      "Chapman",
      "Zobo",
      "Kunu",
      "Fruit juices",
      "Soft drinks",
      "House cocktails",
      "Wines & sparkling",
    ],
  },
] as const;

function MenuSectionBlock({
  label,
  items,
}: {
  label: string;
  items: readonly string[];
}) {
  return (
    <div className="mb-10 last:mb-0">
      <h3 className="font-ivy-headline text-primary border-primary/30 mb-4 border-b border-solid pb-2 text-xl tracking-tight md:text-2xl">
        {label}
      </h3>
      <ul className="font-ivy-headline text-primary space-y-2.5 text-[15px] leading-relaxed md:text-base">
        {items.map((item) => (
          <li key={item} className="text-primary/90">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FoodMenu({ className = "" }: { className?: string }) {
  return (
    <section
      className={`bg-secondary text-primary py-20 md:py-28 ${className}`}
      aria-labelledby="food-menu-title"
    >
      <div className="px-4 md:px-8">
        <header className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
          <span className="font-neue-haas text-primary/70 mb-3 block text-xs tracking-[0.2em] uppercase">
            Menu
          </span>
          <h2
            id="food-menu-title"
            className="font-ivy-headline text-primary text-3xl leading-tight md:text-4xl lg:text-[2.5rem]"
          >
            Nigerian flavours
          </h2>
          <p className="font-neue-haas text-primary/80 mt-3 text-sm md:text-base">
            Soups, grills, rice & drinks
          </p>
        </header>

        {/* Menu card: two columns on large screens */}
        <div className="border-primary/15 bg-primary/5 mx-auto border border-solid shadow-[0_2px_20px_rgba(70,86,67,0.06)] md:px-10 md:py-12 lg:flex lg:gap-16 lg:px-14 lg:py-14">
          {/* Left: Food */}
          <div className="flex-1 space-y-2 px-4 py-8 md:px-0 md:py-0">
            {FOOD_SECTIONS.map((section) => (
              <MenuSectionBlock
                key={section.label}
                label={section.label}
                items={section.items}
              />
            ))}
          </div>

          {/* Right: Drinks */}
          <div className="border-primary/10 flex-1 space-y-2 border-t border-solid pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-16">
            {DRINK_SECTIONS.map((section) => (
              <MenuSectionBlock
                key={section.label}
                label={section.label}
                items={section.items}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
