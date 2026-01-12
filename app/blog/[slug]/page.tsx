import client from "@/app/sanityClient";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { urlFor } from "@/app/lib/sanityImage";
import type { PortableTextBlock } from "@portabletext/types";

export async function generateStaticParams() {
  const slugs = await client.fetch(
    `*[_type == "post" && defined(slug.current)][].slug.current`,
  );
  return slugs.map((slug: string) => ({ slug }));
}

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
  title: string;
  body?: PortableTextBlock[];
  mainImage?: SanityImageAsset | string;
  publishedAt?: string;
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await client.fetch<BlogPost>(
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

  if (!post) return notFound();

  // Build image URL
  let imageUrl = "";
  if (post.mainImage) {
    if (typeof post.mainImage === "object" && post.mainImage.asset) {
      try {
        const image = urlFor(post.mainImage).width(1200).height(600).url();
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
    <main className="bg-secondary text-primary py-32">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 md:px-8">
        <h1 className="font-ivy-headline text-primary mb-4 w-full text-center text-4xl leading-tight md:text-6xl">
          {post.title}
        </h1>
        {post.publishedAt && (
          <p className="font-neue-haas text-primary/60 mb-6 text-center text-sm">
            {new Date(post.publishedAt).toLocaleDateString()}
          </p>
        )}
        {post.mainImage && imageUrl && (
          <div className="relative mb-8 h-[420px] w-full overflow-hidden rounded-xl">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="font-neue-haas text-primary prose prose-lg mx-auto w-full max-w-3xl text-center">
          {post.body && <PortableText value={post.body} />}
        </div>
      </div>
    </main>
  );
}
