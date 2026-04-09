import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getAgentMap } from "@/app/server/getAgentMap";
import { ChatMessage, GeminiContent } from "./handlers/types";
import { handleChat } from "./handlers/intent";

export type { ChatMessage };

/** Extract a short topic hint from a model response (no actual data values). */
function summarizeTopic(content: string): string {
  // Take first 80 chars, strip numbers/currency to avoid leaking data
  const stripped = content
    .replace(/[₱$,.\d]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.slice(0, 80) || "previous query";
}

export async function POST(req: NextRequest): Promise<Response> {
  const { messages }: { messages: ChatMessage[] } = await req.json();
  const [supabase, agentMap] = await Promise.all([
    createClient(),
    getAgentMap(),
  ]);

  const recent = messages.slice(-4);
  const contents: GeminiContent[] = recent.map((m, i) => {
    const isModel = m.role === "assistant";
    const isLast = i === recent.length - 1;
    // Strip data from older model responses so Gemini can't reuse them
    // and is forced to generate fresh SQL for follow-ups.
    // Keep only the topic context (e.g. "answered about Santos Mini-Mart sales").
    const text =
      isModel && !isLast
        ? `[Previous answer was generated from a SQL query about: ${summarizeTopic(m.content)}. Do NOT reuse this data — generate a new SQL query for any follow-up.]`
        : m.content;
    return { role: isModel ? "model" : "user", parts: [{ text }] };
  });


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
