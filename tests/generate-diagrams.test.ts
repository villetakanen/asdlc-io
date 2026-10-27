import { spawnSync } from "node:child_process";
import {
  chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync,
  rmSync, symlinkSync, writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { generateDiagrams, readDiagramMetadata, renderFigure } from "../scripts/generate-diagrams.mjs";

const roots: string[] = [];
const repository = resolve(import.meta.dirname, "..");
const block = (metadata = "%% alt: Input passes through validation to output.") =>
  `\`\`\`mermaid\n${metadata}\nflowchart LR\n  A --> B\n\`\`\``;

function workspace(documents: Record<string, string>) {
  const root = mkdtempSync(join(tmpdir(), "asdlc-diagrams-test-"));
  roots.push(root);
  for (const [file, content] of Object.entries(documents)) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), content);
  }
  return root;
}

function cliFixture(metadata: string) {
  const root = workspace({ "src/content/concepts/example.md": block(metadata) });
  mkdirSync(join(root, "scripts"));
  copyFileSync(join(repository, "scripts/generate-diagrams.mjs"), join(root, "scripts/generate-diagrams.mjs"));
  symlinkSync(join(repository, "node_modules"), join(root, "node_modules"), "dir");
  return root;
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("Mermaid text alternatives", () => {
  it("reads alt independently from an optional caption", () => {
    expect(readDiagramMetadata("%% alt: Input is validated.\n%% caption: Validation pipeline", "example"))
      .toEqual({ alt: "Input is validated.", caption: "Validation pipeline" });
    expect(readDiagramMetadata("  %% alt:  Input is validated.  ", "example"))
      .toEqual({ alt: "Input is validated.", caption: "" });
  });

  it.each([
    "", "%% caption: A visible caption", "%% alt:", "%% alt:   ",
    "%% alt: Mermaid Diagram", "%% alt: mermaid DIAGRAM",
    "%% alt: First\n%% alt: Second", "%% alt:\n%% caption: Not an alternative",
  ])("rejects invalid metadata: %j", (metadata) => {
    expect(() => readDiagramMetadata(metadata, "example.md, diagram 2"))
      .toThrow("example.md, diagram 2: require exactly one non-empty, descriptive %% alt: comment");
  });

  it("escapes attribute and caption text without interpreting HTML", () => {
    const figure = renderFigure("example-fig-1.svg", {
      alt: 'Input & "quoted" <output> \'value\'',
      caption: '<script>alert("x")</script> & more',
    });
    expect(figure).toContain('alt="Input &amp; &quot;quoted&quot; &lt;output&gt; &#39;value&#39;"');
    expect(figure).toContain('<figcaption>&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; more</figcaption>');
    expect(renderFigure("example.svg", { alt: "Input becomes output.", caption: "" }))
      .not.toContain("figcaption");
  });
});

describe("Mermaid generation", () => {
  it("replaces existing figures, preserves source/captions/URLs, and is repeatable", async () => {
    const first = block("%% alt: Input becomes output.\n%% caption: Visible caption");
    const second = block("%% alt: A second input becomes output.");
    const source = `## Example\n\n${first}\n\n<figure class="mermaid-diagram">\n  <img src="/mermaid/example-fig-1.svg" alt="Mermaid Diagram" />\n</figure>\n\nBetween\n\n${second}\n\nAfter\n`;
    const root = workspace({ "src/content/concepts/example.md": source });
    const render = vi.fn();
    await generateDiagrams({ root, render });
    const file = join(root, "src/content/concepts/example.md");
    const generated = readFileSync(file, "utf8");
    expect(generated).toContain(first);
    expect(generated).toContain(second);
    expect(generated).toContain("\n\nBetween\n\n");
    expect(generated).toContain("\n\nAfter\n");
    expect(generated.match(/<figure/g)).toHaveLength(2);
    expect(generated).toContain('src="/mermaid/example-fig-1.svg" alt="Input becomes output."');
    expect(generated).toContain('src="/mermaid/example-fig-2.svg"');
    expect(generated).toContain("<figcaption>Visible caption</figcaption>");
    expect(render).toHaveBeenCalledTimes(2);
    await generateDiagrams({ root, render });
    expect(readFileSync(file, "utf8")).toBe(generated);
  });

  it("includes page diagrams", async () => {
    const root = workspace({ "src/pages/getting-started.md": block() });
    const render = vi.fn();
    await generateDiagrams({ root, render });
    expect(render).toHaveBeenCalledWith(expect.any(String),
      join(root, "public/mermaid/getting-started-fig-1.svg"), root);
  });

  it("validates the whole corpus before rendering or rewriting anything", async () => {
    const valid = block();
    const invalid = block("%% caption: Caption only");
    const root = workspace({
      "src/content/concepts/a-valid.md": valid,
      "src/pages/z-invalid.md": invalid,
    });
    const render = vi.fn();
    await expect(generateDiagrams({ root, render })).rejects.toThrow("src/pages/z-invalid.md, diagram 1");
    expect(render).not.toHaveBeenCalled();
    expect(readFileSync(join(root, "src/content/concepts/a-valid.md"), "utf8")).toBe(valid);
    expect(readFileSync(join(root, "src/pages/z-invalid.md"), "utf8")).toBe(invalid);
    expect(existsSync(join(root, "public"))).toBe(false);
  });

  it("propagates renderer errors without rewriting the failed article", async () => {
    const source = block();
    const root = workspace({ "src/content/concepts/example.md": source });
    const render = vi.fn(() => { throw new Error("Renderer unavailable"); });
    await expect(generateDiagrams({ root, render })).rejects.toThrow(
      "src/content/concepts/example.md, diagram 1: rendering failed",
    );
    expect(readFileSync(join(root, "src/content/concepts/example.md"), "utf8")).toBe(source);
  });

  it("exits nonzero for invalid metadata through the actual CLI", () => {
    const root = cliFixture("%% alt: Mermaid Diagram");
    const result = spawnSync(process.execPath, ["scripts/generate-diagrams.mjs"], { cwd: root, encoding: "utf8" });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("src/content/concepts/example.md, diagram 1");
    expect(existsSync(join(root, "public"))).toBe(false);
  });

  it("exits nonzero for a failing renderer through the actual CLI", () => {
    const root = cliFixture("%% alt: Input becomes output.");
    const bin = join(root, "bin");
    mkdirSync(bin);
    writeFileSync(join(bin, "pnpm"), "#!/bin/sh\nexit 9\n");
    chmodSync(join(bin, "pnpm"), 0o755);
    const result = spawnSync(process.execPath, ["scripts/generate-diagrams.mjs"], {
      cwd: root, encoding: "utf8", env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("src/content/concepts/example.md, diagram 1: rendering failed");
    expect(readFileSync(join(root, "src/content/concepts/example.md"), "utf8"))
      .not.toContain("<figure");
  });
});
