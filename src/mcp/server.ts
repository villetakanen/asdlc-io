import type { ContentService } from "./content.ts";
import { handleToolCall, TOOLS } from "./tools.ts";

export interface JsonRpcToolCallParams {
  name: string;
  arguments?: Record<string, string>;
}

export type JsonRpcParams = JsonRpcToolCallParams | Record<string, unknown>;

export interface McpToolCallResult {
  content: { type: "text"; text: string }[];
  isError?: boolean;
}

export interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: number | string;
  method: string;
  params?: JsonRpcParams;
}

export interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: number | string | null;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export class McpServer {
  constructor(private contentService: ContentService) {}

  async handleRequest(request: JsonRpcRequest): Promise<JsonRpcResponse> {
    const { method, params, id = null } = request;

    try {
      switch (method) {
        case "initialize":
          return {
            jsonrpc: "2.0",
            id,
            result: {
              protocolVersion: "2024-11-05",
              capabilities: {
                tools: {},
              },
              serverInfo: {
                name: "asdlc-knowledge-base",
                version: "1.0.0",
              },
            },
          };

        case "notifications/initialized":
          // Just acknowledge
          return { jsonrpc: "2.0", id, result: {} };

        case "tools/list":
          return {
            jsonrpc: "2.0",
            id,
            result: {
              tools: TOOLS,
            },
          };

        case "tools/call": {
          const toolParams = params as JsonRpcToolCallParams | undefined;
          if (!toolParams?.name) {
            return this.createError(id, -32602, "Invalid params: name is required");
          }
          const result = await handleToolCall(
            toolParams.name,
            toolParams.arguments || {},
            this.contentService,
          );
          return {
            jsonrpc: "2.0",
            id,
            result,
          };
        }

        default:
          return this.createError(id, -32601, `Method not found: ${method}`);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal error";
      return this.createError(id, -32603, message);
    }
  }

  private createError(id: number | string | null, code: number, message: string): JsonRpcResponse {
    return {
      jsonrpc: "2.0",
      id,
      error: {
        code,
        message,
      },
    };
  }
}
