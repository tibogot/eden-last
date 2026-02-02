import Image from "next/image";

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
