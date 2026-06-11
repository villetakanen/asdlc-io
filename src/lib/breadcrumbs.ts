/**
 * breadcrumbs.ts
 *
 * Shared helper for building BreadcrumbList crumb arrays.
 * The segment→label map lives here — ONE place only.
 * Returns { name, item }[] with absolute URLs for use with
 * <StructuredData type="BreadcrumbList" data={{ itemListElement: crumbs }} />.
 */

export interface BreadcrumbItem {
  name: string;
  item: string;
}

/** Canonical mapping: URL segment → human-readable breadcrumb label */
const COLLECTION_LABELS: Record<string, string> = {
  concepts: "Concepts",
  patterns: "Patterns",
  practices: "Practices",
  recipes: "Recipes",
};

const SITE_ORIGIN = "https://asdlc.io";

/** Root crumb — always position 1 */
const HOME_CRUMB: BreadcrumbItem = {
  name: "Home",
  item: `${SITE_ORIGIN}/`,
};

/**
 * Build a 2-crumb trail for a collection index page.
 * e.g. Home → Concepts
 */
export function collectionBreadcrumbs(collection: string): BreadcrumbItem[] {
  const label = COLLECTION_LABELS[collection] ?? collection;
  return [
    HOME_CRUMB,
    {
      name: label,
      item: `${SITE_ORIGIN}/${collection}/`,
    },
  ];
}

/**
 * Build a 3-crumb trail for an article page.
 * e.g. Home → Concepts → Levels of Autonomy
 *
 * @param collection  The URL segment, e.g. "concepts"
 * @param leafName    Human article title (longTitle ?? title — never the slug)
 * @param leafUrl     Absolute canonical URL for the article page
 */
export function articleBreadcrumbs(
  collection: string,
  leafName: string,
  leafUrl: string,
): BreadcrumbItem[] {
  const label = COLLECTION_LABELS[collection] ?? collection;
  return [
    HOME_CRUMB,
    {
      name: label,
      item: `${SITE_ORIGIN}/${collection}/`,
    },
    {
      name: leafName,
      item: leafUrl,
    },
  ];
}
