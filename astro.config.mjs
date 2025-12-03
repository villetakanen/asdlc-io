// @ts-check
import { defineConfig } from "astro/config";
import rehypeMermaid from "rehype-mermaid";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://asdlc.io",
  integrations: [sitemap()],
  markdown: {
    syntaxHighlight: "prism",
    rehypePlugins: [
      [
        rehypeMermaid,
        {
          strategy: "img-svg",
          mermaidConfig: {
            theme: "base",
            themeVariables: {
              primaryColor: "#f04e30",
              primaryTextColor: "#EEEEEE",
              primaryBorderColor: "#f04e30",
              lineColor: "#111111",
              edgeLabelBackground: "#111111",
              edgeLabelTextColor: "#000000",
              fontFamily: '"B612 Mono", monospace',
            },
            themeCSS: ".edgePath .path { stroke-width: 3px; }",
          },
        },
      ],
    ],
  },
});
