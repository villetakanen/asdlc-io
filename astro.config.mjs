// @ts-check
import { readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
// import rehypeMermaid from "rehype-mermaid";

import sitemap from "@astrojs/sitemap";
import { glob } from "glob";
import matter from "gray-matter";

/**
 * Build a URL-path → lastmod ISO string map from article frontmatter.
 * Runs at config-load time (Node context); astro:content is NOT available here.
 *
 * @returns {Record<string, string>}
 */
function buildLastmodMap() {
  /** @type {Record<string, string>} */
  const map = {};

  const COLLECTIONS = ["concepts", "patterns", "practices", "recipes"];

  for (const collection of COLLECTIONS) {
    const files = glob.sync(`src/content/${collection}/**/*.md`);

    for (const file of files) {
      try {
        const raw = readFileSync(file, "utf-8");
        const { data } = matter(raw);

        if (!data.lastUpdated) continue;

        // Derive the id: strip "src/content/{collection}/" prefix and ".md" suffix
        const prefix = `src/content/${collection}/`;
        const id = file.slice(prefix.length).replace(/\.md$/, "");

        const urlPath = `/${collection}/${id}/`;
        map[urlPath] = new Date(data.lastUpdated).toISOString();
      } catch {
        // Degrade gracefully — one bad file must not abort the build
      }
    }
  }

  return map;
}

const lastmodMap = buildLastmodMap();

// https://astro.build/config
export default defineConfig({
  site: "https://asdlc.io",
  integrations: [
    sitemap({
      serialize(item) {
        const pathname = new URL(item.url).pathname;
        // Normalize to trailing slash for consistent lookup
        const key = pathname.endsWith("/") ? pathname : `${pathname}/`;
        const lastmod = lastmodMap[key];
        if (lastmod) {
          return { ...item, lastmod };
        }
        return item;
      },
    }),
  ],
  markdown: {
    syntaxHighlight: "prism",
    rehypePlugins: [
      // [
      //   rehypeMermaid,
      //   {
      //     strategy: "img-svg",
      //     mermaidConfig: {
      //       theme: "base",
      //       themeVariables: {
      //         primaryColor: "#f04e30",
      //         primaryTextColor: "#EEEEEE",
      //         primaryBorderColor: "#f04e30",
      //         lineColor: "#111111",
      //         edgeLabelBackground: "#111111",
      //         edgeLabelTextColor: "#000000",
      //         fontFamily: '"B612 Mono", monospace',
      //       },
      //       themeCSS: ".edgePath .path { stroke-width: 3px; }",
      //     },
      //   },
      // ],
    ],
  },
});
