import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getAgentMap } from "@/app/server/getAgentMap";
import { ChatMessage, GeminiContent } from "./handlers/types";
import { handleChat } from "./handlers/intent";

export type { ChatMessage };

export async function POST(req: NextRequest): Promise<Response> {
  const { messages }: { messages: ChatMessage[] } = await req.json();
  const [supabase, agentMap] = await Promise.all([
    createClient(),
    getAgentMap(),
  ]);

  const contents: GeminiContent[] = messages.slice(-4).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller): Promise<void> {
      try {
        await handleChat(contents, supabase, controller, encoder, agentMap);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[chat route]", message, err);
        controller.enqueue(encoder.encode(`Something went wrong: ${message}`));
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
