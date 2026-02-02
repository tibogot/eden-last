import Shopify from "@/app/components/Shopify";

export default function ShopifyPage() {
  return (
    <main className="relative w-full bg-secondary">
      {/* Full viewport container for the Shopify component */}
      <div className="fixed inset-0 w-full h-screen">
        <Shopify
          image1Src="/images/hero.jpg"
          image2Src="/images/hero-2.jpg"
          className="w-full h-full"
        />
      </div>
      
      {/* Scrollable content to enable scroll-based animations */}
      <div className="relative w-full h-[300vh] pointer-events-none">
        <div className="sticky top-0 flex items-center justify-center h-screen pointer-events-auto">
          <div className="text-center px-4 z-10">
            <h1 className="font-ivy-headline text-4xl md:text-6xl text-white mb-4">
              Scroll to see the effect
            </h1>
            <p className="font-neue-haas text-lg text-white/80">
              The images will transition as you scroll
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
