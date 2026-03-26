import { X } from "lucide-react";
import { GeminiIcon, GEMINI_GRADIENT } from "./GeminiIcon";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/app/api/chat/route";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

type Props = {
  open: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  loading: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
};

export function ChatDrawer({
  open,
  onClose,
  messages,
  loading,
  input,
  onInputChange,
  onSend,
}: Props) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40" onClick={onClose} />}

      <div
        className={cn(
          "fixed top-0 right-0 z-50 flex h-full w-[380px] flex-col bg-white shadow-2xl border-l border-border transition-transform duration-300 ease-in-out dark:bg-card",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b px-4 py-3" style={{ background: GEMINI_GRADIENT }}>
          <div className="flex items-center gap-2">
            <GeminiIcon className="h-5 w-5 text-white" />
            <span className="font-semibold text-white text-sm">
              AI Assistant
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <MessageList messages={messages} loading={loading} />
        <ChatInput
          value={input}
          onChange={onInputChange}
          onSend={onSend}
          disabled={loading}
        />
      </div>
    </>
  );
}
