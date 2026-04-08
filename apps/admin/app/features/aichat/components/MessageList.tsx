import { GeminiIcon, GEMINI_GRADIENT } from "./GeminiIcon";
import type { ChatMessage } from "@/app/api/chat/route";

type Props = {
  messages: ChatMessage[];
  loading: boolean;
};

export function MessageList({ messages, loading }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg, i) =>
        msg.role === "assistant" ? (
          <div key={i} className="flex items-start gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: GEMINI_GRADIENT }}>
              <GeminiIcon className="h-4 w-4 text-white" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-muted px-3 py-2 text-sm text-foreground max-w-[280px]">
              {msg.content}
            </div>
          </div>
        ) : (
          <div key={i} className="flex justify-end">
            <div className="rounded-2xl rounded-tr-sm px-3 py-2 text-sm text-white max-w-[280px]" style={{ background: GEMINI_GRADIENT }}>
              {msg.content}
            </div>
          </div>
        ),
      )}
      {loading && messages[messages.length - 1]?.role !== "assistant" && (
        <div className="flex items-start gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: GEMINI_GRADIENT }}>
            <GeminiIcon className="h-4 w-4 text-white" />
          </div>
          <div className="rounded-2xl rounded-tl-sm bg-muted px-3 py-2 text-sm text-muted-foreground">
            Thinking...
          </div>
        </div>
      )}
    </div>
  );
}
