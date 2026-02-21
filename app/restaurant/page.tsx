import Image from "next/image";
import { Link } from "next-view-transitions";
import HeroParallax from "@/app/components/HeroParallax";
import RestaurantHeroTitle from "@/app/components/RestaurantHeroTitle";
import StackingCardsPin3D from "@/app/components/StackingCardsPin3D2";
import ExperiencesImageTimeline from "../components/ExperiencesImageTimeline";
import TextReveal from "../components/TextReveal";
import FoodMenu from "@/app/components/FoodMenu";
import ImageRevealSection from "@/app/components/ImageRevealSection";
import OverlappingCardSwiper, {
  type OverlappingSlide,
} from "@/app/components/OverlappingCardSwiper";
import AnimatedText from "../components/AnimatedText3";

const FOOD_DRINK_SLIDES: OverlappingSlide[] = [
  {
    imageSrc: "/images/food1.jpeg",
    imageAlt: "Jollof Rice",
    backgroundColor: "transparent",
    content: (
      <>
        <p className="font-neue-haas text-base leading-tight font-medium text-white md:text-lg">
          Jollof Rice — Our signature blend of aromatic rice, tomato, and
          peppers, slow-cooked to perfection.
        </p>
        <p className="font-neue-haas text-sm font-medium text-white/80">
          Mains
        </p>
      </>
    ),
  },
  {
    imageSrc: "/images/food2.jpeg",
    imageAlt: "Grilled Suya",
    backgroundColor: "transparent",
    content: (
      <>
        <p className="font-neue-haas text-base leading-tight font-medium text-white md:text-lg">
          Grilled Suya — Tender beef skewers marinated in Hausa spices, served
          with onions and pepper sauce.
        </p>
        <p className="font-neue-haas text-sm font-medium text-white/80">
          Starters
        </p>
      </>
    ),
  },
  {
    imageSrc: "/images/food3.jpeg",
    imageAlt: "Chapman",
    backgroundColor: "transparent",
    content: (
      <>
        <p className="font-neue-haas text-base leading-tight font-medium text-white md:text-lg">
          Chapman — A refreshing blend of Fanta, Sprite, grenadine, and bitters,
          a Nigerian classic.
        </p>
        <p className="font-neue-haas text-sm font-medium text-white/80">
          Drinks
        </p>
      </>
    ),
  },
  {
    imageSrc: "/images/food4.jpeg",
    imageAlt: "Pepper Soup",
    backgroundColor: "transparent",
    content: (
      <>
        <p className="font-neue-haas text-base leading-tight font-medium text-white md:text-lg">
          Pepper Soup — A warming broth with goat meat, local herbs, and
          aromatic spices.
        </p>
        <p className="font-neue-haas text-sm font-medium text-white/80">
          Soups
        </p>
      </>
    ),
  },
  {
    imageSrc: "/images/shourav-sheikh.jpg",
    imageAlt: "Dining at Eden Garden",
    backgroundColor: "transparent",
    content: (
      <>
        <p className="font-neue-haas text-base leading-tight font-medium text-white md:text-lg">
          Palm Wine — Fresh, lightly fermented palm sap, served chilled in the
          heart of the garden.
        </p>
        <p className="font-neue-haas text-sm font-medium text-white/80">
          Drinks
        </p>
      </>
    ),
  },
];

export default function Restaurant() {
  return (
    <main className="bg-secondary text-primary">
      <HeroParallax imageSrc="/images/diego.jpg" imageAlt="Restaurant image">
        <div className="absolute inset-0 flex flex-col items-center justify-end gap-5 px-4 pb-10 md:gap-6 md:pb-14">
          <h1 className="font-ivy-headline max-w-4xl text-center text-5xl leading-tight text-white drop-shadow-md md:text-8xl">
            Where Every Bite Tells a Story
          </h1>
          <p className="max-w-lg text-center text-sm leading-relaxed text-white/90 drop-shadow-sm md:max-w-xl md:text-base md:leading-relaxed">
            Eden Park & Garden Restaurant is a culinary oasis in Abuja—where
            traditional Nigerian flavors meet contemporary technique. From
            intimate dinners to celebrations, our chefs craft each dish with
            passion and the finest local ingredients. Come dine in the heart of
            the garden.
          </p>
        </div>
        {/* <RestaurantHeroTitle /> */}
      </HeroParallax>

      <section className="bg-secondary text-primary py-10 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center text-center">
            <AnimatedText>
              <span className="font-neue-haas mb-6 text-xs tracking-wider uppercase">
                VISIT US
              </span>
              <h2 className="font-ivy-headline mt-10 mb-8 max-w-3xl text-4xl leading-tight md:text-5xl">
                Dine with us in the heart of Abuja
              </h2>
              <p className="mx-auto mb-10 max-w-xl text-center text-lg">
                Reserve a table for lunch or dinner—enjoy traditional cuisine in
                the garden, on the terrace, or in our main dining room. Your
                table is waiting.
              </p>
            </AnimatedText>
          </div>
        </div>
      </section>
      {/* <section className="bg-secondary text-primary pt-16">
        <div className="container px-4 md:px-8">
          <div className="flex flex-col">
            <span className="font-neue-haas text-primary mb-6 text-xs tracking-wider uppercase">
              PHILOSOPHY
            </span>
            <h2 className="font-ivy-headline text-primary max-w-2xl text-4xl leading-tight md:text-5xl">
              Our restaurant offers a rarefied collection of breathtaking
              culinary experiences.
            </h2>
          </div>
        </div>
      </section> */}
      {/* <section className="bg-secondary text-primary pt-20 pb-32">
        <div className="container px-4 md:px-8">
          <div className="flex flex-col gap-8 md:ml-auto md:w-1/2">
            <p className="font-neue-haas text-primary text-lg">
              Eden Park & Garden Restaurant is a vibrant culinary oasis in
              Abuja, offering a unique blend of traditional cuisine and
              contemporary dining experiences. From authentic local dishes to
              innovative culinary creations, there&apos;s something for
              everyone. Indulge in traditional cuisine while enjoying the
              intimate ambiance of our restaurant.
            </p>
            <p className="font-neue-haas text-primary text-lg">
              Our chefs craft each dish with passion and precision, using the
              finest local ingredients to create unforgettable flavors. Every
              meal tells a story of culinary excellence, blending time-honored
              recipes with modern techniques. Experience the artistry of our
              kitchen as we bring together the best of Nigerian cuisine and
              international influences.
            </p>
            <p className="font-neue-haas text-primary text-lg">
              Whether you&apos;re joining us for a romantic dinner, a family
              celebration, or a business gathering, our restaurant provides the
              perfect setting. The warm, inviting atmosphere complements our
              exceptional service, ensuring that every visit is memorable. Come
              and discover why Eden Park & Garden Restaurant is Abuja&apos;s
              premier dining destination.
            </p>
            <Link
              href="/contact"
              className="font-neue-haas text-primary mt-4 text-xs tracking-wider uppercase underline transition-opacity hover:opacity-70"
            >
              MAKE A RESERVATION
            </Link>
          </div>
        </div>
      </section> */}
      <section className="bg-secondary text-primary py-20">
        <div className="px-4 md:px-8">
          {/* items-stretch so text column is tall; sticky text needs a tall containing block */}
          <div className="flex flex-col gap-8 md:flex-row md:items-stretch md:gap-12">
            <div className="relative h-[800px] w-full md:w-1/2">
              <Image
                src="/images/colin.jpg"
                alt="Dining at Eden Garden Restaurant"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex w-full flex-col md:w-1/2">
              <div className="flex flex-col justify-start md:sticky md:top-24">
                {/* <span className="font-neue-haas mb-4 text-xs tracking-wider uppercase text-primary">
                  THE EXPERIENCE
                </span> */}
                <h2 className="font-ivy-headline text-primary mb-6 max-w-xl text-3xl leading-tight md:text-4xl">
                  A setting where every detail is crafted for your comfort.
                </h2>
                <p className="font-neue-haas text-primary max-w-xl text-lg">
                  From the moment you step in, our team ensures a seamless
                  experience. Whether you choose a table by the garden or prefer
                  the intimacy of our indoor space, you&apos;ll find the same
                  warmth and attention to detail that define Eden Park & Garden
                  Restaurant.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <StackingCardsPin3D />
      <section className="bg-secondary py-20">
        <OverlappingCardSwiper
          slides={FOOD_DRINK_SLIDES}
          title={
            <>
              <h2 className="font-ivy-headline text-primary max-w-xl text-3xl leading-tight md:text-5xl">
                Discover the best of Eden Park & Garden
              </h2>
              <p className="font-neue-haas text-primary/60 mt-[2vw] w-[85%] text-base font-medium md:w-[60%] md:text-lg">
                Explore our signature dishes, local favourites, and crafted
                drinks from the kitchen and bar.
              </p>
            </>
          }
        />
      </section>
      <section className="bg-secondary text-primary py-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <TextReveal
              className="max-w-4xl"
              startColor="rgba(70, 86, 67, 0.2)"
              endColor="rgb(70, 86, 67)"
            >
              <p className="font-ivy-headline text-primary text-3xl leading-tight md:text-4xl">
                Of all the vibrant spaces, it is the only one that becomes even
                more captivating as you explore, ending not with a grand finale
                but by seamlessly blending into the natural landscape.
              </p>
            </TextReveal>
          </div>
        </div>
      </section>
      <ImageRevealSection
        title="A glimpse of our world"
        subtitle="Scroll to reveal each moment."
        images={[
          {
            src: "/images/colin.jpg",
            alt: "Dining at Eden Garden",
            span: "wide",
          },
          { src: "/images/food1.jpeg", alt: "Jollof Rice", span: "tall" },
          {
            src: "/images/shourav-sheikh.jpg",
            alt: "Garden dining",
            span: "sm",
          },
          { src: "/images/iris-lavoie.jpg", alt: "Atmosphere", span: "large" },
          { src: "/images/roberto-nickson.jpg", alt: "Ambiance", span: "sm" },
          { src: "/images/annie-lang.jpg", alt: "Experience", span: "wide" },
          { src: "/images/pool-game.jpg", alt: "Recreation", span: "tall" },
          { src: "/images/food2.jpeg", alt: "Grilled Suya", span: "sm" },
          { src: "/images/diego.jpg", alt: "Eden Garden", span: "wide" },
        ]}
        overlayColor="#c1b294"
      />
      <ExperiencesImageTimeline
        title="Restaurant at Eden Garden"
        body="Eden Park & Garden Restaurant is a vibrant culinary oasis in Abuja, offering a unique blend of traditional cuisine and contemporary dining experiences. From authentic local dishes to innovative culinary creations, there's something for everyone. Indulge in traditional cuisine while enjoying the intimate ambiance of our restaurant."
        slides={[
          { src: "/images/colin.jpg", alt: "Dining at Eden Garden Restaurant" },
          { src: "/images/iris-lavoie.jpg", alt: "Live music" },
          { src: "/images/roberto-nickson.jpg", alt: "Live music" },
          { src: "/images/iris-lavoie.jpg", alt: "Live music" },
          { src: "/images/roberto-nickson.jpg", alt: "Live music" },
          { src: "/images/iris-lavoie.jpg", alt: "Live music" },
        ]}
      />
      <FoodMenu />
    </main>
  );
}
