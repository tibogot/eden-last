import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "2ktcdo0w",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-12-01", // Use a recent date format
  useCdn: process.env.NODE_ENV === "production", // Use CDN in production, fresh data in development
});

export default client;
