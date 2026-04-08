import { SupabaseClient } from "@supabase/supabase-js";
import { GeminiContent } from "./types";
import { validateSql } from "./sql-validators";

export async function handleTextToSql(
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
