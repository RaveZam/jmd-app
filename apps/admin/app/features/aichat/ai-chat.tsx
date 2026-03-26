"use client";

import { useState } from "react";
import { useChat } from "./hooks/useChat";
import { ChatDrawer } from "./components/ChatDrawer";
import { ChatFab } from "./components/ChatFab";

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const { messages, input, setInput, loading, handleSend } = useChat();

  return (
    <>
      <ChatDrawer
        open={open}
        onClose={() => setOpen(false)}
        messages={messages}
        loading={loading}
        input={input}
        onInputChange={setInput}
        onSend={handleSend}
      />
      <ChatFab open={open} onOpen={() => setOpen(true)} />
    </>
  );
}
