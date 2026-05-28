export const MAX_CHARS = 50_000;
export const PUBLISHED_STATUSES = new Set(["Live", "Experimental"]);
const SITE = "https://asdlc.io";

export type MarkdownVariantEntry = {
  id: string;
  body?: string;
  data: {
    title: string;
    description: string;
    status: string;
    lastUpdated: Date;
    tags?: string[];
  };
};

export function buildFrontmatter(entry: MarkdownVariantEntry, collection: string): string {
  const { title, description, status, lastUpdated, tags } = entry.data;
  const canonical = `${SITE}/${collection}/${entry.id}/`;
  return [
    "---",
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `status: ${JSON.stringify(status)}`,
    `lastUpdated: ${JSON.stringify(lastUpdated.toISOString().slice(0, 10))}`,
    `tags: ${JSON.stringify(tags ?? [])}`,
    `canonical: ${JSON.stringify(canonical)}`,
    "---",
  ].join("\n");
}

export function buildPayload(entry: MarkdownVariantEntry, collection: string): string {
  if (!entry.body) {
    throw new Error(`md payload for ${collection}/${entry.id} has empty body`);
  }
  return `${buildFrontmatter(entry, collection)}\n\n${entry.body}`;
}

export function assertSizeCap(entry: MarkdownVariantEntry, collection: string): string {
  const body = buildPayload(entry, collection);
  if (body.length > MAX_CHARS) {
    throw new Error(
      `md payload for ${collection}/${entry.id} is ${body.length} chars (>${MAX_CHARS})`,
    );
  }
  return body;
}
