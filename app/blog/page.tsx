import client from "@/app/sanityClient";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
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

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: SanityImageAsset | string;
  publishedAt?: string;
  body?: PortableTextBlock[];
}

export default async function BlogPage() {
  const posts = await client.fetch<BlogPost[]>(
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

  return (
    <main className="bg-secondary text-primary py-32">
      <div className="mb-16 px-4 md:px-8">
        <h1 className="font-ivy-headline text-primary mb-4 text-4xl leading-tight md:text-6xl">
          Blog
        </h1>
      </div>
      <ul className="grid gap-10 px-4 md:grid-cols-3 md:px-8">
        {posts.map((post) => {
          // Build image URL using Sanity image URL builder
          let imageUrl = "/logo.png";
          if (post.mainImage) {
            if (typeof post.mainImage === "object" && post.mainImage.asset) {
              try {
                const image = urlFor(post.mainImage)
                  .width(600)
                  .height(400)
                  .url();
                imageUrl = image;
              } catch {
                if (post.mainImage.asset.url) {
                  imageUrl = post.mainImage.asset.url;
                }
              }
            } else if (typeof post.mainImage === "string") {
              imageUrl = post.mainImage;
            }
          }

          return (
            <li key={post._id} className="flex flex-col overflow-hidden">
              <Link href={`/blog/${post.slug.current}`} className="group block">
                {post.mainImage && (
                  <div className="bg-secondary relative h-56 w-full overflow-hidden md:h-64">
                    <Image
                      src={imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                )}
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
                      {post.body && (
                        <PortableText value={post.body.slice(0, 1)} />
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
    </main>
  );
}
