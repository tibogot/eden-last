export default function Contact() {
  return (
    <main className="bg-secondary text-primary pt-20">
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-4xl font-ivy-light mb-4">
            Contact
          </h1>
          <p className="text-lg max-w-2xl">
            Get in touch with us. We'd love to hear from you.
          </p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h2 className="text-3xl font-ivy-light mb-4">
            Visit Us
          </h2>
          <p className="text-lg max-w-2xl">
            We're here to help. Reach out through any of our contact methods.
          </p>
        </div>
      </section>
    </main>
  );
}

