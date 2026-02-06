import { Link } from "next-view-transitions";
import TextReveal from "@/app/components/TextReveal";
import TestimonialsTicker from "@/app/components/TestimonialsTicker";
import BlogPreview from "@/app/components/BlogPreview";
import ServicesGrid from "@/app/components/ServicesGrid";
import ExpandingImageReveal from "@/app/components/ExpandingImageReveal";
import PinnedImageTextReveal from "@/app/components/PinnedImageTextReveal";
import StickyImageTextReveal from "@/app/components/StickyImageTextReveal";
import StickyClipReveal from "@/app/components/StickyClipReveal";
import AnimatedTextWords from "@/app/components/AnimatedTextWords";
import AnimatedTextChars from "@/app/components/AnimatedTextChars";
import HeroParallax from "@/app/components/HeroParallax";
import RestaurantHeroTitle from "@/app/components/RestaurantHeroTitle";
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
      <HeroParallax
        imageSrc="/images/mche-lee-Bribs3.jpg"
        imageAlt="Hero image"
      >
        {/* Hero logo - same positioning as experiences (centered, slight offset) */}
        {/* <div className="absolute inset-0 flex items-center justify-center px-4">
          <div
            className="relative -ml-8 flex w-full max-w-4xl items-center justify-center md:-ml-16"
            style={{
              maskImage: "url(/images/newlogo.svg)",
              WebkitMaskImage: "url(/images/newlogo.svg)",
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
              width: "clamp(240px, 65vw, 672px)",
              aspectRatio: "933 / 311",
              backgroundColor: "var(--color-secondary)",
            }}
            role="img"
            aria-label="Eden Garden"
          />
        </div> */}
        <RestaurantHeroTitle title="Experience paradise in every sip and bite" />
        {/* Paragraph - Bottom Center */}
        <div className="absolute right-0 bottom-0 left-0 flex items-center justify-center pb-8 text-center">
          <div className="container mx-auto px-4">
            <p className="mx-auto max-w-lg text-base text-white">
              Eden Park & Garden is a vibrant oasis in Abuja, offering a unique
              blend of entertainment and relaxation. From live music and dance
              shows to thrilling football matches, there.
            </p>
          </div>
        </div>
      </HeroParallax>

      <section className="py-32 md:py-64">
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

      <section className="bg-secondary text-primary pt-8">
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
      <ServicesGrid />
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
      {/* <ExpandingImageReveal
        imageSrc="/images/hero-2.jpg"
        imageAlt="Eden Garden experience"
        title="Where every moment becomes a memory"
        description="Step into a world where nature meets celebration, and every visit tells a new story."
      /> */}
      {/* <PinnedImageTextReveal /> */}
      {/* <StickyImageTextReveal /> */}
      <StickyClipReveal />
      <TestimonialsTicker />

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

      {/* AnimatedTextWords showcase */}
      <section className="bg-secondary text-primary border-primary/10 border-t py-32">
        <div className="container mx-auto px-4 md:px-8">
          <span className="font-neue-haas text-primary mb-8 block text-xs tracking-wider uppercase">
            Text animations (words & letters)
          </span>
          <div className="flex flex-col gap-24">
            <div className="max-w-4xl">
              <p className="font-neue-haas text-primary/70 mb-3 text-xs tracking-wider uppercase">
                Hero (plays on load) — lift
              </p>
              <AnimatedTextWords
                isHero
                stagger={0.05}
                duration={0.5}
                variant="lift"
                className="font-ivy-headline text-primary text-4xl leading-tight md:text-6xl"
              >
                <h2>Every word reveals itself in sequence.</h2>
              </AnimatedTextWords>
            </div>
            <div className="max-w-4xl">
              <p className="font-neue-haas text-primary/70 mb-3 text-xs tracking-wider uppercase">
                Scroll-triggered — scale
              </p>
              <AnimatedTextWords
                start="top 85%"
                stagger={0.06}
                variant="scale"
                className="font-ivy-headline text-primary text-3xl leading-tight md:text-5xl"
              >
                <p>Scroll here to see words pop in one by one.</p>
              </AnimatedTextWords>
            </div>
            <div className="max-w-2xl">
              <p className="font-neue-haas text-primary/70 mb-3 text-xs tracking-wider uppercase">
                Scroll-triggered — fade
              </p>
              <AnimatedTextWords
                start="top 85%"
                stagger={0.04}
                variant="fade"
                className="font-neue-haas text-primary text-lg leading-relaxed"
              >
                <p>
                  A subtle fade-in per word works well for longer body copy and
                  paragraphs.
                </p>
              </AnimatedTextWords>
            </div>
            <div className="max-w-4xl">
              <p className="font-neue-haas text-primary/70 mb-3 text-xs tracking-wider uppercase">
                Letter-by-letter (slide up, same as line reveal)
              </p>
              <AnimatedTextChars
                start="top 85%"
                stagger={0.02}
                duration={0.5}
                className="font-ivy-headline text-primary text-3xl leading-tight md:text-5xl"
              >
                <p>Each letter comes up from below in sequence.</p>
              </AnimatedTextChars>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
