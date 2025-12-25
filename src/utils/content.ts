import type { CollectionEntry } from "astro:content";

export const STATUS_PRIORITY = {
  Live: 0,
  Experimental: 1,
  Proposed: 2,
  Draft: 3,
  Deprecated: 4,
};

type CollectionItem = CollectionEntry<"practices" | "concepts" | "patterns">;

export function sortItemsByStatusAndDate(items: CollectionItem[]) {
  return items.sort((a, b) => {
    // 1. Sort by Status Priority
    const statusA = a.data.status;
    const statusB = b.data.status;

    const priorityA = STATUS_PRIORITY[statusA] ?? 99;
    const priorityB = STATUS_PRIORITY[statusB] ?? 99;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // 2. Sort by Date (newest first) within same status
    return b.data.lastUpdated.getTime() - a.data.lastUpdated.getTime();
  });
}
