#!/usr/bin/env node
/**
 * GSC snapshot pipeline — writes a dated JSONL of search-analytics rows to data/gsc/.
 * See specs/gsc-integration/spec.md.
 *
 * Auth: Application Default Credentials via the gcloud CLI (the property owner's
 * own credentials), NOT a service-account key. This deviates from the spec's
 * GSC_SERVICE_ACCOUNT_KEY design — see the AL-40 issue note for rationale.
 *
 * Run via: pnpm gsc:snapshot
 */

import { execFileSync } from "node:child_process";
import {
  DIMENSIONS,
  PAGE_SIZE,
  type QueryPage,
  resolveConfig,
  runSnapshot,
  type SearchAnalyticsRow,
} from "../tools/gsc/snapshot.ts";

function fail(message: string): never {
  console.error(`gsc:snapshot — ${message}`);
  process.exit(1);
}

function gcloud(args: string[]): string {
  try {
    return execFileSync("gcloud", args, { encoding: "utf8" }).trim();
  } catch {
    fail(
      `failed to run "gcloud ${args.join(" ")}". Install the gcloud CLI and run ` +
        "`gcloud auth application-default login --scopes=https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/webmasters.readonly`",
    );
  }
}

const config = (() => {
  try {
    return resolveConfig(process.env);
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
})();

const token = gcloud(["auth", "application-default", "print-access-token"]);
const quotaProject = config.quotaProject ?? gcloud(["config", "get-value", "project"]);
if (!quotaProject) {
  fail("no quota project; set GSC_QUOTA_PROJECT or `gcloud config set project <id>`");
}

const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
  config.siteUrl,
)}/searchAnalytics/query`;

const queryPage: QueryPage = async ({ startDate, endDate, startRow, rowLimit }) => {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "x-goog-user-project": quotaProject,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ startDate, endDate, dimensions: DIMENSIONS, rowLimit, startRow }),
  });
  if (!res.ok) {
    throw new Error(`GSC API ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { rows?: SearchAnalyticsRow[] };
  return data.rows ?? [];
};

try {
  const { path, rowCount } = await runSnapshot({ queryPage, pageSize: PAGE_SIZE });
  console.log(`gsc:snapshot — wrote ${rowCount} rows to ${path}`);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
