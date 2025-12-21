# PBI-41: MCP Netlify Configuration

> Status: Ready

## Goal
Configure Netlify to deploy the MCP server as an Edge Function at `asdlc.io/mcp`.

## Context
The MCP server runs as a Netlify Edge Function, separate from the main Astro site build. This PBI configures the deployment infrastructure so that:
- The Edge Function is deployed alongside the main site
- The `/mcp` endpoint routes to the Edge Function

No subdomain is needed — the MCP endpoint lives at the same domain as the main site.

## Spec Reference
`/docs/specs/mcp-server/spec.md` - Section: "Build Configuration"

## Requirements

### Update netlify.toml
Add Edge Function configuration to existing `netlify.toml`:

```toml
[build]
  command = "pnpm build"
  publish = "dist"

# MCP Server Edge Function
[[edge_functions]]
  path = "/mcp"
  function = "mcp"

# Include content directory in Edge Function bundle
[edge_functions.mcp]
  included_files = ["src/content/**/*.md"]
```

### Directory Structure
Ensure the following structure exists:
```
/netlify
  /edge-functions
    mcp.ts            # Created in PBI-37
```

### Environment Variables (if needed)
No environment variables required for MVP. Future considerations:
- `MCP_CACHE_TTL` — Cache duration in milliseconds
- `MCP_DEBUG` — Enable verbose logging

### Edge Function Bundle
Edge Functions automatically bundle imported files. Ensure:
- `/src/mcp/*.ts` files are importable from the edge function
- Content files are accessible via `included_files` config
- No Node.js-specific dependencies are imported

### Build Verification
The MCP server should not affect the main Astro build:
```bash
# Main build should succeed
pnpm build

# Edge functions are deployed automatically by Netlify
# No separate build step required
```

## Acceptance Criteria
- [ ] `netlify.toml` includes `[[edge_functions]]` block for `/mcp` path
- [ ] Edge function directory exists at `/netlify/edge-functions/`
- [ ] Content files are included in bundle via `included_files`
- [ ] Main site build (`pnpm build`) still succeeds
- [ ] Deploying to Netlify creates the `/mcp` endpoint
- [ ] HTTPS works on `asdlc.io/mcp` (automatic)

## Testing
**Local Testing:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run Edge Functions locally
netlify dev

# Test endpoint
curl http://localhost:8888/mcp
```

**Production Verification:**
```bash
# After deploy, verify endpoint responds
curl -X POST https://asdlc.io/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

# Verify SSE stream
curl -N https://asdlc.io/mcp
```

## Notes
- Edge Functions are deployed automatically with the main site
- No separate CI/CD configuration needed
- The `included_files` pattern ensures markdown files are bundled
- Edge Functions have a 50MB bundle size limit; content files are small

## Dependencies
- PBI-37: MCP Edge Function Entry Point (the function to deploy)
- PBI-38: MCP Protocol Handler
- PBI-39: Content Reading Utilities
- PBI-40: MCP Tool Implementations

## Blocked By
- PBI-37, PBI-38, PBI-39, PBI-40 (function must exist before deploying)

## Blocks
- None (final deployment step)

## Related
- Spec: `/docs/specs/mcp-server/spec.md`
- Netlify Edge Functions: https://docs.netlify.com/edge-functions/overview/
- Netlify CLI: https://docs.netlify.com/cli/get-started/
