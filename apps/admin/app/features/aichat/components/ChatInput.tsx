import { ArrowRight } from "lucide-react";
import { GEMINI_GRADIENT } from "./GeminiIcon";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
};

export function ChatInput({ value, onChange, onSend, disabled }: Props) {
  return (
    <div className="border-t p-3">
      <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Ask something..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          onClick={onSend}
          disabled={disabled}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-white transition-opacity disabled:opacity-50"
          style={{ background: GEMINI_GRADIENT }}
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
