import Link from "next/link";
import { Link as TransitionLink } from "next-view-transitions";

export default function Footer() {
  return (
    <footer className="bg-primary relative flex min-h-[50vh] w-full flex-col px-4 pt-8 md:min-h-[55vh] md:px-8">
      {/* Top row: Logo + slogan left, Address | Contact | Links right */}
      <div className="flex flex-1 flex-col gap-10 md:flex-row md:items-start md:justify-between">
        {/* Logo + description */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="inline-block" aria-label="Eden Park & Garden - Home">
            <div
              className="relative h-12 w-36 bg-secondary md:h-14 md:w-40"
              style={{
                maskImage: "url('/images/logo3.svg')",
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "left",
                WebkitMaskImage: "url('/images/logo3.svg')",
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "left",
              }}
            />
          </Link>
          <p className="text-secondary max-w-xs text-base leading-relaxed">
            A construction company, offering integrated solution and related
            services.
          </p>
        </div>

        {/* Links | Address | Contact - 2 cols on mobile, row on md+ */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:flex md:flex-row md:gap-14 lg:gap-20">
          <div className="flex flex-col items-start gap-0.5">
            <p className="text-secondary text-base font-medium tracking-wider uppercase">
              LINKS
            </p>
            <TransitionLink
              href="/"
              className="text-secondary text-base transition-colors hover:opacity-80"
            >
              Home
            </TransitionLink>
            <TransitionLink
              href="/about"
              className="text-secondary text-base transition-colors hover:opacity-80"
            >
              About
            </TransitionLink>
            <TransitionLink
              href="/restaurant"
              className="text-secondary text-base transition-colors hover:opacity-80"
            >
              Restaurant
            </TransitionLink>
            <TransitionLink
              href="/experiences"
              className="text-secondary text-base transition-colors hover:opacity-80"
            >
              Experiences
            </TransitionLink>
            <TransitionLink
              href="/events"
              className="text-secondary text-base transition-colors hover:opacity-80"
            >
              Events
            </TransitionLink>
            <TransitionLink
              href="/contact"
              className="text-secondary text-base transition-colors hover:opacity-80"
            >
              Contact
            </TransitionLink>
          </div>
          <div>
            <p className="text-secondary text-base font-medium tracking-wider uppercase">
              Address
            </p>
            <address className="text-secondary text-base leading-relaxed not-italic">
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
            <p className="text-secondary text-base font-medium tracking-wider uppercase">
              Contact
            </p>
            <p className="text-secondary text-base leading-relaxed">
              <a
                href="tel:+2348057962505"
                className="transition-opacity hover:opacity-80"
              >
                +234 805 796 2505
              </a>
            </p>
            <p className="text-secondary mt-1 text-base leading-relaxed">
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
      <div className="border-secondary/20 text-secondary mt-4 flex flex-col items-start justify-between gap-4 border-t pt-4 pb-5 md:flex-row md:items-center">
        <p className="text-sm">
          © 2025 Eden Garden Abuja. All rights reserved.
        </p>
        <div className="flex gap-8 text-sm">
          <Link
            href="/privacy"
            className="text-secondary transition-colors hover:opacity-80"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-secondary transition-colors hover:opacity-80"
          >
            Terms and Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}
