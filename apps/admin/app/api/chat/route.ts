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

  // Only keep user messages in history — drop model responses so Gemini
  // can't parrot back previous data and is forced to generate fresh SQL.
  // Insert short model acknowledgments between them to satisfy alternating role requirement.
  const userMessages = messages
    .filter((m) => m.role === "user")
    .slice(-3);
  const contents: GeminiContent[] = [];
  for (let i = 0; i < userMessages.length; i++) {
    if (i > 0) {
      contents.push({ role: "model", parts: [{ text: "Understood." }] });
    }
    contents.push({ role: "user", parts: [{ text: userMessages[i].content }] });
  }


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
