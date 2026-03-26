"use client";

import { useState, useRef } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const FAB_SIZE = 52;
const EDGE_MARGIN = 24;

type Pos = { x: number; y: number };

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const [snapping, setSnapping] = useState(false);
  const dragRef = useRef<{
    startMx: number;
    startMy: number;
    startBx: number;
    startBy: number;
    moved: boolean;
  } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = {
      startMx: e.clientX,
      startMy: e.clientY,
      startBx: rect.left,
      startBy: rect.top,
      moved: false,
    };
    setSnapping(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startMx;
    const dy = e.clientY - dragRef.current.startMy;
    if (!dragRef.current.moved && Math.sqrt(dx * dx + dy * dy) > 6) {
      dragRef.current.moved = true;
    }
    if (dragRef.current.moved) {
      setPos({ x: dragRef.current.startBx + dx, y: dragRef.current.startBy + dy });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current) return;
    const { moved } = dragRef.current;
    dragRef.current = null;

    if (!moved) {
      setOpen(true);
      return;
    }

    setSnapping(true);
    setPos((prev) => {
      if (!prev) return prev;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const snapX =
        prev.x + FAB_SIZE / 2 > vw / 2
          ? vw - FAB_SIZE - EDGE_MARGIN
          : EDGE_MARGIN;
      const clampedY = Math.max(EDGE_MARGIN, Math.min(vh - FAB_SIZE - EDGE_MARGIN, prev.y));
      return { x: snapX, y: clampedY };
    });
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 flex h-full w-[380px] flex-col bg-white shadow-2xl border-l border-border transition-transform duration-300 ease-in-out dark:bg-card",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3 bg-emerald-700">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-white" />
            <span className="font-semibold text-white text-sm">
              AI Assistant
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Placeholder welcome message */}
          <div className="flex items-start gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
              <Bot className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-muted px-3 py-2 text-sm text-foreground max-w-[280px]">
              Hi! I&apos;m your bakery assistant. Ask me anything about your
              sales, routes, or operations.
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="border-t p-3">
          <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2">
            <input
              type="text"
              placeholder="Ask something..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors">
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={cn(
          "fixed z-50 flex h-13 w-13 items-center justify-center rounded-full bg-emerald-700 text-white shadow-lg hover:bg-emerald-800",
          !pos && "bottom-6 right-6",
          open && "opacity-0 pointer-events-none scale-90",
        )}
        style={
          pos
            ? {
                left: pos.x,
                top: pos.y,
                bottom: "auto",
                right: "auto",
                transition: snapping
                  ? "left 0.35s cubic-bezier(0.34,1.56,0.64,1), top 0.35s cubic-bezier(0.34,1.56,0.64,1)"
                  : "none",
                cursor: dragRef.current?.moved ? "grabbing" : "grab",
              }
            : undefined
        }
        aria-label="Open AI chat"
      >
        <MessageCircle className="h-5 w-5" />
      </button>
    </>
  );
}
