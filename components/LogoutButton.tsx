"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("chatUserName");
    router.replace("/");
  };

  return (
    <button
      onClick={handleLogout}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleLogout();
        }
      }}
      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all w-full 
                 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
      aria-label="Log out"
    >
      Logout
    </button>
  );
}
