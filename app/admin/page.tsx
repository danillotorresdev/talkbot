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
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
          >
            Go to Chat
          </button>
        </div>

        <div className="bg-yellow-100 text-yellow-700 p-3 text-center text-sm">
          This is an administrative page. Only authorized users can access it.
        </div>

        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <p className="text-center text-gray-500 mt-4">
              Loading messages...
            </p>
          ) : error ? (
            <p className="text-center text-red-500 mt-4">
              Failed to load messages
            </p>
          ) : selectedUser ? (
            <ChatWindow messages={messages} />
          ) : (
            <p className="text-center text-gray-500 mt-4">
              Select a user to view messages
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
