"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem("chatUserName", userName);
      setIsSubmitting(true);
      setTimeout(() => router.push("/chat"), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg p-6 rounded-lg w-96 text-center transition-all duration-300 hover:shadow-xl">
        <h1 id="auth-title" className="text-3xl font-bold text-blue-600 mb-4">
          Welcome to TalkBot
        </h1>
        <h2 className="text-gray-500 mb-6">Enter your name to start chatting</h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          aria-labelledby="auth-title"
        >
          <label htmlFor="username" className="sr-only">
            Your Name
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            aria-label="Enter your name"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all duration-300 
                     focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Start Chat"}
          </button>
        </form>
      </div>
    </div>
  );
}
