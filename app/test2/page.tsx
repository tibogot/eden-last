import Image from "next/image";
import { Link } from "next-view-transitions";
import TextReveal from "@/app/components/TextReveal";
import ScrollColorSwap from "@/app/components/ScrollColorSwap";
import ParallaxHeroImage from "@/app/components/ParallaxHeroImage";
import StickyClipRevealText from "@/app/components/StickyClipRevealText";
import WhyUsSection from "../components/WhyUs";
import StickyStackScroll5 from "../components/StickyStackScroll5";
import NightLifeCardStack from "../components/NightLifeCardStack";

export default function Experiences() {
  return (
    <main className="bg-secondary text-primary">
      <section className="flex w-full items-center justify-center px-4 pt-24 md:px-8 md:pt-32">
        <div className="w-full max-w-4xl text-center">
          <h1 className="font-ivy-headline mx-auto w-full text-5xl leading-tight md:text-8xl">
            Where Moments Become Memories
          </h1>
        </div>
      </section>

      <ParallaxHeroImage
        src="/images/obinna-okerekeocha.jpg"
        alt="Experiences hero"
        className="mt-40"
      />

      <section className="py-24 md:py-40">
        <TextReveal
          className="mx-auto w-full max-w-4xl px-4 text-center md:px-8"
          startColor="rgba(70, 86, 67, 0.2)"
          endColor="rgb(70, 86, 67)"
        >
          <h4 className="font-ivy-headline text-3xl leading-tight md:text-6xl">
            Abuja&apos;s premier destination for traditional cuisine,
            entertainment, and unforgettable experiences.
          </h4>
        </TextReveal>
      </section>

      <section className="bg-secondary text-primary pt-32">
        <div className="container px-4 md:px-8">
          {/* First Section - PHILOSOPHY label and title */}
          <div className="flex flex-col">
            <span className="font-neue-haas text-primary mb-6 text-xs tracking-wider uppercase">
              PHILOSOPHY
            </span>
            <h2 className="font-ivy-headline text-primary max-w-2xl text-4xl leading-tight md:text-5xl">
              The shimmering tower offers a rarefied collection of breathtaking
              full-floor residences.
            </h2>
          </div>
        </div>
      </section>
      <section className="bg-secondary text-primary pt-20 pb-32">
        <div className="container px-4 md:px-8">
          {/* Second Section - Paragraphs and link, aligned to the right */}
          <div className="flex flex-col gap-8 md:ml-auto md:w-1/2">
            <p className="font-neue-haas text-primary text-lg">
              Eden Park & Garden is a vibrant oasis in Abuja, offering a unique
              blend of entertainment and relaxation. From live music and dance
              shows to thrilling football matches, there&apos;s something for
              everyone. Indulge in traditional cuisine while enjoying the I
            </p>
            <p className="font-neue-haas text-primary text-lg">
              Eden Park & Garden is a vibrant oasis in Abuja, offering a unique
              blend of entertainment and relaxation. From live music and dance
              shows to thrilling football matches, there&apos;s something for
              everyone. Indulge in traditional cuisine while enjoying the I
            </p>
            <p className="font-neue-haas text-primary text-lg">
              Eden Park & Garden is a vibrant oasis in Abuja, offering a unique
              blend of entertainment and relaxation. From live music and dance
              shows to thrilling football matches, there&apos;s something for
              everyone. Indulge in traditional cuisine while enjoying the I
            </p>
            <Link
              href="/experiences"
              className="font-neue-haas text-primary mt-4 text-xs tracking-wider uppercase underline transition-opacity hover:opacity-70"
            >
              EXPLORE EXPERIENCES
            </Link>
          </div>
        </div>
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
      <StickyStackScroll5 />

      <ScrollColorSwap className="py-32">
        <div className="container mx-auto px-4 md:px-8">
          {/* First block - intro */}
          <div className="mb-40">
            <span className="font-neue-haas text-xs tracking-wider uppercase">
              WHAT WE OFFER
            </span>
            <h2 className="font-ivy-headline mt-6 max-w-2xl text-4xl leading-tight md:text-5xl">
              From guided tours to immersive activities, we create unforgettable
              moments.
            </h2>
          </div>

          {/* Second block - 2 col images */}
          <div className="mb-40 grid gap-16 md:grid-cols-2">
            <div>
              <Image
                src="/images/annie-lang.jpg"
                alt="Live music"
                width={600}
                height={400}
                className="mb-6 h-auto w-full object-cover"
              />
              <h3 className="font-ivy-headline mb-2 text-2xl">Live Music</h3>
              <p className="text-base">
                Sunset sessions with curated sound experiences.
              </p>
            </div>
            <div>
              <Image
                src="/images/colin.jpg"
                alt="Garden dining"
                width={600}
                height={400}
                className="mb-6 h-auto w-full object-cover"
              />
              <h3 className="font-ivy-headline mb-2 text-2xl">Garden Dining</h3>
              <p className="text-base">
                Seasonal plates served in the open air.
              </p>
            </div>
          </div>

          {/* Third block - full width image */}
          <div className="relative mb-40 h-[70vh] w-full overflow-hidden">
            <Image
              src="/images/annie-lang.jpg"
              alt="Eden Garden atmosphere"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>

          {/* Fourth block - quote */}
          <div className="mb-40">
            <p className="font-ivy-headline max-w-3xl text-2xl leading-relaxed md:text-3xl">
              Eden Park & Garden is a vibrant oasis in Abuja, offering a unique
              blend of entertainment and relaxation. From live music to
              traditional cuisine, there&apos;s something for everyone.
            </p>
          </div>

          {/* Fifth block - 3 col features */}
          <div className="mb-40 grid gap-16 md:grid-cols-3">
            <div>
              <h4 className="mb-2 text-xs tracking-wider uppercase">Events</h4>
              <p className="text-base">Weekends with a slow glow.</p>
            </div>
            <div>
              <h4 className="mb-2 text-xs tracking-wider uppercase">
                Terrace Bar
              </h4>
              <p className="text-base">Drinks under the stars.</p>
            </div>
            <div>
              <h4 className="mb-2 text-xs tracking-wider uppercase">
                Open-Air Stage
              </h4>
              <p className="text-base">Performances in nature.</p>
            </div>
          </div>

          {/* Sixth block - another image row */}
          <div className="mb-40 grid gap-8 md:grid-cols-2">
            <div className="relative h-[50vh] overflow-hidden">
              <Image
                src="/images/colin.jpg"
                alt="Garden details"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
            <div className="relative h-[50vh] overflow-hidden">
              <Image
                src="/images/annie-lang.jpg"
                alt="Garden moments"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>

          {/* Final block - closing text */}
          <div className="pb-20">
            <h3 className="font-ivy-headline mb-6 text-3xl md:text-4xl">
              A place to return to
            </h3>
            <p className="max-w-2xl text-lg">
              Whether you&apos;re here for the music, the food, or simply the
              atmosphere, Eden Garden leaves a lasting impression.
            </p>
          </div>
        </div>
      </ScrollColorSwap>

      {/* Section after color swap to show blend */}
      <section className="bg-secondary text-primary py-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center text-center">
            <span className="font-neue-haas mb-6 text-xs tracking-wider uppercase">
              VISIT US
            </span>
            <h2 className="font-ivy-headline mb-8 max-w-3xl text-4xl leading-tight md:text-5xl">
              Come experience the magic of Eden Garden for yourself
            </h2>
            <p className="mb-10 max-w-xl text-lg">
              Open daily from 10am to midnight. Located in the heart of Abuja.
            </p>
            <Link
              href="/contact"
              className="font-neue-haas text-xs tracking-wider uppercase underline transition-opacity hover:opacity-70"
            >
              GET DIRECTIONS
            </Link>
          </div>
        </div>
      </section>

      <StickyClipRevealText
        imageSrc="/images/shourav-sheikh.jpg"
        imageAlt="Eden Garden atmosphere"
        textContent={
          <>
            <span className="font-neue-haas mb-6 block text-xs tracking-wider uppercase">
              DISCOVER
            </span>
            <h2 className="font-ivy-headline mb-6 max-w-3xl text-3xl md:text-6xl">
              Where every moment becomes an unforgettable experience
            </h2>
            <p className="text-primary/70 mx-auto max-w-xl text-base md:text-lg">
              From live music under the stars to the warmth of traditional
              cuisine, Eden Garden is where memories are made.
            </p>
          </>
        }
        overlayContent={
          <>
            <h2 className="font-ivy-headline mb-6 text-4xl leading-tight md:text-6xl">
              A place where stories unfold
            </h2>
            <p className="text-lg opacity-90 md:text-xl">
              Every corner holds a new adventure, every moment a chance to
              connect.
            </p>
          </>
        }
      />
      <WhyUsSection />
      <NightLifeCardStack />
    </main>
  );
}
