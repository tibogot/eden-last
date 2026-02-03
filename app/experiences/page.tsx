import Image from "next/image";
import { Link } from "next-view-transitions";
import TextReveal from "@/app/components/TextReveal";

export default function Experiences() {
  return (
    <main className="bg-secondary text-primary">
      <section className="flex min-h-[60vh] w-full items-center justify-center px-4 pt-24 md:px-8 md:pt-32">
        <div className="relative -ml-8 flex w-full max-w-4xl items-center justify-center md:-ml-16">
          <Image
            src="/images/newlogo.svg"
            alt="Eden Garden"
            width={933}
            height={311}
            className="h-auto w-full max-w-2xl object-contain"
            priority
          />
        </div>
      </section>
      <div className="mt-40 px-4 md:px-8">
        <div className="relative h-[80vh] w-full overflow-hidden">
          <Image
            src="/images/annie-lang.jpg"
            alt="Eden Garden experiences"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>
      <section className="py-32 md:py-40">
        <TextReveal
          className="mx-auto w-full max-w-4xl px-4 text-center md:px-8"
          startColor="rgba(70, 86, 67, 0.2)"
          endColor="rgb(70, 86, 67)"
        >
          <h4 className="font-ivy-headline text-4xl leading-tight md:text-6xl">
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
      <section className="container mx-auto px-4 py-16">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h2 className="font-ivy-headline mb-4 text-3xl">What We Offer</h2>
          <p className="max-w-2xl text-lg">
            From guided tours to immersive activities, we create unforgettable
            moments.
          </p>
        </div>
      </section>
    </main>
  );
}
