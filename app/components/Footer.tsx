"use client";

import Link from "next/link";
import { Link as TransitionLink } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

export default function Footer() {
  const pathname = usePathname();
  const lenis = useLenis();

  const handleScrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { force: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  const isEventsActive =
    pathname === "/events" || pathname.startsWith("/events/");

  return (
    <footer className="bg-primary relative flex min-h-[50vh] w-full flex-col px-4 pt-8 md:min-h-[55vh] md:px-8">
      <style>{`
        .footer-links-col .footer-link {
          transition: opacity 0.3s ease;
        }
        .footer-links-col:has(.footer-link:hover) .footer-link:not(:hover) {
          opacity: 0.3;
        }
        .footer-link-active {
          opacity: 0.3;
        }
        .footer-link-active:hover {
          opacity: 1;
        }
      `}</style>
      {/* Top row: Logo + slogan left, Address | Contact | Links right */}
      <div className="flex flex-1 flex-col gap-10 md:flex-row md:items-start md:justify-between">
        {/* Logo + description - on home: scroll to top; elsewhere: link to home */}
        <div className="flex flex-col gap-6">
          {pathname === "/" ? (
            <button
              type="button"
              onClick={handleScrollToTop}
              className="inline-block cursor-pointer border-none bg-transparent p-0 text-left"
              aria-label="Scroll to top"
            >
              <div
                className="bg-secondary relative h-12 w-36 md:h-14 md:w-40"
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
            </button>
          ) : (
            <TransitionLink
              href="/"
              className="inline-block"
              aria-label="Eden Park & Garden - Home"
            >
              <div
                className="bg-secondary relative h-12 w-36 md:h-14 md:w-40"
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
            </TransitionLink>
          )}
          <p className="text-secondary max-w-xs text-base leading-relaxed">
            A construction company, offering integrated solution and related
            services.
          </p>
        </div>

        {/* Links | Address | Contact - 2 cols on mobile, row on md+ */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:flex md:flex-row md:gap-14 lg:gap-20">
          <div className="footer-links-col flex flex-col items-start gap-0.5">
            <p className="text-secondary mb-4 text-base font-medium tracking-wider uppercase">
              LINKS
            </p>
            <div
              className={`footer-link ${pathname === "/" ? "footer-link-active" : ""}`}
            >
              {pathname === "/" ? (
                <button
                  type="button"
                  onClick={handleScrollToTop}
                  className="text-secondary text-left text-base transition-colors hover:opacity-80"
                  aria-current="page"
                >
                  Home
                </button>
              ) : (
                <TransitionLink
                  href="/"
                  className="text-secondary text-base transition-colors hover:opacity-80"
                >
                  Home
                </TransitionLink>
              )}
            </div>
            <div
              className={`footer-link ${pathname === "/about" ? "footer-link-active" : ""}`}
            >
              <TransitionLink
                href="/about"
                className="text-secondary text-base transition-colors hover:opacity-80"
                aria-current={pathname === "/about" ? "page" : undefined}
              >
                About
              </TransitionLink>
            </div>
            <div
              className={`footer-link ${pathname === "/restaurant" ? "footer-link-active" : ""}`}
            >
              <TransitionLink
                href="/restaurant"
                className="text-secondary text-base transition-colors hover:opacity-80"
                aria-current={pathname === "/restaurant" ? "page" : undefined}
              >
                Restaurant
              </TransitionLink>
            </div>
            <div
              className={`footer-link ${pathname === "/experiences" ? "footer-link-active" : ""}`}
            >
              <TransitionLink
                href="/experiences"
                className="text-secondary text-base transition-colors hover:opacity-80"
                aria-current={pathname === "/experiences" ? "page" : undefined}
              >
                Experiences
              </TransitionLink>
            </div>
            <div
              className={`footer-link ${isEventsActive ? "footer-link-active" : ""}`}
            >
              <TransitionLink
                href="/events"
                className="text-secondary text-base transition-colors hover:opacity-80"
                aria-current={isEventsActive ? "page" : undefined}
              >
                Events
              </TransitionLink>
            </div>
            <div
              className={`footer-link ${pathname === "/contact" ? "footer-link-active" : ""}`}
            >
              <TransitionLink
                href="/contact"
                className="text-secondary text-base transition-colors hover:opacity-80"
                aria-current={pathname === "/contact" ? "page" : undefined}
              >
                Contact
              </TransitionLink>
            </div>
          </div>
          <div>
            <p className="text-secondary mb-4 text-base font-medium tracking-wider uppercase">
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
            <p className="text-secondary mb-4 text-base font-medium tracking-wider uppercase">
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
        <div className="flex flex-col gap-1">
          <p className="text-sm">
            © 2025 Eden Garden Abuja. All rights reserved.
          </p>
          <div className="flex gap-3 text-[10px] opacity-50">
            <TransitionLink
              href="/test"
              className="text-secondary transition-opacity hover:opacity-100"
            >
              test
            </TransitionLink>
            <span className="text-secondary/70">·</span>
            <TransitionLink
              href="/test2"
              className="text-secondary transition-opacity hover:opacity-100"
            >
              test2
            </TransitionLink>
            <span className="text-secondary/70">·</span>
            <TransitionLink
              href="/test3"
              className="text-secondary transition-opacity hover:opacity-100"
            >
              test3
            </TransitionLink>
            <span className="text-secondary/70">·</span>
            <TransitionLink
              href="/test4"
              className="text-secondary transition-opacity hover:opacity-100"
            >
              test4
            </TransitionLink>
          </div>
        </div>
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
