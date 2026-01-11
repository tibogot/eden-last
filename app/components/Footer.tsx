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
        {/* Top Section with Links on Right */}
        <div className="flex w-full justify-between">
          {/* Top Left Text */}
          <div>
            <p className="font-ivy-headline max-w-lg text-4xl leading-tight text-white md:text-5xl">
              There is no place like Eden garden in Abuja
            </p>
          </div>

          {/* Footer Links - Top Right */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-sm text-white uppercase transition-colors hover:text-white/80"
            >
              Home
            </Link>
            <Link
              href="/restaurant"
              className="text-sm text-white uppercase transition-colors hover:text-white/80"
            >
              Restaurant
            </Link>
            <Link
              href="/experiences"
              className="text-sm text-white uppercase transition-colors hover:text-white/80"
            >
              Experiences
            </Link>
            <Link
              href="/events"
              className="text-sm text-white uppercase transition-colors hover:text-white/80"
            >
              Events
            </Link>
            <Link
              href="/about"
              className="text-sm text-white uppercase transition-colors hover:text-white/80"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm text-white uppercase transition-colors hover:text-white/80"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-auto flex w-full flex-col pb-8">
          <div className="flex justify-center pb-6">
            <div className="relative h-24 w-48">
              <Image
                src="/navlogo.svg"
                alt="Eden Garden Logo"
                fill
                className="object-contain"
                priority={false}
              />
            </div>
          </div>
          <div className="flex w-full">
            <p className="text-sm text-white/80">© 2026 All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
