import client from "@/app/sanityClient";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { urlFor } from "@/app/lib/sanityImage";
import type { PortableTextBlock } from "@portabletext/types";

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
  title: string;
  body?: PortableTextBlock[];
  mainImage?: SanityImageAsset | string;
  publishedAt?: string;
}

export async function generateStaticParams() {
  const slugs = await client.fetch(
    `*[_type == "post" && defined(slug.current)][].slug.current`,
  );
  return slugs.map((slug: string) => ({ slug }));
}

export default async function EventPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  
  // Fetch all events ordered by publishedAt
  const allEvents = await client.fetch<
    Array<{ slug: { current: string }; title: string }>
  >(
    `*[_type == "post"] | order(publishedAt desc) {
      slug,
      title
    }`,
  );

  // Find current event index
  const currentIndex = allEvents.findIndex(
    (e) => e.slug.current === params.slug,
  );

  if (currentIndex === -1) return notFound();

  // Get previous and next events
  const previousEvent =
    currentIndex < allEvents.length - 1
      ? allEvents[currentIndex + 1]
      : null;
  const nextEvent = currentIndex > 0 ? allEvents[currentIndex - 1] : null;

  const event = await client.fetch<Event>(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      body,
      mainImage{
        asset->{
          _id,
          url
        }
      },
      publishedAt
    }`,
    { slug: params.slug },
  );

  if (!event) return notFound();

  // Build image URL
  let imageUrl = "";
  if (event.mainImage) {
    if (typeof event.mainImage === "object" && event.mainImage.asset) {
      try {
        const image = urlFor(event.mainImage).width(1200).height(600).url();
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
    <main className="bg-secondary text-primary">
      {/* Full-bleed hero image - no rounding */}
      {event.mainImage && imageUrl && (
        <section className="relative h-[55vh] min-h-[320px] w-full overflow-hidden md:min-h-[420px]">
          <Image
            src={imageUrl}
            alt={event.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-secondary/80 via-transparent to-transparent" />
        </section>
      )}

      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pt-16 pb-12 md:px-8 md:pt-24">
        {event.publishedAt && (
          <p className="font-neue-haas text-primary/60 mb-3 text-center text-xs uppercase tracking-wider">
            {new Date(event.publishedAt).toLocaleDateString()}
          </p>
        )}
        <h1 className="font-ivy-headline text-primary mb-12 w-full text-center text-4xl leading-tight md:text-6xl">
          {event.title}
        </h1>
        <div className="font-neue-haas text-primary prose prose-lg mx-auto w-full max-w-3xl text-center prose-headings:font-ivy-headline">
          {event.body && <PortableText value={event.body} />}
        </div>
      </div>

      {/* Navigation Section */}
      <section className="bg-secondary text-primary border-t border-primary/15 mt-8 py-16 md:py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 px-4 md:flex-row md:justify-between md:px-8">
          {/* Previous Event */}
          {previousEvent ? (
            <Link
              href={`/events/${previousEvent.slug.current}`}
              className="group flex flex-col items-start"
            >
              <span className="font-neue-haas text-primary/60 mb-2 text-xs uppercase tracking-wider">
                Previous Event
              </span>
              <span className="font-ivy-headline text-primary group-hover:underline text-xl leading-tight">
                {previousEvent.title}
              </span>
            </Link>
          ) : (
            <div></div>
          )}

          {/* Return to Events */}
          <Link
            href="/events"
            className="font-neue-haas text-primary text-sm uppercase tracking-wider underline transition-opacity hover:opacity-70"
          >
            ← Back to Events
          </Link>

          {/* Next Event */}
          {nextEvent ? (
            <Link
              href={`/events/${nextEvent.slug.current}`}
              className="group flex flex-col items-end text-right"
            >
              <span className="font-neue-haas text-primary/60 mb-2 text-xs uppercase tracking-wider">
                Next Event
              </span>
              <span className="font-ivy-headline text-primary group-hover:underline text-xl leading-tight">
                {nextEvent.title}
              </span>
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </section>
    </main>
  );
}
