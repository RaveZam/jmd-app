import { cn } from "@/lib/utils";
import { useDraggableFab } from "../hooks/useDraggableFab";
import { GeminiIcon, GEMINI_GRADIENT } from "./GeminiIcon";

type Props = {
  open: boolean;
  onOpen: () => void;
};

export function ChatFab({ open, onOpen }: Props) {
  const { pos, snapping, dragRef, handlePointerDown, handlePointerMove, handlePointerUp } =
    useDraggableFab(onOpen);

  return (
    <button
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={cn(
        "fixed z-50 flex h-13 w-13 items-center justify-center rounded-full text-white shadow-lg",
        !pos && "bottom-6 right-6",
        open && "opacity-0 pointer-events-none",
      )}
      style={{
        background: GEMINI_GRADIENT,
        transition: snapping
          ? "left 0.35s cubic-bezier(0.34,1.56,0.64,1), top 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s 0.15s"
          : "opacity 0.2s 0.15s",
        ...(pos
          ? {
              left: pos.x,
              top: pos.y,
              bottom: "auto",
              right: "auto",
              cursor: dragRef.current?.moved ? "grabbing" : "grab",
            }
          : {}),
      }}
      aria-label="Open AI chat"
    >
      <GeminiIcon className="h-7 w-7" />
    </button>
  );
}
