import { Link } from "next-view-transitions";
import TextReveal from "@/app/components/TextReveal";
import ParallaxHeroImage from "@/app/components/ParallaxHeroImage";

export default function Test3() {
  return (
    <main className="bg-secondary text-primary">
      <section className="flex w-full flex-col items-center justify-center gap-5 px-4 pt-24 md:gap-6 md:px-8 md:pt-64">
        <div className="w-full max-w-4xl text-center">
          <h1 className="font-ivy-headline mx-auto w-full text-5xl leading-tight md:text-8xl">
            A Garden Where Time Slows Down
          </h1>
          <p className="text-primary/80 mx-auto mt-10 max-w-lg text-center text-sm leading-relaxed md:max-w-md md:text-base md:leading-relaxed">
            From live music and dance shows to fine dining and award-winning
            hospitality, Eden Garden brings together the best of Abuja under one
            roof. Every visit unfolds as a new chapter.
          </p>
        </div>
      </section>

      <div className="px-4 md:px-8">
        <ParallaxHeroImage
          src="/images/sam-hojati.jpg"
          alt="Experiences hero"
          className="mt-40"
        />
      </div>

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
          {/* PHILOSOPHY section */}
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
    </main>
  );
}
