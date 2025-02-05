"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import BotTypingIndicator from "@/components/BotTypingIndicator";
import Sidebar from "@/components/Sidebar";
import ChatHeader from "@/components/ChatHeader";
import { useChatMessages } from "@/app/chat/hooks/useChatMessages";
import { useSendMessage } from "@/app/chat/hooks/useSendMessages";

export default function ChatPage() {
  const [userName, setUserName] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();
  const liveRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem("chatUserName");
    if (!storedUserName) {
      router.push("/");
      return;
    }
    setUserName(storedUserName);
  }, [router]);

  const { data, isLoading, isFetching, error } = useChatMessages(userName);
  const { mutate: sendMessage, error: sendError } = useSendMessage(userName);

  const handleSendMessage = (message: string) => {
    sendMessage({ message });

    if (liveRegionRef.current) {
      liveRegionRef.current.innerText = ""; 
      setTimeout(() => {
        liveRegionRef.current!.innerText = `Sent: ${message}`;
      }, 100);
    }
  };

  const messages = useMemo(() => data?.messages ?? [], [data]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      if (liveRegionRef.current) {
        liveRegionRef.current.innerText = "";

        setTimeout(() => {
          liveRegionRef.current!.innerText =
            lastMessage.author === "bot"
              ? `Bot says: ${lastMessage.content}`
              : `Sent: ${lastMessage.content}`;
        }, 100);
      }
    }
  }, [messages]);

  let content;

  if (isLoading) {
    content = (
      <p className="text-center text-gray-500 mt-4" aria-live="polite">
        Loading messages...
      </p>
    );
  } else if (error) {
    content = (
      <p className="text-center text-red-500 mt-4" role="alert">
        {error.message}
      </p>
    );
  } else if (sendError) {
    content = (
      <p className="text-center text-red-500 mt-4" role="alert">
        {sendError.message}
      </p>
    );
  } else if (data?.messages?.length === 0) {
    content = (
      <p className="text-center text-gray-500 mt-4" aria-live="polite">
        No messages yet.
      </p>
    );
  } else {
    content = <ChatWindow messages={data?.messages || []} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        userName={userName}
        onSelectChat={() => setIsChatOpen(true)}
        className={isChatOpen ? "hidden md:flex" : "flex"}
        aria-hidden={isChatOpen}
      />

      <div
        className={`flex flex-col flex-1 bg-white shadow-lg rounded-lg h-full ${
          isChatOpen ? "flex" : "hidden md:flex"
        }`}
        aria-expanded={isChatOpen}
      >
        <ChatHeader onBack={() => setIsChatOpen(false)} />

        <div
          ref={liveRegionRef}
          aria-live="assertive"
          aria-atomic="true"
          style={{
            position: "absolute",
            left: "-9999px",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }}
        ></div>

        <div className="flex-1 overflow-hidden">{content}</div>
        <BotTypingIndicator isBotTyping={isFetching} />
        <div className="border-t p-3 bg-white w-full">
          <ChatInput sendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
