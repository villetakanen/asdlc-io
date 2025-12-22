import type { ContentService } from "./content";
import { handleToolCall, TOOLS } from "./tools";

export interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: number | string;
  method: string;
  params?: any;
}

export interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: number | string | null;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
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
          if (!params || !params.name) {
            return this.createError(id, -32602, "Invalid params: name is required");
          }
          const result = await handleToolCall(
            params.name,
            params.arguments || {},
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
    } catch (error: any) {
      return this.createError(id, -32603, error.message || "Internal error");
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
