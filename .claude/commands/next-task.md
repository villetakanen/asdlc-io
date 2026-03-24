---
description: "Pick the next task from the Linear backlog with the best speed/value ratio"
argument-hint: "[optional: filter or context for task selection]"
---

Pick the next task from the Linear backlog with the best speed/value ratio.

**Workflow:**

1. **Fetch backlog:** List all issues in `Backlog` state for the ASDLC team from Linear.
2. **Read comments:** For every issue returned, fetch its comments. Comments often contain context that changes priority or flags blockers (e.g., "defer this", "needs human supervision").
3. **Evaluate:** Rank issues by speed/value — consider:
   - Priority (Urgent > High > Medium > Low)
   - Estimated effort (smaller = faster value)
   - Comments that defer, block, or add context
   - Dependencies between issues
4. **Propose:** Present a ranked table with columns: Issue, Priority, Effort estimate, and Recommendation. Flag any deferred or blocked items with the reason from comments.
5. **Recommend one task** as the best pick and wait for user confirmation before starting work.

$ARGUMENTS