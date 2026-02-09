import Image from "next/image";
import Link from "next/link";
import { Link as TransitionLink } from "next-view-transitions";

export default function Footer() {
  return (
    <footer className="bg-secondary relative flex min-h-[50vh] w-full flex-col px-4 pt-8 pb-2 md:min-h-[55vh] md:px-8">
      {/* Top row: Logo + slogan left, Address | Contact | Links right */}
      <div className="flex flex-1 flex-col gap-10 md:flex-row md:items-start md:justify-between">
        {/* Logo + description */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="inline-block">
            <div
              className="relative h-12 w-36 md:h-14 md:w-40"
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(27%) sepia(12%) saturate(600%) hue-rotate(60deg) brightness(95%) contrast(85%)",
              }}
            >
              <Image
                src="/images/logo3.svg"
                alt="Eden Park & Garden"
                fill
                className="object-contain object-left"
                priority={false}
                sizes="(max-width: 768px) 144px, 160px"
              />
            </div>
          </Link>
          <p className="text-primary max-w-xs text-base leading-relaxed">
            A construction company, offering integrated solution and related
            services.
          </p>
        </div>

        {/* Links | Address | Contact - same row as logo, aligned to top */}
        <div className="flex flex-col gap-10 md:flex-row md:gap-14 lg:gap-20">
          <div className="flex flex-col items-start gap-0.5">
            <p className="text-primary text-base font-medium tracking-wider uppercase">
              LINKS
            </p>
            <TransitionLink
              href="/"
              className="text-primary text-base transition-colors hover:opacity-80"
            >
              Home
            </TransitionLink>
            <TransitionLink
              href="/about"
              className="text-primary text-base transition-colors hover:opacity-80"
            >
              About
            </TransitionLink>
            <TransitionLink
              href="/restaurant"
              className="text-primary text-base transition-colors hover:opacity-80"
            >
              Restaurant
            </TransitionLink>
            <TransitionLink
              href="/experiences"
              className="text-primary text-base transition-colors hover:opacity-80"
            >
              Experiences
            </TransitionLink>
            <TransitionLink
              href="/events"
              className="text-primary text-base transition-colors hover:opacity-80"
            >
              Events
            </TransitionLink>
            <TransitionLink
              href="/contact"
              className="text-primary text-base transition-colors hover:opacity-80"
            >
              Contact
            </TransitionLink>
          </div>
          <div>
            <p className="text-primary text-base font-medium tracking-wider uppercase">
              Address
            </p>
            <address className="text-primary text-base leading-relaxed not-italic">
              Opposite Chida Hotel
              <br />
              Augustus Aigkhomo Street
              <br />
              Utako District
              <br />
              FCT, Abuja, Nigeria
            </address>
          </div>
          <div>
            <p className="text-primary text-base font-medium tracking-wider uppercase">
              Contact
            </p>
            <p className="text-primary text-base leading-relaxed">
              <a
                href="tel:+2348057962505"
                className="transition-opacity hover:opacity-80"
              >
                +234 805 796 2505
              </a>
            </p>
            <p className="text-primary mt-1 text-base leading-relaxed">
              <a
                href="mailto:hello@edengarden.com"
                className="transition-opacity hover:opacity-80"
              >
                hello@edengarden.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section - pushed to bottom */}
      <div className="border-primary/20 text-primary mt-auto flex flex-col items-start justify-between gap-4 border-t pt-4 pb-5 md:flex-row md:items-center md:pb-6">
        <p className="text-sm">
          © 2025 Eden Garden Abuja. All rights reserved.
        </p>
        <div className="flex gap-8 text-sm">
          <Link
            href="/privacy"
            className="text-primary transition-colors hover:opacity-80"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-primary transition-colors hover:opacity-80"
          >
            Terms and Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}
