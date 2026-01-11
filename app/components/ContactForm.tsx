import { submitContactForm } from "@/app/lib/contact-actions";

export default function ContactForm() {
  return (
    <form action={submitContactForm} className="w-full max-w-4xl md:ml-auto">
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        {/* First Name */}
        <div className="flex flex-col">
          <label htmlFor="firstName" className="sr-only">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="FIRST NAME"
            required
            className="font-neue-haas border-primary text-primary placeholder:text-primary border-0 border-b bg-transparent pb-2 placeholder:text-xs placeholder:tracking-wider placeholder:uppercase focus:ring-0 focus:outline-none"
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <label htmlFor="lastName" className="sr-only">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="LASTNAME"
            required
            className="font-neue-haas border-primary text-primary placeholder:text-primary border-0 border-b bg-transparent pb-2 placeholder:text-xs placeholder:tracking-wider placeholder:uppercase focus:ring-0 focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="EMAIL"
            required
            className="font-neue-haas border-primary text-primary placeholder:text-primary border-0 border-b bg-transparent pb-2 placeholder:text-xs placeholder:tracking-wider placeholder:uppercase focus:ring-0 focus:outline-none"
          />
        </div>

        {/* Telephone */}
        <div className="flex flex-col">
          <label htmlFor="telephone" className="sr-only">
            Telephone
          </label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            placeholder="TELEPHONE"
            required
            className="font-neue-haas border-primary text-primary placeholder:text-primary border-0 border-b bg-transparent pb-2 placeholder:text-xs placeholder:tracking-wider placeholder:uppercase focus:ring-0 focus:outline-none"
          />
        </div>
      </div>

      {/* Nature of Enquiry */}
      <div className="mb-8 flex flex-col">
        <label htmlFor="natureOfEnquiry" className="sr-only">
          Nature of Enquiry
        </label>
        <select
          id="natureOfEnquiry"
          name="natureOfEnquiry"
          required
          className="font-neue-haas border-primary text-primary appearance-none border-0 border-b bg-transparent pb-2 text-xs tracking-wider uppercase focus:ring-0 focus:outline-none"
        >
          <option value="">NATURE OF ENQUIRY (PLEASE SELECT) *</option>
          <option value="general">General Inquiry</option>
          <option value="booking">Booking</option>
          <option value="event">Event Inquiry</option>
          <option value="restaurant">Restaurant</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Message */}
      <div className="mb-8 flex flex-col">
        <label htmlFor="message" className="sr-only">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="MESSAGE"
          rows={5}
          required
          className="font-neue-haas border-primary text-primary placeholder:text-primary resize-none border-0 border-b bg-transparent pb-2 placeholder:text-xs placeholder:tracking-wider placeholder:uppercase focus:ring-0 focus:outline-none"
        />
      </div>

      {/* Checkboxes */}
      <div className="mb-8 flex flex-col gap-4">
        <label className="font-neue-haas text-primary flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="joinCommunity"
            className="border-primary text-primary focus:ring-primary mt-1 h-4 w-4 cursor-pointer"
          />
          <span>Join our community</span>
        </label>

        <label className="font-neue-haas text-primary flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="consent"
            required
            className="border-primary text-primary focus:ring-primary mt-1 h-4 w-4 cursor-pointer"
          />
          <span>
            I consent to my information being collected in accordance with the
            Eden Park & Garden privacy policy
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="font-neue-haas text-primary border-primary cursor-pointer border-b pb-2 text-xs tracking-wider uppercase transition-opacity hover:opacity-70"
      >
        SUBMIT ENQUIRY
      </button>
    </form>
  );
}
