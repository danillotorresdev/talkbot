"use client";

import { useEffect, useState } from "react";
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
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        userName={userName}
        onSelectChat={() => setIsChatOpen(true)}
        className={isChatOpen ? "hidden md:flex" : "flex"}
      />

      <div
        className={`flex flex-col flex-1 bg-white shadow-lg rounded-lg h-full ${
          isChatOpen ? "flex" : "hidden md:flex"
        }`}
      >
        <ChatHeader onBack={() => setIsChatOpen(false)} />
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <p className="text-center text-gray-500 mt-4">
              Loading messages...
            </p>
          ) : error ? (
            <p className="text-center text-red-500 mt-4" role="alert">
              {error.message}
            </p>
          ) : sendError ? (
            <p className="text-center text-red-500 mt-4" role="alert">
              {sendError.message}
            </p>
          ) : data?.messages?.length === 0 ? (
            <p className="text-center text-gray-500 mt-4">Empty</p>
          ) : (
            <ChatWindow messages={data?.messages || []} />
          )}
        </div>

        <BotTypingIndicator isBotTyping={isFetching} />
        <div className="border-t p-3 bg-white w-full">
          <ChatInput sendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
