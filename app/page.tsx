import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-secondary text-primary">
      <section className="relative h-svh w-full overflow-hidden">
        <Image
          src="/images/hero-2.jpg"
          alt="Hero image"
          fill
          priority
          className="object-cover"
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
          <div className="container mx-auto px-4">
            <h1 className="font-ivy-headline mb-4 text-7xl leading-tight text-white md:text-8xl lg:text-9xl">
              Experience paradise in every sip and bite
            </h1>
            <p className="mx-auto mt-16 max-w-lg text-lg text-white">
              Eden Park & Garden is a vibrant oasis in Abuja, offering a unique
              blend of entertainment and relaxation. From live music and dance
              shows to thrilling football matches, there.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-secondary text-primary pt-32">
        <div className="container px-4 md:px-8">
          {/* First Section - PHILOSOPHY label and title */}
          <div className="flex flex-col">
            <span className="font-neue-haas text-primary mb-6 text-xs tracking-wider uppercase">
              PHILOSOPHY
            </span>
            <h2 className="font-ivy-headline text-primary max-w-2xl text-4xl md:text-5xl lg:text-6xl">
              The shimmering tower offers a rarefied collection of breathtaking
              full-floor residences.
            </h2>
          </div>
        </div>
      </section>
      <section className="bg-secondary text-primary pb-32">
        <div className="container px-4 md:px-8">
          {/* Second Section - Paragraphs and link, aligned to the right */}
          <div className="flex flex-col gap-8 md:ml-auto md:w-1/2">
            <p className="font-neue-haas text-primary text-base leading-relaxed">
              Eden Park & Garden is a vibrant oasis in Abuja, offering a unique
              blend of entertainment and relaxation. From live music and dance
              shows to thrilling football matches, there&apos;s something for
              everyone. Indulge in traditional cuisine while enjoying the I
            </p>
            <p className="font-neue-haas text-primary text-base leading-relaxed">
              Eden Park & Garden is a vibrant oasis in Abuja, offering a unique
              blend of entertainment and relaxation. From live music and dance
              shows to thrilling football matches, there&apos;s something for
              everyone. Indulge in traditional cuisine while enjoying the I
            </p>
            <p className="font-neue-haas text-primary text-base leading-relaxed">
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
            <p className="font-ivy-headline text-primary max-w-4xl text-3xl leading-tight md:text-4xl lg:text-5xl">
              Of all the vibrant spaces, it is the only one that becomes even
              more captivating as you explore, ending not with a grand finale
              but by seamlessly blending into the natural landscape.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
