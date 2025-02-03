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
    }
  }, [messages]);

  return (
    <div className="flex-1 bg-gray-50 p-4 overflow-y-auto h-full">
      {messages.length === 0 && <span>Empty</span>}
      {messages.map((msg) => (
        <Message
          key={msg.id}
          author={msg.author}
          content={msg.content}
          isNew={msg.isNew}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

const areEqual = (prevProps: ChatWindowProps, nextProps: ChatWindowProps) => {
  return JSON.stringify(prevProps.messages) === JSON.stringify(nextProps.messages);
};

export default memo(ChatWindow, areEqual);
