import client from "@/app/sanityClient";
import { PortableText } from "@portabletext/react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { urlFor } from "@/app/lib/sanityImage";
import type { PortableTextBlock } from "@portabletext/types";
import HeroParallax from "@/app/components/HeroParallax";

interface SanityImageAsset {
  asset?: {
    _id?: string;
    _ref?: string;
    _type?: string;
    url?: string;
  };
  _type?: string;
}

interface Event {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: SanityImageAsset | string;
  publishedAt?: string;
  body?: PortableTextBlock[];
}

export default async function EventsPage() {
  const events = await client.fetch<Event[]>(
    `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage{
        asset->{
          _id,
          url
        }
      },
      publishedAt,
      body
    }`,
  );

  const latestEvent = events[0];
  const otherEvents = events.slice(1);

  // Build image URL for latest event
  let heroImageUrl = "/logo.png";
  if (latestEvent?.mainImage) {
    if (
      typeof latestEvent.mainImage === "object" &&
      latestEvent.mainImage.asset
    ) {
      try {
        const image = urlFor(latestEvent.mainImage)
          .width(1920)
          .height(1080)
          .url();
        heroImageUrl = image;
      } catch {
        if (latestEvent.mainImage.asset.url) {
          heroImageUrl = latestEvent.mainImage.asset.url;
        }
      }
    } else if (typeof latestEvent.mainImage === "string") {
      heroImageUrl = latestEvent.mainImage;
    }
  }

  return (
    <main className="bg-secondary text-primary">
      {/* New Hero Section - fixed image, same concept as other pages */}
      <HeroParallax
        imageSrc="/images/annie-lang.jpg"
        imageAlt="Eden Garden Events"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-end gap-5 px-4 pb-10 md:gap-6 md:pb-14">
          <h1 className="font-ivy-headline max-w-4xl text-center text-5xl leading-tight text-white drop-shadow-md md:text-8xl">
            Where Gatherings Come Alive
          </h1>
          <p className="max-w-lg text-center text-sm leading-relaxed text-white/90 drop-shadow-sm md:max-w-xl md:text-base md:leading-relaxed">
            Live music under the stars, curated experiences, and nights that
            linger long after the lights go down. Eden Garden is where Abuja
            comes together to celebrate.
          </p>
        </div>
      </HeroParallax>

      {/* Latest Event - exactly like before */}
      {latestEvent && (
        <section className="relative h-svh w-full overflow-hidden">
          <Image
            src={heroImageUrl}
            alt={latestEvent.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 z-10 bg-black/20"></div>
          <div className="relative z-20 flex h-full items-center">
            <div className="container px-4 md:px-8">
              <div className="max-w-2xl">
                {latestEvent.publishedAt && (
                  <p className="font-neue-haas mb-4 text-sm text-white/80">
                    {new Date(latestEvent.publishedAt).toLocaleDateString()}
                  </p>
                )}
                <h2 className="font-ivy-headline mb-6 text-5xl leading-tight text-white md:text-7xl">
                  {latestEvent.title}
                </h2>
                <div className="font-neue-haas mb-8 line-clamp-3 max-w-md text-lg text-white/90 md:text-xl">
                  {latestEvent.body && (
                    <PortableText value={latestEvent.body.slice(0, 1)} />
                  )}
                </div>
                <Link
                  href={`/events/${latestEvent.slug.current}`}
                  className="font-neue-haas inline-block text-base text-white underline transition-opacity hover:opacity-70"
                >
                  Read more →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other Events Grid */}
      {otherEvents.length > 0 && (
        <section className="bg-secondary text-primary py-32">
          <div className="mb-16 px-4 md:px-8">
            <h2 className="font-ivy-headline text-primary text-4xl leading-tight md:text-6xl">
              More Events
            </h2>
          </div>
          <ul className="grid gap-10 px-4 md:grid-cols-3 md:px-8">
            {otherEvents.map((event) => {
              // Build image URL using Sanity image URL builder
              let imageUrl = "/logo.png";
              if (event.mainImage) {
                if (
                  typeof event.mainImage === "object" &&
                  event.mainImage.asset
                ) {
                  try {
                    const image = urlFor(event.mainImage)
                      .width(600)
                      .height(400)
                      .url();
                    imageUrl = image;
                  } catch {
                    if (event.mainImage.asset.url) {
                      imageUrl = event.mainImage.asset.url;
                    }
                  }
                } else if (typeof event.mainImage === "string") {
                  imageUrl = event.mainImage;
                }
              }

              return (
                <li key={event._id} className="flex flex-col overflow-hidden">
                  <Link
                    href={`/events/${event.slug.current}`}
                    className="group block"
                  >
                    {event.mainImage && (
                      <div className="bg-secondary relative h-56 w-full overflow-hidden md:h-64">
                        <Image
                          src={imageUrl}
                          alt={event.title}
                          fill
                          className="object-cover object-center"
                          loading="lazy"
                          sizes="(min-width: 768px) 33vw, 100vw"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col justify-between py-6">
                      <div>
                        {event.publishedAt && (
                          <p className="font-neue-haas text-primary/60 mb-2 text-xs">
                            {new Date(event.publishedAt).toLocaleDateString()}
                          </p>
                        )}
                        <h5 className="font-ivy-headline text-primary mb-2 text-2xl leading-tight md:text-3xl">
                          {event.title}
                        </h5>

                        <div className="font-neue-haas text-primary/70 mb-2 line-clamp-3 max-w-xl text-base md:text-lg">
                          {event.body && (
                            <PortableText value={event.body.slice(0, 1)} />
                          )}
                        </div>
                      </div>
                      <span className="font-neue-haas text-primary mt-2 inline-block text-base">
                        Read more →
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </main>
  );
}
