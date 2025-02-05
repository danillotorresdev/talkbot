"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SidebarAdmin from "@/components/SidebarAdmin";
import ChatWindow from "@/components/ChatWindow";
import { useUserMessages } from "@/app/admin/hooks/useUserMessages";

export default function AdminPage() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const router = useRouter();

  const {
    data: messages = [],
    isLoading,
    error,
  } = useUserMessages(selectedUser ?? "");

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
        Failed to load messages
      </p>
    );
  } else if (selectedUser) {
    content = <ChatWindow messages={messages} />;
  } else {
    content = (
      <p className="text-center text-gray-500 mt-4" aria-live="polite">
        Select a user to view messages
      </p>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarAdmin
        onSelectUser={setSelectedUser}
        selectedUser={selectedUser}
      />

      <div className="flex flex-col flex-1 bg-white shadow-lg rounded-lg h-full">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {selectedUser ? `Chat with ${selectedUser}` : "Select a user"}
          </h2>

          <button
            onClick={() => router.push("/chat")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Go to user chat"
          >
            Go to Chat
          </button>
        </div>

        <div
          className="bg-yellow-100 text-yellow-700 p-3 text-center text-sm"
          aria-hidden="true"
        >
          This is an administrative page. Only authorized users can access it.
        </div>

        <div className="flex-1 overflow-hidden">{content}</div>
      </div>
    </div>
  );
}
