import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { type GscRow, gscRowSchema } from "./schema";

const SNAPSHOT_DIR = "data/gsc";
const CONTENT_ROOT = "src/content";
const SNAPSHOT_FILE = /^(\d{4}-\d{2}-\d{2})\.jsonl$/;

export function getLatestSnapshot(dir: string = SNAPSHOT_DIR): { path: string; date: string } {
  const dates = existsSync(dir)
    ? readdirSync(dir)
        .map((file) => SNAPSHOT_FILE.exec(file)?.[1])
        .filter((date): date is string => date !== undefined)
        .sort()
    : [];
  const latest = dates.at(-1);
  if (latest === undefined) {
    throw new Error(`No GSC snapshot found in ${dir}`);
  }
  return { path: path.join(dir, `${latest}.jsonl`), date: latest };
}

export function loadSnapshot(snapshotPath: string): GscRow[] {
  const lines = readFileSync(snapshotPath, "utf8").split("\n");
  const rows: GscRow[] = [];
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      return;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      throw new Error(`${snapshotPath}:${index + 1} is not valid JSON`);
    }
    rows.push(gscRowSchema.parse(parsed));
  });
  return rows;
}

export function joinPageToArticle(page: string, contentRoot: string = CONTENT_ROOT): string | null {
  let pathname: string;
  try {
    pathname = new URL(page).pathname;
  } catch {
    return null;
  }
  const segments = pathname.split("/").filter((segment) => segment.length > 0);
  if (segments.length < 2) {
    return null;
  }
  const candidate = path.join(contentRoot, `${segments.join("/")}.md`);
  return existsSync(candidate) ? candidate : null;
}
