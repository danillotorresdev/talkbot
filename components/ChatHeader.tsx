"use client";

import { useRouter } from "next/navigation";

interface ChatHeaderProps {
  onBack?: () => void;
}

export default function ChatHeader({ onBack }: Readonly<ChatHeaderProps>) {
  const router = useRouter();

  return (
    <div className="p-4 border-b flex items-center justify-between bg-white">
      {onBack && (
        <button
          onClick={onBack}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onBack();
          }}
          className="mr-4 text-gray-600 hover:text-gray-900 lg:hidden focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label="Go back"
        >
          ← Back
        </button>
      )}

      <nav className="flex items-center space-x-6">
        <button
          onClick={() => router.push("/admin")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") router.push("/admin");
          }}
          className="text-gray-700 font-medium px-3 py-2 rounded transition-all hover:bg-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label="Go to Admin Panel"
        >
          Admin Panel
        </button>
      </nav>
    </div>
  );
}
