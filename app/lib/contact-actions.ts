"use server";

export async function submitContactForm(formData: FormData) {
  // Extract form data
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const telephone = formData.get("telephone") as string;
  const natureOfEnquiry = formData.get("natureOfEnquiry") as string;
  const message = formData.get("message") as string;
  const joinCommunity = formData.get("joinCommunity") === "on";
  const consent = formData.get("consent") === "on";

  // TODO: Implement your form submission logic here
  // This could send an email, save to a database, etc.
  console.log("Form submitted:", {
    firstName,
    lastName,
    email,
    telephone,
    natureOfEnquiry,
    message,
    joinCommunity,
    consent,
  });

  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Redirect or return success
  // You can redirect to a success page here if needed
  // redirect('/contact/success');
}
