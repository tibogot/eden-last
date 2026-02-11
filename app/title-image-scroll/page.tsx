import CenteredTitleImageScroll from "@/app/components/CenteredTitleImageScroll";

// Fixed heights in vh so Lenis scroll behaves correctly (total scroll length is known).
const HERO_VH = 100;
// Scroll sections: ~(padding + n × section height) in vh; 4 items × 540px + 128px ≈ 270vh
const SCROLL_SECTIONS_VH = 270;
const FOOTER_VH = 20;
const TOTAL_PAGE_VH = HERO_VH + SCROLL_SECTIONS_VH + FOOTER_VH;

export default function TitleImageScrollPage() {
  return (
    <main className="min-h-screen bg-black">
      <div
        className="flex flex-col"
        style={{ height: `${TOTAL_PAGE_VH}vh` }}
      >
        <section
          className="flex shrink-0 flex-col items-center justify-center bg-black px-6 text-white"
          style={{ height: `${HERO_VH}vh` }}
        >
          <h1 className="text-center text-[clamp(2.5rem,6vw,4rem)] font-bold leading-tight tracking-tight">
            Title & Image Scroll
          </h1>
          <p className="mt-4 max-w-md text-center text-white/60">
            Scroll to see the effect
          </p>
        </section>
        <CenteredTitleImageScroll
          scrollHeightVh={SCROLL_SECTIONS_VH}
          className="shrink-0"
        />
        <footer
          className="flex shrink-0 items-center justify-center border-t border-white/10 bg-black px-6 text-white/50"
          style={{ height: `${FOOTER_VH}vh` }}
        >
          <span className="text-sm">© 2025</span>
        </footer>
      </div>
    </main>
  );
}
