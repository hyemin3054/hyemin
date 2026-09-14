export const sanityEnv = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production",
  // Stable perspective support for excluding Draft documents from public reads.
  apiVersion: "2025-02-19",
};

export const isSanityConfigured = /^[a-z0-9]+$/.test(sanityEnv.projectId)
  && /^[a-z0-9][a-z0-9_-]*$/.test(sanityEnv.dataset);
