import { z } from "astro:content";

export const clientInstallSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  label: z.string(),
  lang: z.enum(["bash", "json", "toml", "yaml"]),
  code: z.string(),
  configPath: z.string().optional(),
  instruction: z.string().optional(),
  docsHref: z.string().url().optional(),
});

export type ClientInstall = z.infer<typeof clientInstallSchema>;

// Confirmed: matches the install line previously rendered on the homepage.
const claudeCode: ClientInstall = {
  slug: "claude-code",
  label: "Claude Code",
  lang: "bash",
  code: "claude mcp add --transport http asdlc https://asdlc.io/mcp",
  docsHref: "https://docs.anthropic.com/claude/docs/claude-code/mcp",
};

// TODO: verify exact schema against current upstream docs before final merge.
const opencode: ClientInstall = {
  slug: "opencode",
  label: "OpenCode",
  lang: "json",
  configPath: "~/.config/opencode/opencode.json",
  instruction: "Add this entry under `mcp`:",
  code: `{
  "mcp": {
    "asdlc": {
      "type": "remote",
      "url": "https://asdlc.io/mcp"
    }
  }
}`,
  docsHref: "https://opencode.ai/docs/mcp",
};

// TODO: verify exact schema against current upstream docs before final merge.
const vscode: ClientInstall = {
  slug: "vscode",
  label: "VS Code",
  lang: "json",
  configPath: "settings.json (user or workspace)",
  instruction: "Add to your settings.json:",
  code: `{
  "chat.mcp.servers": {
    "asdlc": {
      "type": "http",
      "url": "https://asdlc.io/mcp"
    }
  }
}`,
  docsHref: "https://code.visualstudio.com/docs/copilot/chat/mcp-servers",
};

// TODO: verify exact schema against current upstream docs before final merge.
const zed: ClientInstall = {
  slug: "zed",
  label: "Zed",
  lang: "json",
  configPath: "~/.config/zed/settings.json",
  instruction: "Add to your Zed settings:",
  code: `{
  "context_servers": {
    "asdlc": {
      "source": "custom",
      "url": "https://asdlc.io/mcp"
    }
  }
}`,
  docsHref: "https://zed.dev/docs/assistant/model-context-protocol",
};

// TODO: verify exact schema against current upstream docs before final merge.
const antigravity: ClientInstall = {
  slug: "antigravity",
  label: "Antigravity",
  lang: "json",
  configPath: ".agents/mcp.json",
  instruction: "Add to your project's MCP config:",
  code: `{
  "servers": {
    "asdlc": {
      "transport": "http",
      "url": "https://asdlc.io/mcp"
    }
  }
}`,
  docsHref: "https://antigravity.google/docs/agents/mcp",
};

export const mcpClients: ClientInstall[] = [claudeCode, opencode, vscode, zed, antigravity].map(
  (entry) => clientInstallSchema.parse(entry),
);
