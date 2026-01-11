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
          <p className="font-ivy-headline max-w-lg text-4xl leading-tight text-white md:text-5xl">
            There is no place like Eden garden in Abuja
          </p>
        </div>

        {/* Footer Links - Bottom */}
        <div className="mt-auto flex flex-col items-center justify-center gap-4 pb-8">
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/"
              className="text-sm text-white transition-colors hover:text-white/80"
            >
              Home
            </Link>
            <Link
              href="/restaurant"
              className="text-sm text-white transition-colors hover:text-white/80"
            >
              Restaurant
            </Link>
            <Link
              href="/experiences"
              className="text-sm text-white transition-colors hover:text-white/80"
            >
              Experiences
            </Link>
            <Link
              href="/events"
              className="text-sm text-white transition-colors hover:text-white/80"
            >
              Events
            </Link>
            <Link
              href="/contact"
              className="text-sm text-white transition-colors hover:text-white/80"
            >
              Contact
            </Link>
          </div>
          <p className="text-sm text-white/80">© 2026 All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
