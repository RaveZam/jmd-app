import { GoogleGenAI } from "@google/genai";
import { SupabaseClient } from "@supabase/supabase-js";
import { GeminiContent } from "./types";
import { getSystemPrompt } from "./system-prompt";
import { toolDefinitions } from "./tools-definition";
import { handleFunctionCall } from "./function-call";
import { handleTextToSql } from "./text-to-sql";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const MODEL = "gemini-2.5-flash-lite";

async function streamTurn2(
  turn2Contents: GeminiContent[],
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
): Promise<void> {
  const response = await ai.models.generateContentStream({
    model: MODEL,
    contents: turn2Contents,
    config: { systemInstruction: getSystemPrompt() },
  });

  for await (const chunk of response) {
    const text = chunk.text;
    if (text) {
      controller.enqueue(encoder.encode(text));
    }
  }
}

export async function detectIntent(
  contents: GeminiContent[],
): Promise<{ functionCall?: Record<string, unknown>; text?: string }> {
  const firstResponse = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: {
      systemInstruction: getSystemPrompt(),
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

export async function routeIntent(
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

    console.log(turn2);

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
