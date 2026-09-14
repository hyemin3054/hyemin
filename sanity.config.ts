"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { sanityEnv } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

// Only mounted after the Studio page verifies configuration. No fake project ID.
export default defineConfig({
  name: "grotto", title: "The Grotto Art Window", basePath: "/studio",
  projectId: sanityEnv.projectId, dataset: sanityEnv.dataset,
  plugins: [structureTool({ structure })],
  schema: { types: schemaTypes, templates: (templates) => templates.filter((template) => template.schemaType !== "siteSettings") },
  document: { actions: (actions, context) => context.schemaType === "siteSettings" ? actions.filter((action) => action.action !== "duplicate" && action.action !== "delete") : actions },
});
