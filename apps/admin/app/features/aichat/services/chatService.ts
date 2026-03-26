import type { ChatMessage } from "@/app/api/chat/route";

export async function sendMessage(messages: ChatMessage[]): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const { reply } = await res.json();
  return reply as string;
}
