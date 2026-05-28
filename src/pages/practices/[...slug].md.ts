import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { assertSizeCap } from "../../lib/markdown-variant";

// Per spec: kept explicit so a future divergence from other collections stays local.
const PUBLISHED = new Set(["Live", "Experimental"]);

export async function getStaticPaths() {
  const entries = await getCollection("practices", (e) => PUBLISHED.has(e.data.status));
  return entries.map((e) => ({ params: { slug: e.id }, props: { entry: e } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as {
    entry: Awaited<ReturnType<typeof getCollection<"practices">>>[number];
  };
  const body = assertSizeCap(entry, "practices");
  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
