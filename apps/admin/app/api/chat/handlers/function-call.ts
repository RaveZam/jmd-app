import { SupabaseClient } from "@supabase/supabase-js";
import { GeminiContent } from "./types";

export async function handleFunctionCall(
  functionCall: { name?: string; args?: Record<string, unknown> },
  lastUserContent: GeminiContent,
  supabase: SupabaseClient,
): Promise<GeminiContent[]> {
  const { name, args } = functionCall;

  console.log(functionCall);

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
