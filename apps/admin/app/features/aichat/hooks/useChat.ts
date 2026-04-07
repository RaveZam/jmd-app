"use client";

import { useState, useCallback } from "react";
import type { ChatMessage } from "@/app/api/chat/route";
import { streamMessage } from "../services/chatService";

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm your bakery assistant. Ask me anything about your sales, routes, or operations.",
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const next: ChatMessage[] = [...messages, userMsg];
    const assistantMsg: ChatMessage = { role: "assistant", content: "" };

    setMessages([...next, assistantMsg]);
    setInput("");
    setLoading(true);

    await streamMessage(next, (chunk) => {
      assistantMsg.content += chunk;
      setMessages([...next, { ...assistantMsg }]);
    });

    setLoading(false);
  }, [input, loading, messages]);

  return { messages, input, setInput, loading, handleSend };
}
