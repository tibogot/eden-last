"use client";

export type MenuItem = { name: string; price: number; sku: string };

type MenuSection = { label: string; items: MenuItem[] };

function formatPrice(n: number): string {
  return "₦" + n.toLocaleString("en-NG");
}

const FOOD_SECTIONS: MenuSection[] = [
  {
    label: "Protein",
    items: [
      { name: "Catfish", price: 6000, sku: "29379" },
      { name: "Beef", price: 5000, sku: "29381" },
      { name: "Assorted Goatmeat", price: 6000, sku: "29382" },
      { name: "Cowleg Meat", price: 6000, sku: "29895" },
      { name: "Turkey", price: 6000, sku: "29398" },
      { name: "Tilapia Fish", price: 8000, sku: "29397" },
      { name: "Stock Fish", price: 8000, sku: "29394" },
    ],
  },
  {
    label: "Pepper Soup",
    items: [
      { name: "Catfish Pepper Soup", price: 10000, sku: "29888" },
      { name: "Cowtail Pepper Soup", price: 10000, sku: "29890" },
      { name: "Goat Meat Pepper Soup", price: 10000, sku: "29891" },
      { name: "Assorted Goat Meat Pepper Soup", price: 10000, sku: "29892" },
      { name: "Chicken Pepper Soup", price: 10000, sku: "29893" },
      { name: "Cowleg Pepper Soup", price: 10000, sku: "29894" },
      { name: "Catfish Head Pepper Soup", price: 5000, sku: "29911" },
      { name: "Turkey Pepper Soup", price: 10000, sku: "29949" },
      { name: "Croaker Fish Pepper Soup", price: 10000, sku: "49949" },
      { name: "Beef Pepper Soup", price: 10000, sku: "29393" },
    ],
  },
  {
    label: "Rice Meal",
    items: [
      { name: "Steam White Rice & Stew", price: 3000, sku: "29896" },
      { name: "Coconut Rice", price: 3000, sku: "29897" },
      { name: "Party Smokey Jollof Rice", price: 3000, sku: "29898" },
      { name: "Chinese Rice", price: 15000, sku: "29899" },
    ],
  },
  {
    label: "Soup",
    items: [
      { name: "Ogbono Soup", price: 4000, sku: "30025" },
      { name: "Vegetable Soup", price: 4000, sku: "30026" },
      { name: "Okro Soup", price: 4000, sku: "30027" },
      { name: "Oha Soup", price: 4000, sku: "30028" },
      { name: "Bitter Leaf Soup", price: 4000, sku: "30029" },
      { name: "Egusi Soup", price: 4000, sku: "30030" },
    ],
  },
  {
    label: "Swallow",
    items: [
      { name: "Wheat", price: 1000, sku: "30031" },
      { name: "Semovita", price: 1000, sku: "30032" },
      { name: "Garri", price: 1000, sku: "30033" },
      { name: "Poundo Yam", price: 1000, sku: "30034" },
      { name: "Plantain Flour", price: 1000, sku: "30035" },
    ],
  },
  {
    label: "Stew",
    items: [{ name: "Stew", price: 1000, sku: "29938" }],
  },
  {
    label: "Peppered Delicacies",
    items: [
      { name: "Peppered Beef", price: 10000, sku: "29901" },
      { name: "Peppered Goat Meat", price: 10000, sku: "29902" },
      { name: "Peppered Cowleg", price: 10000, sku: "29903" },
      { name: "Peppered Cowtail", price: 10000, sku: "29904" },
      { name: "Peppered Chicken", price: 10000, sku: "29905" },
      { name: "Assorted Goat Meat Peppered", price: 10000, sku: "29906" },
    ],
  },
  {
    label: "Delicacies",
    items: [
      { name: "Isiewu", price: 12000, sku: "29907" },
      { name: "Nkwonbi", price: 7000, sku: "29908" },
      { name: "Chicken Nkwonbi", price: 10000, sku: "29909" },
      { name: "Vegetable Chicken", price: 10000, sku: "29910" },
    ],
  },
  {
    label: "Peppered Gizzard",
    items: [{ name: "Peppered Gizzard", price: 10000, sku: "29887" }],
  },
  {
    label: "Grill",
    items: [
      { name: "Grilled Catfish", price: 15000, sku: "29943" },
      { name: "Plantain Chips", price: 3000, sku: "29945" },
      { name: "Tilapia Fish", price: 15000, sku: "29946" },
      { name: "Irish Potatoes Chip", price: 3000, sku: "29947" },
      { name: "Grilled Croaker Fish", price: 15000, sku: "29948" },
    ],
  },
  {
    label: "Food",
    items: [
      { name: "Beans & Plantain", price: 5000, sku: "29953" },
      { name: "Boiled Plantain/Yam with Fish Sauce", price: 10000, sku: "29954" },
      { name: "Corn Beans", price: 3000, sku: "29955" },
      { name: "Ewa Aganyin with Bread", price: 7000, sku: "29956" },
      { name: "Boiled or Fried Yam/Plantain with Egg Sauce", price: 5000, sku: "29957" },
      { name: "Pottage Beans", price: 3000, sku: "29958" },
      { name: "Moi-Moi", price: 3000, sku: "29959" },
      { name: "Noodles and Egg", price: 5000, sku: "29960" },
      { name: "White Rice & Stew", price: 3000, sku: "29961" },
      { name: "Pottage Yam", price: 4000, sku: "29962" },
      { name: "Spaghetti Jollof", price: 7000, sku: "29963" },
    ],
  },
  {
    label: "Extral",
    items: [
      { name: "Fried/Boiled Yam", price: 3000, sku: "29950" },
      { name: "Fried/Boiled Sweet Potatoes", price: 3000, sku: "29951" },
      { name: "Fried/Boiled Plantain", price: 3000, sku: "29952" },
      { name: "Small Chops", price: 10000, sku: "29964" },
    ],
  },
  {
    label: "Takeaway",
    items: [{ name: "Takeaway Pack", price: 300, sku: "29900" }],
  },
];

const DRINK_SECTIONS: MenuSection[] = [
  {
    label: "Agidi",
    items: [{ name: "Agidi", price: 500, sku: "29885" }],
  },
  {
    label: "Water",
    items: [{ name: "Faris and Nestle Water", price: 500, sku: "29886" }],
  },
  {
    label: "Soft Drinks",
    items: [
      { name: "Climax", price: 1000, sku: "29965" },
      { name: "Coke", price: 500, sku: "29966" },
      { name: "Exotic", price: 4000, sku: "29967" },
      { name: "Fayrous", price: 1000, sku: "29968" },
      { name: "Hollandia", price: 5000, sku: "29969" },
      { name: "Malt", price: 1000, sku: "29970" },
      { name: "Power Horse", price: 3500, sku: "29971" },
      { name: "Monster", price: 2500, sku: "29972" },
    ],
  },
  {
    label: "Beer",
    items: [
      { name: "33 Export", price: 1700, sku: "29912" },
      { name: "Ace Root", price: 1500, sku: "29913" },
      { name: "Big Legend", price: 2200, sku: "29914" },
      { name: "Budweiser", price: 2000, sku: "29915" },
      { name: "Desperados", price: 1500, sku: "29916" },
      { name: "Double Black", price: 2200, sku: "29918" },
      { name: "Goldberg", price: 1500, sku: "29919" },
      { name: "Gulder", price: 2000, sku: "29920" },
      { name: "Heineken", price: 2200, sku: "29921" },
      { name: "Hero", price: 1500, sku: "29922" },
      { name: "Hunter", price: 2000, sku: "29923" },
      { name: "Legend Twist", price: 1500, sku: "29924" },
      { name: "Star Light", price: 1500, sku: "29925" },
      { name: "Medium Stout", price: 2000, sku: "29926" },
      { name: "Origin Beer", price: 2000, sku: "29927" },
      { name: "Small Star Lite", price: 1000, sku: "29928" },
      { name: "Savannah", price: 2500, sku: "29929" },
      { name: "Smirnoff Ice", price: 2000, sku: "29930" },
      { name: "Smooth", price: 2000, sku: "29931" },
      { name: "Star", price: 2000, sku: "29932" },
      { name: "Star Radler", price: 1500, sku: "29934" },
      { name: "Tiger", price: 1500, sku: "29935" },
      { name: "Trophy", price: 1500, sku: "29936" },
      { name: "Trophy Stout", price: 1500, sku: "29937" },
      { name: "Big Double Black", price: 3000, sku: "34746" },
      { name: "Big Smirnoff Ice", price: 3000, sku: "298334" },
    ],
  },
  {
    label: "Bitters",
    items: [
      { name: "Ace Bitters", price: 1500, sku: "29973" },
      { name: "Origin Bitters", price: 2000, sku: "29974" },
    ],
  },
  {
    label: "Cocktail",
    items: [
      { name: "A.M.F", price: 7000, sku: "29984" },
      { name: "Cosmopolitan", price: 7000, sku: "29985" },
      { name: "Daiquiri", price: 7000, sku: "29986" },
      { name: "Long Island", price: 7000, sku: "29987" },
      { name: "Mojito", price: 7000, sku: "29988" },
      { name: "Piña Colada", price: 7000, sku: "29989" },
      { name: "Paradise", price: 7000, sku: "30007" },
    ],
  },
  {
    label: "Mocktail",
    items: [
      { name: "Stay Sober", price: 5000, sku: "30008" },
      { name: "Virgin Daiquiri", price: 5500, sku: "30010" },
      { name: "Virgin Mojito", price: 5500, sku: "30012" },
      { name: "Chapman", price: 7000, sku: "30013" },
      { name: "Love Portion", price: 5500, sku: "30014" },
      { name: "Paradise", price: 5000, sku: "30015" },
      { name: "Virgin Colada", price: 5500, sku: "30016" },
    ],
  },
  {
    label: "Fresh Juice",
    items: [{ name: "Fresh Juice", price: 6000, sku: "29999" }],
  },
  {
    label: "Milk Shake",
    items: [
      { name: "Banana Milk Shake", price: 7000, sku: "30000" },
      { name: "Mocha Milk Shake", price: 7000, sku: "30001" },
      { name: "Oreo Milk Shake", price: 7000, sku: "30002" },
      { name: "Strawberry Milk Shake", price: 7000, sku: "30003" },
      { name: "Vanilla Milk Shake", price: 7000, sku: "30004" },
    ],
  },
  {
    label: "Smoothies",
    items: [
      { name: "Healthy Man", price: 5000, sku: "30022" },
      { name: "Stay Active", price: 5000, sku: "30023" },
      { name: "Three Musketeers", price: 5000, sku: "30024" },
    ],
  },
  {
    label: "Tea",
    items: [
      { name: "English Tea", price: 5000, sku: "29423" },
      { name: "Arabian Tea", price: 5000, sku: "29424" },
      { name: "Eden Tea", price: 5000, sku: "29425" },
    ],
  },
  {
    label: "Shisha",
    items: [{ name: "Shisha", price: 7000, sku: "29417" }],
  },
  {
    label: "Vodka",
    items: [
      { name: "Absolute", price: 40000, sku: "29939" },
      { name: "B/Smirnoff", price: 15000, sku: "29940" },
      { name: "Ciroc", price: 50000, sku: "29941" },
      { name: "Bullet", price: 3000, sku: "29942" },
    ],
  },
  {
    label: "Whiskey",
    items: [
      { name: "Black Label", price: 80000, sku: "29457" },
      { name: "Jack Daniels", price: 80000, sku: "29460" },
      { name: "Jameson Green", price: 60000, sku: "29465" },
      { name: "Barcadi Tot", price: 2000, sku: "30566" },
      { name: "Tequila Tot", price: 2500, sku: "30567" },
    ],
  },
  {
    label: "Gin",
    items: [
      { name: "Big Gordon", price: 15000, sku: "29995" },
      { name: "Lord's Gin Cocktail", price: 1000, sku: "29996" },
      { name: "Grey Whale", price: 100000, sku: "29997" },
      { name: "Hendrick", price: 100000, sku: "29998" },
    ],
  },
  {
    label: "Cream",
    items: [
      { name: "Big Amarula", price: 20000, sku: "29990" },
      { name: "Small Amarula", price: 10000, sku: "29991" },
      { name: "Big Best", price: 20000, sku: "29992" },
      { name: "Small Best", price: 10000, sku: "29993" },
      { name: "Baileys", price: 30000, sku: "29994" },
    ],
  },
  {
    label: "Brandy",
    items: [
      { name: "Hennessy VS", price: 150000, sku: "29975" },
      { name: "Hennessy VSOP", price: 200000, sku: "29976" },
      { name: "Martel Swift", price: 200000, sku: "29977" },
      { name: "Martel VS", price: 100000, sku: "29978" },
      { name: "Martel VSOP", price: 180000, sku: "29979" },
    ],
  },
  {
    label: "Champagne",
    items: [
      { name: "Andre Brut", price: 25000, sku: "29980" },
      { name: "Andre Rose", price: 25000, sku: "29981" },
      { name: "Moet Brut", price: 180000, sku: "29982" },
      { name: "Moet Rose", price: 250000, sku: "29983" },
    ],
  },
  {
    label: "Small Wine / Whiskey",
    items: [
      { name: "Small Campari", price: 10000, sku: "30017" },
      { name: "Big Drostdy Hof", price: 20000, sku: "30018" },
      { name: "Small Gordon", price: 3500, sku: "30019" },
      { name: "Small Imperial", price: 5000, sku: "30020" },
      { name: "Small Smirnoff X1", price: 5000, sku: "30021" },
    ],
  },
  {
    label: "White / Red Wine",
    items: [{ name: "Nederburg", price: 35000, sku: "30089" }],
  },
];

function MenuSectionBlock({ label, items }: { label: string; items: MenuItem[] }) {
  return (
    <div className="mb-10 last:mb-0">
      <h3 className="font-ivy-headline text-primary border-primary/30 mb-4 border-b border-solid pb-2 text-xl tracking-tight md:text-2xl">
        {label}
      </h3>
      <ul className="font-ivy-headline text-primary space-y-3 text-[15px] leading-relaxed md:text-base">
        {items.map((item) => (
          <li key={item.sku} className="text-primary/90 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <span>{item.name}</span>
            <span className="font-neue-haas text-primary/80 shrink-0 text-sm">
              {formatPrice(item.price)}
              <span className="ml-2 text-primary/60">SKU: {item.sku}</span>
            </span>
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

        <div className="border-primary/15 bg-primary/5 mx-auto border border-solid shadow-[0_2px_20px_rgba(70,86,67,0.06)] md:px-10 md:py-12 lg:flex lg:gap-16 lg:px-14 lg:py-14">
          <div className="flex-1 space-y-2 px-4 py-8 md:px-0 md:py-0">
            {FOOD_SECTIONS.map((section) => (
              <MenuSectionBlock
                key={section.label}
                label={section.label}
                items={section.items}
              />
            ))}
          </div>

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
