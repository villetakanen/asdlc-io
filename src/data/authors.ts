export interface Author {
  name: string;
  url: string;
  sameAs: string[];
  affiliation?: string;
}

export const authors: Record<string, Author> = {
  "ville-takanen": {
    name: "Ville Takanen",
    url: "https://villetakanen.com",
    sameAs: ["https://villetakanen.com", "https://github.com/villetakanen"],
  },
  "mats-ljunggren": {
    name: "Mats Ljunggren",
    url: "https://github.com/ljunggren",
    sameAs: ["https://github.com/ljunggren"],
    affiliation: "Concord Design",
  },
};

export const DEFAULT_AUTHOR_SLUG = "ville-takanen";

export function resolveAuthors(slugs?: string[]): Author[] {
  const authorSlugs = slugs && slugs.length > 0 ? slugs : [DEFAULT_AUTHOR_SLUG];
  return authorSlugs.map((slug) => {
    const author = authors[slug];
    if (!author) {
      throw new Error(
        `Unknown author slug: "${slug}". Valid author slugs are: ${Object.keys(authors).join(", ")}`,
      );
    }
    return author;
  });
}
