"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function AiChat() {
  const [open, setOpen] = useState(false);

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
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-13 w-13 items-center justify-center rounded-full bg-emerald-700 text-white shadow-lg hover:bg-emerald-800 transition-all duration-200",
          open && "opacity-0 pointer-events-none scale-90",
        )}
        aria-label="Open AI chat"
      >
        <MessageCircle className="h-5 w-5" />
      </button>
    </>
  );
}
