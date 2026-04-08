export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type GeminiContent = {
  role: string;
  parts: Record<string, unknown>[];
};
