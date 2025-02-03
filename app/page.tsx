"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [userName, setUserName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem("chatUserName", userName);
      router.push("/chat");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg p-6 rounded-lg w-96 text-center transition-all duration-300 hover:shadow-xl">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome to TalkBot</h1>
        <p className="text-gray-500 mb-6">Enter your name to start chatting</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all duration-300"
          >
            Start Chat
          </button>
        </form>
      </div>
    </div>
  );
}
