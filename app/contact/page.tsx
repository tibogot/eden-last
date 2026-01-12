import ContactForm from "@/app/components/ContactForm";
import LocationMap from "@/app/components/LocationMap";

export default function Contact() {
  return (
    <main className="bg-secondary text-primary">
      <section className="relative w-full overflow-hidden pt-40 pb-32">
        <div className="relative z-10 flex h-full flex-col items-center justify-center">
          <div className="w-full px-4 md:px-8">
            <div className="flex flex-col items-start">
              <h1 className="font-ivy-headline text-primary mb-4 max-w-2xl text-5xl md:text-7xl">
                Drawing people together.
              </h1>
              <p className="text-primary mt-16 max-w-sm text-lg">
                Eden Park & Garden is a vibrant oasis in Abuja, offering a
                unique blend of entertainment and relaxation. From live music
                and dance shows to thrilling football matches, there.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16 pb-32 md:px-8">
        <ContactForm />
      </section>
      <section className="w-full">
        <LocationMap />
      </section>
    </main>
  );
}
