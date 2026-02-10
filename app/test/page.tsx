import { Link } from "next-view-transitions";
import HeroParallax from "@/app/components/HeroParallax";
import RestaurantHeroTitle from "@/app/components/RestaurantHeroTitle";
import AnimatedTextWords from "@/app/components/AnimatedTextWords";
import AnimatedTextChars from "@/app/components/AnimatedTextChars";
import HorizontalScrollSection from "../components/HorizontalScrollSection";
import StackingCardsPin3D from "../components/StackingCardsPin3D";
import StickyStackScroll4 from "../components/StickyStackScroll4";
import StickyStackScroll5 from "../components/StickyStackScroll5";

export default function TestPage() {
  return (
    <main className="bg-secondary text-primary">
      <HeroParallax imageSrc="/images/macdavis.jpg" imageAlt="Test page image">
        <RestaurantHeroTitle title="Test Page" />
      </HeroParallax>
      <section className="bg-secondary text-primary pt-32">
        <div className="container px-4 md:px-8">
          {/* First Section - PHILOSOPHY label and title */}
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
      </section>
      <section className="bg-secondary text-primary pt-20 pb-32">
        <div className="container px-4 md:px-8">
          {/* Second Section - Paragraphs and link, aligned to the right */}
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
      </section>
      {/* AnimatedTextWords showcase */}
      <section className="bg-secondary text-primary border-primary/10 border-t py-32">
        <div className="container mx-auto px-4 md:px-8">
          <span className="font-neue-haas text-primary mb-8 block text-xs tracking-wider uppercase">
            Text animations (words & letters)
          </span>
          <div className="flex flex-col gap-24">
            <div className="max-w-4xl">
              <p className="font-neue-haas text-primary/70 mb-3 text-xs tracking-wider uppercase">
                Hero (plays on load) — lift
              </p>
              <AnimatedTextWords
                isHero
                stagger={0.05}
                duration={0.5}
                variant="lift"
                className="font-ivy-headline text-primary text-4xl leading-tight md:text-6xl"
              >
                <h2>Every word reveals itself in sequence.</h2>
              </AnimatedTextWords>
            </div>
            <div className="max-w-4xl">
              <p className="font-neue-haas text-primary/70 mb-3 text-xs tracking-wider uppercase">
                Scroll-triggered — scale
              </p>
              <AnimatedTextWords
                start="top 85%"
                stagger={0.06}
                variant="scale"
                className="font-ivy-headline text-primary text-3xl leading-tight md:text-5xl"
              >
                <p>Scroll here to see words pop in one by one.</p>
              </AnimatedTextWords>
            </div>
            <div className="max-w-2xl">
              <p className="font-neue-haas text-primary/70 mb-3 text-xs tracking-wider uppercase">
                Scroll-triggered — fade
              </p>
              <AnimatedTextWords
                start="top 85%"
                stagger={0.04}
                variant="fade"
                className="font-neue-haas text-primary text-lg leading-relaxed"
              >
                <p>
                  A subtle fade-in per word works well for longer body copy and
                  paragraphs.
                </p>
              </AnimatedTextWords>
            </div>
            <div className="max-w-4xl">
              <p className="font-neue-haas text-primary/70 mb-3 text-xs tracking-wider uppercase">
                Letter-by-letter (slide up, same as line reveal)
              </p>
              <AnimatedTextChars
                start="top 85%"
                stagger={0.02}
                duration={0.5}
                className="font-ivy-headline text-primary text-3xl leading-tight md:text-5xl"
              >
                <p>Each letter comes up from below in sequence.</p>
              </AnimatedTextChars>
            </div>
          </div>
        </div>
      </section>
      <HorizontalScrollSection />
      <StackingCardsPin3D />
      <StickyStackScroll4 />
      <StickyStackScroll5 />
    </main>
  );
}
