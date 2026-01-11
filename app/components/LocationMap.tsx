export default function LocationMap() {
  return (
    <div className="flex flex-col md:flex-row w-full px-4 md:px-8 py-16">
      {/* Left Side - Contact Information */}
      <div className="w-full md:w-1/2 flex flex-col justify-between">
        <h2 className="font-ivy-headline text-primary text-4xl md:text-5xl leading-tight">
          Our location
        </h2>
        <div className="flex flex-col gap-6">
          <div>
            <p className="font-neue-haas text-primary text-base leading-relaxed">
              228 P.O.W. Mafemi Cres, near Chida Hotel
            </p>
            <p className="font-neue-haas text-primary text-base leading-relaxed">
              Utako, Abuja 900108
            </p>
            <p className="font-neue-haas text-primary text-base leading-relaxed">
              Federal Capital Territory, Nigeria
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Map */}
      <div className="w-full md:w-1/2 h-[600px] md:h-[700px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.3157!2d7.4407!3d9.0846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0a2b8a8a8a8b%3A0x8a8a8a8a8a8a8a8a!2s228%20P.O.W.%20Mafemi%20Cres%2C%20near%20Chida%20Hotel%2C%20Utako%2C%20Abuja%20900108%2C%20Federal%20Capital%20Territory%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1234567890123!5m2!1sen!2sng"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
          title="Eden Park & Garden Location"
        />
      </div>
    </div>
  );
}
