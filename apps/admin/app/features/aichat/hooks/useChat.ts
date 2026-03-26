"use client";

import { useState } from "react";
import type { ChatMessage } from "@/app/api/chat/route";
import { sendMessage } from "../services/chatService";

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm your bakery assistant. Ask me anything about your sales, routes, or operations.",
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    const reply = await sendMessage(next);
    setMessages([...next, { role: "assistant", content: reply }]);
    setLoading(false);
  }

  return { messages, input, setInput, loading, handleSend };
}
