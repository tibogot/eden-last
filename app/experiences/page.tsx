import Image from "next/image";
import { Link } from "next-view-transitions";
import TextReveal from "@/app/components/TextReveal";
import ScrollColorSwap from "@/app/components/ScrollColorSwap";
import HeroParallax from "@/app/components/HeroParallax";
import StickyClipRevealText from "@/app/components/StickyClipRevealText";
import WhyUsSection from "../components/WhyUs";
import StickyStackScroll5 from "../components/StickyStackScroll5";
import NightLifeCardStack from "../components/NightLifeCardStack";
import ExperiencesImageTimeline from "../components/ExperiencesImageTimeline";
import AnimatedText from "../components/AnimatedText3";

export default function Experiences() {
  return (
    <main className="bg-secondary text-primary">
      <HeroParallax
        imageSrc="/images/ani-augustine.jpg"
        imageAlt="Experiences hero"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-end gap-5 px-4 pb-10 md:gap-6 md:pb-14">
          <h1 className="font-ivy-headline max-w-4xl text-center text-5xl leading-tight text-white drop-shadow-md md:text-8xl">
            Where Moments Become Memories
          </h1>
          <p className="max-w-lg text-center text-sm leading-relaxed text-white/90 drop-shadow-sm md:max-w-xl md:text-base md:leading-relaxed">
            From live music and dance shows to fine dining and award-winning
            hospitality, Eden Garden brings together the best of Abuja under one
            roof. Every visit unfolds as a new chapter—whether you&apos;re here
            for a meal, a concert, or a night out with friends.
          </p>
        </div>
      </HeroParallax>

      <section className="bg-secondary text-primary py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center text-center">
            <AnimatedText>
              <span className="font-neue-haas mb-6 text-xs tracking-wider uppercase">
                VISIT US
              </span>
              <h2 className="font-ivy-headline mb-8 max-w-3xl text-4xl leading-tight md:text-5xl">
                Come experience the magic of Eden Garden for yourself
              </h2>
              <p className="mx-auto mb-10 max-w-xl text-center text-lg">
                Eden Park & Garden is a vibrant oasis in Abuja, offering a
                unique blend of entertainment and relaxation. From live music
                and dance shows to thrilling football matches, there.{" "}
              </p>
            </AnimatedText>
          </div>
        </div>
      </section>

      <ExperiencesImageTimeline
        title="Experiences at Eden Garden"
        body="Eden Park & Garden is a vibrant oasis in Abuja, offering a unique blend of entertainment and relaxation. From live music and dance shows to thrilling football matches, outdoor activities, fine dining, and award-winning hospitality—there's something for everyone for an unforgettable experience."
        slides={[
          { src: "/images/roberto-nickson.jpg", alt: "Skiing in the Alps" },
          { src: "/images/daniel-park.jpg", alt: "Mountain biking" },
          { src: "/images/colin.jpg", alt: "Fine dining" },
          { src: "/images/annie-lang.jpg", alt: "Live music" },
        ]}
      />

      {/* <section className="bg-secondary text-primary pt-32">
        <div className="container px-4 md:px-8">
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
      </section> */}
      {/* <section className="bg-secondary text-primary pt-20 pb-32">
        <div className="container px-4 md:px-8">
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
      </section> */}
      {/* <section className="bg-secondary text-primary py-32">
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
      </section> */}
      {/* <StickyStackScroll5 /> */}

      {/* <ScrollColorSwap className="py-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-40">
            <span className="font-neue-haas text-xs tracking-wider uppercase">
              WHAT WE OFFER
            </span>
            <h2 className="font-ivy-headline mt-6 max-w-2xl text-4xl leading-tight md:text-5xl">
              From guided tours to immersive activities, we create unforgettable
              moments.
            </h2>
          </div>

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

          <div className="relative mb-40 h-[70vh] w-full overflow-hidden">
            <Image
              src="/images/annie-lang.jpg"
              alt="Eden Garden atmosphere"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>

          <div className="mb-40">
            <p className="font-ivy-headline max-w-3xl text-2xl leading-relaxed md:text-3xl">
              Eden Park & Garden is a vibrant oasis in Abuja, offering a unique
              blend of entertainment and relaxation. From live music to
              traditional cuisine, there&apos;s something for everyone.
            </p>
          </div>

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
      </ScrollColorSwap> */}

      {/* Section after color swap to show blend */}
      {/* <section className="bg-secondary text-primary py-8">
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
      </section> */}

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

      <section className="relative min-h-screen w-full overflow-hidden">
        <Image
          src="/images/real.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      </section>
    </main>
  );
}
