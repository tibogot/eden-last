import { Link } from "next-view-transitions";
import TextReveal from "@/app/components/TextReveal";
import Image from "next/image";
import AnimatedText from "@/app/components/AnimatedText3";
import HorizontalScrollCards from "../components/HorizontalScrollCards2";

export default function Test4() {
  return (
    <main className="bg-secondary text-primary">
      <section className="relative flex min-h-[150vh] w-full flex-col items-center justify-center gap-5 px-4 md:gap-6 md:px-8">
        <div className="absolute inset-0">
          <Image
            src="/images/diego.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
        <div className="relative z-10 w-full max-w-4xl text-center">
          <h1 className="font-ivy-headline mx-auto w-full text-5xl leading-tight text-white drop-shadow-md md:text-8xl">
            Where Every Meal Becomes a Moment
          </h1>
          <p className="mx-auto mt-10 max-w-lg text-center text-sm leading-relaxed text-white/90 drop-shadow-sm md:max-w-md md:text-base md:leading-relaxed">
            Our restaurant brings together seasonal ingredients, traditional
            recipes, and the warmth of the garden. Come for the food; stay for
            the experience.
          </p>
        </div>
        <p className="font-neue-haas absolute right-4 bottom-8 left-4 z-10 max-w-lg text-left text-sm leading-relaxed text-white/80 md:right-auto md:bottom-20 md:left-8 md:text-lg">
          Dinner in the garden is more than a meal—it’s a chance to slow down,
          taste the season, and share the table with people you care about. We
          welcome you to stay as long as you like.
        </p>
      </section>

      <section className="bg-secondary text-primary py-10 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center text-center">
            <AnimatedText>
              <span className="font-neue-haas mb-6 text-xs tracking-wider uppercase">
                VISIT US
              </span>
              <h2 className="font-ivy-headline mt-10 mb-8 max-w-3xl text-4xl leading-tight md:text-5xl">
                Dine with us in the heart of Abuja
              </h2>
              <p className="mx-auto mb-10 max-w-xl text-center text-lg">
                Reserve a table for lunch or dinner—enjoy traditional cuisine in
                the garden, on the terrace, or in our main dining room. Your
                table is waiting.
              </p>
            </AnimatedText>
          </div>
        </div>
      </section>

      <HorizontalScrollCards />

      <section className="py-24 md:py-40">
        <TextReveal
          className="mx-auto w-full max-w-4xl px-4 text-center md:px-8"
          startColor="rgba(70, 86, 67, 0.2)"
          endColor="rgb(70, 86, 67)"
        >
          <h4 className="font-ivy-headline text-3xl leading-tight md:text-6xl">
            Abuja&apos;s premier restaurant for traditional cuisine, seasonal
            dishes, and memorable meals in the garden.
          </h4>
        </TextReveal>
      </section>

      <section className="bg-secondary text-primary pt-32">
        <div className="container px-4 md:px-8">
          {/* PHILOSOPHY section */}
          <div className="flex flex-col">
            <span className="font-neue-haas text-primary mb-6 text-xs tracking-wider uppercase">
              PHILOSOPHY
            </span>
            <h2 className="font-ivy-headline text-primary max-w-2xl text-4xl leading-tight md:text-5xl">
              We believe great dining starts with the land, comes alive at the
              table, and stays with you long after the last bite.
            </h2>
          </div>
        </div>
      </section>

      <section className="bg-secondary text-primary pt-20 pb-32">
        <div className="container px-4 md:px-8">
          <div className="flex flex-col gap-8 md:ml-auto md:w-1/2">
            <p className="font-neue-haas text-primary text-lg">
              Our kitchen draws on local produce and time-honoured recipes to
              create dishes that feel both familiar and surprising. Every plate
              is prepared with care and served in a setting that lets the food—
              and the company—take centre stage.
            </p>
            <p className="font-neue-haas text-primary text-lg">
              Whether you&apos;re here for a long lunch under the trees, a
              romantic dinner on the terrace, or a celebration with family and
              friends, we aim to make every visit feel special. Seasonal menus,
              attentive service, and the calm of the garden define the
              experience.
            </p>
            <p className="font-neue-haas text-primary text-lg">
              We source from trusted suppliers and grow what we can on-site, so
              the flavours on your table reflect the best of the season and the
              region. From first course to last, we want you to leave nourished
              in every sense.
            </p>
            <Link
              href="/restaurant"
              className="font-neue-haas text-primary mt-4 text-xs tracking-wider uppercase underline transition-opacity hover:opacity-70"
            >
              VIEW MENU & RESERVE
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
                The best meals don&apos;t end at the plate—they linger in the
                garden, in conversation, and in the quiet satisfaction of a
                table well shared.
              </p>
            </TextReveal>
          </div>
        </div>
      </section>
      <section className="bg-secondary text-primary py-20">
        <div className="px-4 md:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-stretch md:gap-12">
            <div className="relative h-[800px] w-full md:w-1/2">
              <Image
                src="/images/colin.jpg"
                alt="Eden Garden restaurant dining"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex w-full flex-col md:w-1/2">
              <div className="flex flex-col justify-start md:sticky md:top-24">
                <span className="font-neue-haas text-primary mb-4 text-xs tracking-wider uppercase">
                  THE DINING ROOM
                </span>
                <h2 className="font-ivy-headline text-primary mb-6 max-w-xl text-3xl leading-tight md:text-4xl">
                  A restaurant in the heart of the garden.
                </h2>
                <p className="font-neue-haas text-primary max-w-xl text-lg">
                  Our dining room opens onto the terrace and the garden, so
                  every seat feels connected to the outdoors. Whether you sit
                  inside or under the trees, you’re here for the same thing:
                  thoughtful food, warm service, and time at the table.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary text-primary py-20">
        <div className="px-4 md:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-stretch md:gap-12">
            <div className="flex w-full flex-col md:w-1/2">
              <div className="flex flex-col justify-start md:sticky md:top-24">
                <span className="font-neue-haas text-primary mb-4 text-xs tracking-wider uppercase">
                  THE TERRACE
                </span>
                <h2 className="font-ivy-headline text-primary mb-6 max-w-xl text-3xl leading-tight md:text-4xl">
                  Dine outdoors, surrounded by greenery.
                </h2>
                <p className="font-neue-haas text-primary max-w-xl text-lg">
                  The terrace is where the garden and the table meet. Book for
                  lunch or dinner and enjoy seasonal dishes in the open
                  air—ideal for a quiet meal for two or a gathering with friends
                  and family.
                </p>
              </div>
            </div>
            <div className="relative h-[800px] w-full md:w-1/2">
              <Image
                src="/images/colin.jpg"
                alt="Eden Garden terrace dining"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
