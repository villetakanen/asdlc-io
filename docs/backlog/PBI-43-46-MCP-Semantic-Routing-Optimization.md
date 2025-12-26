# PBI-43-46: MCP Tool Semantic Routing Optimization

> Status: Done

## Goal
Optimize MCP tool definitions for improved LLM semantic routing by enriching descriptions with domain-specific keywords and usage constraints, increasing knowledge base hit rate by an estimated 40-60% for ASDLC-related queries.

## Context

### Problem Statement
When users ask domain-specific questions like "What is vibe coding?" or "How do I use Agent Directives?", the LLM fails to trigger the knowledge base search tool because the current generic descriptions don't semantically match these queries. This results in:
- Generic hallucinated responses instead of authoritative ASDLC content
- Poor discoverability of Concepts and Patterns
- User trust erosion when generic advice contradicts documentation

### Root Cause
Current tool descriptions are semantically impoverished:
- No domain-specific keywords (Agent Directives, Schema-First Development, etc.)
- No ASDLC acronym expansion
- Missing usage constraints that prevent anti-patterns (slug guessing)

### Solution
Apply prompt engineering to MCP tool JSON schemas by enriching metadata with:
- Domain keywords that users are likely to ask about
- Explicit usage constraints and examples
- Acronym expansions and collection scope clarity

**Important:** This is metadata-only optimization - no changes to handler logic or content service.

## Spec Reference
`/docs/specs/mcp-server/semantic-routing-optimization.md`

## Sub-Tasks

This initiative is broken into four atomic PBIs for incremental delivery:

### [x] PBI-43: Rename search_articles to search_knowledge_base
**Goal:** Improve semantic signal through better tool naming

**Changes:**
- Rename tool from `search_articles` to `search_knowledge_base`
- Update case label in handler function

**Acceptance:** Tool rename complete, tests pass, old name returns error

### [x] PBI-44: Enrich search_knowledge_base Description
**Goal:** Add domain keywords for improved routing accuracy (core value delivery)

**Changes:**
- Add ASDLC expansion and domain keywords (Agent Directives, Determinism over Vibes, etc.)
- Add collection scope (Concepts, Patterns)
- Add concrete examples to query parameter

**Acceptance:** Description includes all semantic anchors, MCP Inspector shows enriched metadata

### [x] PBI-45: Add Usage Constraints to get_article
**Goal:** Prevent LLM anti-pattern of guessing slugs

**Changes:**
- Add "ONLY after search" constraint
- Add "Do not guess slug names" warning
- Add slug format examples

**Acceptance:** Description includes constraints, LLM performs search-first flow

### [x] PBI-46: Enrich list_articles Description
**Goal:** Complete optimization across all tools for consistency

**Changes:**
- Add ASDLC expansion
- Clarify returned metadata fields
- Add use case guidance (browsing, overview)

**Acceptance:** Description enriched, consistent with other tools

## Implementation Order

**Must be executed in sequence:**

1. **PBI-43** (Rename) - Foundation for description enrichment
2. **PBI-44** (Search enrichment) - Core business value
3. **PBI-45** (Get constraints) - Anti-pattern prevention
4. **PBI-46** (List enrichment) - Consistency completion

**Rationale:** PBI-43 must complete first to establish the new tool name that PBI-44 builds upon. PBI-44 and PBI-45 can technically run in parallel but sequencing them ensures focused testing. PBI-46 is lowest priority and can be deferred if needed.

## Acceptance Criteria

### Functional Requirements
- [ ] All three tools have enriched descriptions with domain keywords
- [ ] Tool `search_knowledge_base` includes: ASDLC expansion, Agent Directives, Determinism over Vibes, Schema-First Development, Type Safety, Conventional Commits
- [ ] Tool `get_article` includes: search-first constraint, no-guessing warning
- [ ] Tool `list_articles` includes: ASDLC expansion, use case guidance
- [ ] Old tool name `search_articles` returns "Unknown tool" error

### Verification Tests
- [ ] **Positive Test (Specific):** "How do I stop vibe coding?" triggers `search_knowledge_base`
- [ ] **Positive Test (Acronym):** "What is the ASDLC approach to linting?" triggers `search_knowledge_base`
- [ ] **Negative Test:** "What is the weather?" does NOT trigger any tools
- [ ] **Error Handling:** LLM performs search before calling `get_article` (3 test sessions)
- [ ] **MCP Inspector:** All tools show new descriptions in "Tools" tab

### Regression Guardrails
- [ ] All existing unit tests pass
- [ ] Tool handler logic unchanged (metadata-only changes)
- [ ] Response times remain < 500ms
- [ ] Content filtering unchanged (Live/Experimental only)
- [ ] No changes to content service or protocol handler

## Testing Strategy

### Unit Tests
Each PBI includes specific unit tests. Comprehensive suite covers:
- Tool discovery via `tools/list`
- Description content verification (keyword presence)
- Backward incompatibility (old tool name)
- Response format consistency

### Integration Tests
- Full JSON-RPC request/response cycle
- Tool call routing with enriched descriptions
- MCP Inspector connection and tool enumeration

### User Acceptance Tests
**Setup:** Configure Claude Desktop with dev MCP server

**Test Cases:**
1. Ask: "What is vibe coding?" → Expect: `search_knowledge_base` call
2. Ask: "How do I use Agent Directives?" → Expect: `search_knowledge_base` call
3. Ask: "Show me the context engineering article" → Expect: Search-first flow (search, then get)
4. Ask: "What is the weather?" → Expect: No tool calls
5. Ask: "What is ASDLC?" → Expect: `search_knowledge_base` call

**Success Criteria:** 5/5 tests route correctly

## Rollout Plan

### Phase 1: Development (PBI-43, PBI-44)
- Implement rename and core search enrichment
- Run unit tests, verify with MCP Inspector
- Gate: Tests pass, descriptions visible in inspector

### Phase 2: Anti-Pattern Prevention (PBI-45)
- Add get_article constraints
- Test search-first flow with Claude Desktop
- Gate: No slug guessing observed in 3 test sessions

### Phase 3: Completion (PBI-46)
- Enrich list_articles for consistency
- Final verification with all tools
- Gate: All acceptance criteria met

### Phase 4: Production Deployment
- Merge to main, deploy via Netlify
- Monitor error rates (expect increase in "Unknown tool" for legacy clients)
- Document breaking change in release notes

### Rollback Plan
- If routing accuracy degrades: Revert commit
- If performance regresses: Investigate (unexpected - metadata-only)
- If legacy client breakage is severe: Add deprecation warning period

## Performance Impact
**Expected:** None (metadata-only changes)

**Verification:**
- Measure tool call latency pre/post deployment
- Confirm < 500ms response times maintained
- Monitor edge function execution time

## Breaking Changes

**Change:** Tool `search_articles` renamed to `search_knowledge_base`

**Impact:** Clients using old tool name will receive "Unknown tool" error

**Mitigation:**
- Document in release notes
- Provide migration guide for MCP client configurations
- Consider adding deprecation warning in future (out of scope for this PBI)

## Business Value

### Quantitative
- **40-60% improvement** in knowledge base hit rate for domain queries (estimated)
- Reduced hallucination rate for ASDLC-specific questions
- Increased content discoverability (Concepts, Patterns)

### Qualitative
- Improved user trust (answers grounded in documentation)
- Better LLM guidance (clear tool usage patterns)
- Foundation for future semantic routing optimizations

## Resources

- **Specification:** `/docs/specs/mcp-server/semantic-routing-optimization.md`
- **Original Proposal:** See incoming PBI proposal document
- **MCP Spec:** https://modelcontextprotocol.io/specification
- **Anthropic Tool Use Guide:** https://docs.anthropic.com/en/docs/build-with-claude/tool-use

## Related Work

- **Current Implementation:** PBI-37-41 (MCP Server MVP)
- **Future Work:** Consider adding more specific tools (e.g., `search_by_tag`, `get_related_articles`)
- **Pattern:** This optimization technique can be applied to other MCP servers

## Notes

- This is a **prompt engineering optimization**, not a code logic change
- The same technique can be applied to other MCP tools in the future
- Consider documenting this as a Pattern in the ASDLC knowledge base (meta!)
- Monitor LLM model updates - semantic routing behavior may change with new models
