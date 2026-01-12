import Image from "next/image";
import { Link } from "next-view-transitions";
import TextReveal from "@/app/components/TextReveal";
import TestimonialsTicker from "@/app/components/TestimonialsTicker";
import BlogPreview from "@/app/components/BlogPreview";
import client from "@/app/sanityClient";
import type { PortableTextBlock } from "@portabletext/types";

interface SanityImageAsset {
  _ref?: string;
  _type?: string;
  asset?: {
    _ref?: string;
    _type?: string;
    url?: string;
  };
  url?: string;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: SanityImageAsset | string;
  publishedAt?: string;
  body?: PortableTextBlock[];
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch<BlogPost[]>(
      `*[_type == "post"] | order(publishedAt desc) [0...3] {
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
    return posts || [];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export default async function Home() {
  const blogPosts = await getBlogPosts();
  return (
    <main className="bg-secondary text-primary">
      <section className="relative h-svh w-full overflow-hidden">
        <Image
          src="/images/hero-2.jpg"
          alt="Hero image"
          fill
          priority
          className="object-cover"
        />
        <div className="relative z-10 h-full">
          {/* Title - Centered */}
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="container mx-auto px-4">
              <h1 className="font-ivy-headline mb-4 text-5xl leading-tight text-white md:text-8xl">
                Experience paradise in every sip and bite
              </h1>
            </div>
          </div>
          {/* Paragraph - Bottom Center */}
          <div className="absolute right-0 bottom-0 left-0 flex items-center justify-center pb-8 text-center">
            <div className="container mx-auto px-4">
              <p className="mx-auto max-w-lg text-base text-white">
                Eden Park & Garden is a vibrant oasis in Abuja, offering a
                unique blend of entertainment and relaxation. From live music
                and dance shows to thrilling football matches, there.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 md:py-80">
        <TextReveal
          className="mx-auto w-full max-w-4xl px-4 text-center md:px-8"
          startColor="rgba(70, 86, 67, 0.2)"
          endColor="rgb(70, 86, 67)"
        >
          <h4 className="font-ivy-headline text-4xl leading-tight md:text-6xl">
            Abuja&apos;s premier destination for traditional cuisine,
            entertainment, and unforgettable experiences.
          </h4>
        </TextReveal>
      </section>

      <section className="bg-secondary text-primary pt-32">
        <div className="container px-4 md:px-8">
          {/* First Section - PHILOSOPHY label and title */}
          <div className="flex flex-col">
            <span className="font-neue-haas text-primary mb-6 text-xs tracking-wider uppercase">
              PHILOSOPHY
            </span>
            <h2 className="font-ivy-headline text-primary max-w-2xl text-4xl leading-tight md:text-5xl">
              The shimmering tower offers a rarefied collection of breathtaking
              full-floor residences.
            </h2>
          </div>
        </div>
      </section>
      <section className="bg-secondary text-primary pt-20 pb-32">
        <div className="container px-4 md:px-8">
          {/* Second Section - Paragraphs and link, aligned to the right */}
          <div className="flex flex-col gap-8 md:ml-auto md:w-1/2">
            <p className="font-neue-haas text-primary text-lg">
              Eden Park & Garden is a vibrant oasis in Abuja, offering a unique
              blend of entertainment and relaxation. From live music and dance
              shows to thrilling football matches, there&apos;s something for
              everyone. Indulge in traditional cuisine while enjoying the I
            </p>
            <p className="font-neue-haas text-primary text-lg">
              Eden Park & Garden is a vibrant oasis in Abuja, offering a unique
              blend of entertainment and relaxation. From live music and dance
              shows to thrilling football matches, there&apos;s something for
              everyone. Indulge in traditional cuisine while enjoying the I
            </p>
            <p className="font-neue-haas text-primary text-lg">
              Eden Park & Garden is a vibrant oasis in Abuja, offering a unique
              blend of entertainment and relaxation. From live music and dance
              shows to thrilling football matches, there&apos;s something for
              everyone. Indulge in traditional cuisine while enjoying the I
            </p>
            <Link
              href="/experiences"
              className="font-neue-haas text-primary mt-4 text-xs tracking-wider uppercase underline transition-opacity hover:opacity-70"
            >
              EXPLORE EXPERIENCES
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-secondary text-primary py-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <TextReveal
              className="max-w-4xl"
              startColor="rgba(70, 86, 67, 0.2)"
              endColor="rgb(70, 86, 67)"
            >
              <p className="font-ivy-headline text-primary text-3xl leading-tight md:text-4xl">
                Of all the vibrant spaces, it is the only one that becomes even
                more captivating as you explore, ending not with a grand finale
                but by seamlessly blending into the natural landscape.
              </p>
            </TextReveal>
          </div>
        </div>
      </section>

      {blogPosts.length > 0 && (
        <section className="bg-secondary text-primary py-32">
          <div className="mb-16 px-4 md:px-8">
            <span className="font-neue-haas text-primary mb-6 block text-xs tracking-wider uppercase">
              LATEST STORIES
            </span>
            <h2 className="font-ivy-headline text-primary text-4xl leading-tight md:text-5xl">
              Discover our latest events
            </h2>
          </div>
          <ul className="flex flex-col gap-8 px-4 md:flex-row md:px-8">
            {blogPosts.map((post) => (
              <BlogPreview key={post._id} post={post} />
            ))}
          </ul>
        </section>
      )}

      <TestimonialsTicker />
    </main>
  );
}
