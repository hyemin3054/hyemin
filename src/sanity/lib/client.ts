import "server-only";
import { createClient } from "next-sanity";
import { sanityEnv, isSanityConfigured } from "../env";

// The optional read token stays on the server. Studio uses each editor's login.
export const client = isSanityConfigured ? createClient({
  ...sanityEnv, useCdn: false, perspective: "published", stega: false,
  token: process.env.SANITY_API_READ_TOKEN || undefined,
  timeout: 10000, maxRetries: 1,
}) : null;
