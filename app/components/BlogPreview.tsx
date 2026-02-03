import { Link } from "next-view-transitions";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { urlFor } from "@/app/lib/sanityImage";

interface SanityImageAsset {
  asset?: {
    _id?: string;
    _ref?: string;
    _type?: string;
    url?: string;
  };
  _type?: string;
}

interface BlogPreviewProps {
  post: {
    _id: string;
    title: string;
    slug: { current: string };
    mainImage?: SanityImageAsset | string;
    publishedAt?: string;
    body?: PortableTextBlock[];
  };
}

export default function BlogPreview({ post }: BlogPreviewProps) {
  // Build image URL using Sanity image URL builder
  let imageUrl = "/logo.png"; // fallback to your logo

  if (post.mainImage) {
    if (typeof post.mainImage === "object" && post.mainImage.asset) {
      // Use Sanity image URL builder for proper CDN URLs
      try {
        const image = urlFor(post.mainImage).width(600).height(400).url();
        imageUrl = image;
      } catch {
        // If URL builder fails, try direct URL
        if (post.mainImage.asset.url) {
          imageUrl = post.mainImage.asset.url;
        }
      }
    } else if (typeof post.mainImage === "string") {
      imageUrl = post.mainImage;
    }
  }

  return (
    <li className="mb-10 w-full flex-1 md:mb-0 md:w-1/3">
      <Link
        href={`/events/${post.slug.current}`}
        className="group block h-full"
      >
        <div className="flex h-full flex-col items-stretch overflow-hidden">
          <div className="bg-secondary relative flex h-48 w-full items-center justify-center overflow-hidden md:h-56">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-center"
              loading="lazy"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between py-6">
            <div>
              {post.publishedAt && (
                <p className="font-neue-haas text-primary/60 mb-2 text-xs">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </p>
              )}
              <h5 className="font-ivy-headline text-primary mb-2 text-2xl leading-tight md:text-3xl">
                {post.title}
              </h5>

              <div className="font-neue-haas text-primary/70 mb-2 line-clamp-3 max-w-xl text-base md:text-lg">
                {post.body && <PortableText value={post.body.slice(0, 1)} />}
              </div>
            </div>
            <span className="font-neue-haas text-primary mt-4 inline-block text-base">
              Read more →
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}
