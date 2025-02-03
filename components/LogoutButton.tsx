"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("chatUserName");
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all w-full"
    >
      Logout
    </button>
  );
}
