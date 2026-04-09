import { GoogleGenAI } from "@google/genai";
import { SupabaseClient } from "@supabase/supabase-js";
import { GeminiContent } from "./types";
import { getSystemPrompt, AgentInfo } from "./system-prompt";
import { validateSql } from "./sql-validators";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const MODEL = "gemini-2.5-flash-lite";

function extractSql(text: string): string | null {
  const match = text.match(/\[SQL\]([\s\S]*?)\[\/SQL\]/);
  return match ? match[1].trim() : null;
}

export async function handleChat(
  contents: GeminiContent[],
  supabase: SupabaseClient,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  agentMap: Record<string, AgentInfo>,
): Promise<void> {
  const systemInstruction = getSystemPrompt(agentMap);

  const firstResponse = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: { systemInstruction },
  });

  const responseText =
    firstResponse.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("") ?? "";

  const sql = extractSql(responseText);

  // No SQL — plain text response (greeting, clarification, etc.)
  if (!sql) {
    controller.enqueue(encoder.encode(responseText));
    return;
  }
  console.log(sql);
  // Validate and execute SQL
  const validationError = validateSql(sql);
  if (validationError) {
    controller.enqueue(
      encoder.encode(`I can't run that query safely: ${validationError}`),
    );
    return;
  }

  const { data, error } = await supabase.rpc("execute_readonly_query", {
    p_sql: sql,
  });

  console.log(data);
  console.log(error);

  if (error) {
    controller.enqueue(
      encoder.encode(
        "Sorry, I generated a bad query. Could you try rephrasing your question?",
      ),
    );
    return;
  }

  // Turn 2: stream Gemini's summary of the query results
  const lastUserContent = contents[contents.length - 1];
  const turn2Contents: GeminiContent[] = [
    lastUserContent,
    { role: "model", parts: [{ text: `[SQL]${sql}[/SQL]` }] },
    {
      role: "user",
      parts: [
        {
          text: `Query results: ${JSON.stringify(data)}. Summarize this for the user. Start by stating the exact date range queried. Only include what they asked for. Use plain language, no asterisks, no markdown bold.`,
        },
      ],
    },
  ];

  const summaryResponse = await ai.models.generateContentStream({
    model: MODEL,
    contents: turn2Contents,
    config: { systemInstruction },
  });

  for await (const chunk of summaryResponse) {
    const text = chunk.text;
    if (text) {
      controller.enqueue(encoder.encode(text));
    }
  }
}
