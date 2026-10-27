import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { glob } from "glob";

const ROOT = path.resolve(import.meta.dirname, "..");
const diagramPattern = () => /(```mermaid(?![-\w])([^\n]*)\n([\s\S]*?)```)(?:\s*<figure class="mermaid-diagram">[\s\S]*?<\/figure>)?/g;

/** @param {string} code @param {string} location */
export function readDiagramMetadata(code, location) {
  const alternatives = [...code.matchAll(/^[\t ]*%%[\t ]+alt:[\t ]*(.*)$/gm)];
  const alt = alternatives[0]?.[1].trim();
  if (alternatives.length !== 1 || !alt || /^mermaid\s+diagram$/i.test(alt)) {
    throw new Error(`${location}: require exactly one non-empty, descriptive %% alt: comment`);
  }
  const caption = code.match(/^[\t ]*%%[\t ]+caption:[\t ]*(.*)$/m)?.[1].trim() ?? "";
  return { alt, caption };
}

/** @param {string} value */
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;")
    .replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;");
}

/** @param {string} svgFileName @param {{ alt: string, caption: string }} metadata */
export function renderFigure(svgFileName, { alt, caption }) {
  return `<figure class="mermaid-diagram">
  <img src="/mermaid/${svgFileName}" alt="${escapeHtml(alt)}" />${caption ? `\n  <figcaption>${escapeHtml(caption)}</figcaption>` : ""}
</figure>`;
}

/** @param {string} code @param {string} outputPath @param {string} root */
function renderDiagram(code, outputPath, root) {
  const temporaryDirectory = mkdtempSync(path.join(tmpdir(), "asdlc-mermaid-"));
  const inputPath = path.join(temporaryDirectory, "diagram.mmd");
  try {
    writeFileSync(inputPath, code);
    execFileSync("pnpm", ["exec", "mmdc", "-i", inputPath, "-o", outputPath,
      "-c", path.join(root, "mermaid.json"), "-b", "transparent"], {
      cwd: root,
      stdio: "inherit",
    });
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}

/** @param {{ root?: string, render?: typeof renderDiagram }} options */
export async function generateDiagrams({ root = ROOT, render = renderDiagram } = {}) {
  const files = (await glob(["src/content/**/*.md", "src/pages/**/*.md"], { cwd: root })).sort();
  // Preflight every source before rendering assets or rewriting any document.
  const documents = files.map((file) => {
    const content = readFileSync(path.join(root, file), "utf8");
    const diagrams = [...content.matchAll(diagramPattern())].map((match, index) => ({
      match,
      code: match[3].trim(),
      metadata: readDiagramMetadata(match[3], `${file}, diagram ${index + 1}`),
    }));
    return { file, content, diagrams };
  });
  const outputDirectory = path.join(root, "public/mermaid");
  mkdirSync(outputDirectory, { recursive: true });

  for (const { file, content, diagrams } of documents) {
    if (!diagrams.length) continue;
    const baseName = path.basename(file, ".md").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    let updated = "";
    let lastIndex = 0;
    for (const [index, { match, code, metadata }] of diagrams.entries()) {
      const svgFileName = `${baseName}-fig-${index + 1}.svg`;
      console.log(`Generating diagram ${index + 1} for ${file}...`);
      try {
        render(code, path.join(outputDirectory, svgFileName), root);
      } catch (error) {
        throw new Error(`${file}, diagram ${index + 1}: rendering failed`, { cause: error });
      }
      updated += content.slice(lastIndex, match.index);
      updated += `${match[1]}\n\n${renderFigure(svgFileName, metadata)}`;
      lastIndex = match.index + match[0].length;
    }
    updated += content.slice(lastIndex);
    if (updated !== content) {
      writeFileSync(path.join(root, file), updated);
      console.log(`Updated ${file}`);
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  generateDiagrams().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
