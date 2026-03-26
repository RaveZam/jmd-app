import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  const { messages }: { messages: ChatMessage[] } = await req.json();

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents,
  });

  return NextResponse.json({ reply: response.text });
}
