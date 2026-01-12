import client from "@/app/sanityClient";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import Image from "next/image";
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
    <main className="bg-secondary text-primary py-32">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 md:px-8">
        <h1 className="font-ivy-headline text-primary mb-4 w-full text-center text-4xl leading-tight md:text-6xl">
          {event.title}
        </h1>
        {event.publishedAt && (
          <p className="font-neue-haas text-primary/60 mb-6 text-center text-sm">
            {new Date(event.publishedAt).toLocaleDateString()}
          </p>
        )}
        {event.mainImage && imageUrl && (
          <div className="relative mb-8 h-[420px] w-full overflow-hidden rounded-xl">
            <Image
              src={imageUrl}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="font-neue-haas text-primary prose prose-lg mx-auto w-full max-w-3xl text-center">
          {event.body && <PortableText value={event.body} />}
        </div>
      </div>
    </main>
  );
}
