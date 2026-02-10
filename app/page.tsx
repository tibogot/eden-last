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
import StickyClipRevealText from "./components/StickyClipRevealText";
import HubsSection from "./components/HubsSection";
import WhyUsSection from "./components/WhyUs";

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
      <HeroParallax imageSrc="/images/sasuke.jpg" imageAlt="Hero image">
        {/* Hero logo - same positioning as experiences (centered, slight offset) */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
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
        </div>
        {/* <RestaurantHeroTitle title="Experience paradise in every sip and bite" /> */}
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
      {/* <section className="bg-secondary text-primary py-40">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <TextReveal
              className="max-w-3xl"
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
      </section> */}
      <section className="py-20 md:py-32">
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
      <section className="bg-secondary text-primary pt-16">
        <div className="container px-4 md:px-8">
          {/* First Section - PHILOSOPHY label and title */}
          <div className="flex flex-col">
            <span className="font-neue-haas text-primary mb-6 text-xs tracking-wider uppercase">
              PHILOSOPHY
            </span>
            <h2 className="font-ivy-headline text-primary max-w-2xl text-4xl leading-tight md:text-5xl">
              Where nature meets celebration, and every gathering becomes a
              memory.
            </h2>
          </div>
        </div>
      </section>
      <section className="bg-secondary text-primary py-20">
        <div className="px-4 md:px-8">
          {/* Second Section - Paragraphs and link, aligned to the right */}
          <div className="flex flex-col gap-8 md:ml-auto md:w-1/2">
            <p className="font-neue-haas text-primary max-w-xl text-lg">
              At Eden Park & Garden, we believe in drawing people together—in a
              space where lush greenery meets the warmth of shared moments. Our
              philosophy is simple: create an oasis in the heart of Abuja where
              entertainment, relaxation, and connection thrive.
            </p>
            {/* <p className="font-neue-haas text-primary max-w-xl text-lg">
              Whether you&apos;re here for live music under the stars, a dance
              performance, or a thrilling football match, every visit is
              designed to leave a lasting impression. We pair authentic
              traditional cuisine with an atmosphere that invites you to linger,
              celebrate, and unwind.
            </p> */}
            {/* <p className="font-neue-haas text-primary max-w-xl text-lg">
              Eden Park & Garden is more than a venue—it&apos;s a place where
              memories are made and stories unfold. We invite you to experience
              paradise in every sip and bite.
            </p> */}
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
      <HubsSection />
      {/* <section className="bg-secondary text-primary py-32">
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
      </section> */}
      {/* <ExpandingImageReveal
        imageSrc="/images/hero-2.jpg"
        imageAlt="Eden Garden experience"
        title="Where every moment becomes a memory"
        description="Step into a world where nature meets celebration, and every visit tells a new story."
      /> */}
      {/* <PinnedImageTextReveal /> */}
      {/* <StickyImageTextReveal /> */}
      {/* <StickyClipReveal /> */}
      <StickyClipRevealText
        imageSrc="/images/colin.jpg"
        imageAlt="Eden Garden atmosphere"
        textContent={
          <>
            <span className="font-neue-haas mb-6 block text-xs tracking-wider uppercase">
              DISCOVER
            </span>
            <h2 className="font-ivy-headline mb-6 max-w-3xl text-4xl leading-tight md:text-6xl">
              Where every moment becomes an unforgettable experience
            </h2>
            <p className="text-primary/70 mx-auto max-w-xl text-base md:text-lg">
              From live music under the stars to the warmth of traditional
              cuisine, Eden Garden is where memories are made.
            </p>
          </>
        }
        overlayContent={
          <>
            <h2 className="font-ivy-headline mb-6 text-4xl leading-tight md:text-7xl">
              A place where stories unfold
            </h2>
            <p className="text-lg opacity-90 md:text-xl">
              Every corner holds a new adventure, every moment a chance to
              connect.
            </p>
          </>
        }
      />
      <WhyUsSection />
      <TestimonialsTicker />
      {blogPosts.length > 0 && (
        <section className="bg-secondary text-primary py-16">
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
    </main>
  );
}
