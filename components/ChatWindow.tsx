"use client";

import { useEffect, useRef, memo } from "react";
import Message from "./Message";
import { Message as MessageType } from "@/services/chat";

interface ChatWindowProps {
  messages: MessageType[];
}

function ChatWindow({ messages }: Readonly<ChatWindowProps>) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current instanceof HTMLElement) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      messagesEndRef.current.focus();
    }
  }, [messages]);

  return (
    <div
      className="flex-1 bg-gray-50 p-4 overflow-y-auto h-full"
      role="log" 
      aria-live="polite" 
      aria-relevant="additions text"
    >
      {messages.length === 0 && (
        <p className="text-gray-400 text-center p-4" aria-live="polite">
          No messages yet.
        </p>
      )}

      <div role="log" aria-live="polite" aria-relevant="additions text">
        {messages.map((msg) => (
          <Message
            key={msg.id}
            author={msg.author}
            content={msg.content}
            isNew={msg.isNew}
          />
        ))}
      </div>

      <div ref={messagesEndRef} tabIndex={-1} aria-hidden="true" />
    </div>
  );
}

const areEqual = (prevProps: ChatWindowProps, nextProps: ChatWindowProps) => {
  return (
    JSON.stringify(prevProps.messages) === JSON.stringify(nextProps.messages)
  );
};

export default memo(ChatWindow, areEqual);
