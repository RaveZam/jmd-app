import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { toolDefinitions } from "./tools-definition";
import { SYSTEM_PROMPT } from "./system-prompt";
import { validateSql } from "./sql-validators";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type GeminiContent = {
  role: string;
  parts: Record<string, unknown>[];
};

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const MODEL = "gemini-2.0-flash-lite";

async function handleFunctionCall(
  functionCall: { name?: string; args?: Record<string, unknown> },
  lastUserContent: GeminiContent,
  supabase: SupabaseClient,
): Promise<GeminiContent[]> {
  const { name, args } = functionCall;
  if (!name) return [];

  const { data, error } = await supabase.rpc(name, args);
  if (error) throw error;

  return [
    lastUserContent,
    { role: "model", parts: [{ functionCall }] },
    {
      role: "user",
      parts: [{ functionResponse: { name, response: { result: data } } }],
    },
  ];
}

async function handleTextToSql(
  text: string,
  lastUserContent: GeminiContent,
  supabase: SupabaseClient,
): Promise<GeminiContent[] | string> {
  let parsed: { needs_query: boolean; sql: string };

  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    parsed = JSON.parse(cleaned);
  } catch {
    return "I couldn't parse the query. Try rephrasing.";
  }

  const validationError = validateSql(parsed.sql);
  if (validationError) {
    return `I can't run that query safely: ${validationError}`;
  }

  const { data, error } = await supabase.rpc("execute_readonly_query", {
    p_sql: parsed.sql,
  });
  if (error) throw error;

  return [
    lastUserContent,
    { role: "model", parts: [{ text }] },
    {
      role: "user",
      parts: [
        {
          text: `Query results: ${JSON.stringify(data)}. Summarize this for the user. Only include what they asked for. Use plain language, no asterisks, no markdown bold.`,
        },
      ],
    },
  ];
}

async function streamTurn2(
  turn2Contents: GeminiContent[],
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
): Promise<void> {
  const response = await ai.models.generateContentStream({
    model: MODEL,
    contents: turn2Contents,
    config: { systemInstruction: SYSTEM_PROMPT },
  });

  for await (const chunk of response) {
    const text = chunk.text;
    if (text) {
      controller.enqueue(encoder.encode(text));
    }
  }
}

async function detectIntent(
  contents: GeminiContent[],
): Promise<{ functionCall?: Record<string, unknown>; text?: string }> {
  const firstResponse = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      tools: [{ functionDeclarations: toolDefinitions }],
    },
  });

  const parts = firstResponse.candidates?.[0]?.content?.parts ?? [];
  const functionCallPart = parts.find((p) => p.functionCall);
  const textPart = parts.find((p) => p.text);

  return {
    functionCall: functionCallPart?.functionCall as
      | Record<string, unknown>
      | undefined,
    text: textPart?.text ?? parts.map((p) => p.text ?? "").join(""),
  };
}

async function routeIntent(
  intent: { functionCall?: Record<string, unknown>; text?: string },
  contents: GeminiContent[],
  supabase: SupabaseClient,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
): Promise<void> {
  const lastContent = contents[contents.length - 1];

  if (intent.functionCall) {
    const turn2 = await handleFunctionCall(
      intent.functionCall as { name?: string; args?: Record<string, unknown> },
      lastContent,
      supabase,
    );
    if (turn2.length === 0) return;
    await streamTurn2(turn2, controller, encoder);
    return;
  }

  if (intent.text?.includes('"needs_query"')) {
    const result = await handleTextToSql(intent.text, lastContent, supabase);
    if (typeof result === "string") {
      controller.enqueue(encoder.encode(result));
      return;
    }
    await streamTurn2(result, controller, encoder);
    return;
  }

  controller.enqueue(encoder.encode(intent.text ?? ""));
}

export async function POST(req: NextRequest): Promise<Response> {
  const { messages }: { messages: ChatMessage[] } = await req.json();
  const [supabase] = await Promise.all([createClient()]);

  const contents: GeminiContent[] = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller): Promise<void> {
      try {
        const intent = await detectIntent(contents);
        await routeIntent(intent, contents, supabase, controller, encoder);
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
