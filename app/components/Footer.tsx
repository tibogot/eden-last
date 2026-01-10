import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-auto h-[80vh] w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/colin.jpg"
        alt="Eden Garden"
        fill
        className="object-cover"
        priority={false}
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 flex h-full w-full flex-col px-4 pt-8 md:px-8">
        {/* Top Left Text */}
        <div className="mb-auto">
          <p
            className="font-ivy-light text-4xl leading-tight text-white md:text-5xl lg:text-6xl xl:text-7xl"
            style={{ fontFamily: "var(--font-ivy-presto-headline)" }}
          >
            There is no place like Eden garden in Abuja
          </p>
        </div>

        {/* Footer Links - Bottom */}
        <div className="mt-auto flex flex-col items-center justify-center gap-4 pb-8">
          <div className="flex gap-6 flex-wrap justify-center">
            <Link
              href="/"
              className="text-sm text-white hover:text-white/80 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/restaurant"
              className="text-sm text-white hover:text-white/80 transition-colors"
            >
              Restaurant
            </Link>
            <Link
              href="/experiences"
              className="text-sm text-white hover:text-white/80 transition-colors"
            >
              Experiences
            </Link>
            <Link
              href="/events"
              className="text-sm text-white hover:text-white/80 transition-colors"
            >
              Events
            </Link>
            <Link
              href="/contact"
              className="text-sm text-white hover:text-white/80 transition-colors"
            >
              Contact
            </Link>
          </div>
          <p className="text-sm text-white/80">
            © 2026 All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

