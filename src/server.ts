import handler from "@tanstack/react-start/server-entry";
import type { getRouter } from "./router";
import { rpcHandler } from "./server/rpc-handler";

export interface CloudflareRequestContext {
  cloudflare: {
    env: Env;
    ctx: ExecutionContext;
  };
}

declare module "@tanstack/react-start" {
  interface Register {
    ssr: true;
    router: ReturnType<typeof getRouter>;
    server: {
      requestContext: CloudflareRequestContext;
    };
  }
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    // Handle API routes
    if (url.pathname.startsWith("/api")) {
      // Health check endpoint
      if (url.pathname === "/api/health") {
        return new Response(
          JSON.stringify({
            status: "ok",
            timestamp: new Date().toISOString(),
            version: "1.0.0",
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      // Handle RPC requests
      if (url.pathname.startsWith("/api/rpc")) {
        return rpcHandler(request);
      }

      // Handle Auth requests
      if (url.pathname.startsWith("/api/auth")) {
        const { auth } = await import("./server/auth");
        return auth.handler(request);
      }
    }

    return handler.fetch(request, {
      context: {
        cloudflare: { env, ctx },
      },
    } as Parameters<typeof handler.fetch>[1]);
  },
};
