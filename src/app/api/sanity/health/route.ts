import { checkSanityConnection } from "@/sanity/lib/content";

export const dynamic = "force-dynamic";
export async function GET() {
  // This endpoint reports published counts only, never tokens or draft content.
  const result = await checkSanityConnection();
  return Response.json({ status: result.status, perspective: "published", counts: result.data }, {
    status: result.status === "ready" ? 200 : 503, headers: { "Cache-Control": "no-store" },
  });
}
