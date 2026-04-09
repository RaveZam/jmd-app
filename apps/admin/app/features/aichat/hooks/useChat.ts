"use client";

import { useState, useCallback, useRef } from "react";
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
  const accumulatorRef = useRef("");

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    accumulatorRef.current = "";

    setInput("");
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    await streamMessage([...messages, userMsg], (chunk) => {
      accumulatorRef.current += chunk;
      const accumulated = accumulatorRef.current;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return [
            ...prev.slice(0, -1),
            { role: "assistant", content: accumulated },
          ];
        }
        return [...prev, { role: "assistant", content: accumulated }];
      });
    });

    setLoading(false);
  }, [input, loading, messages]);

  return { messages, input, setInput, loading, handleSend };
}
