"use client";

import { useState, useEffect } from "react";
import LogoutButton from "@/components/LogoutButton";

interface SidebarAdminProps {
  onSelectUser: (userName: string) => void;
  selectedUser: string | null;
}

export default function SidebarAdmin({ onSelectUser, selectedUser }: SidebarAdminProps) {
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setUsers(data);
        }
      })
      .catch(() => setUsers([]));
  }, []);

  return (
    <aside className="w-80 bg-gray-900 text-white h-full flex flex-col">
      <div className="p-4 border-b border-gray-700 text-lg font-bold">Users</div>

      <div className="flex flex-col flex-1 overflow-y-auto">
        {users.length === 0 ? (
          <p className="text-gray-400 text-center p-4">No users found</p>
        ) : (
          users.map((user) => (
            <button
              key={user}
              onClick={() => onSelectUser(user)}
              className={`p-4 text-left w-full hover:bg-gray-800 ${
                selectedUser === user ? "bg-gray-700" : ""
              }`}
            >
              {user}
            </button>
          ))
        )}
      </div>

      {/* Botão de Logout fixado no rodapé */}
      <div className="p-4 border-t border-gray-700 text-center">
        <LogoutButton />
      </div>
    </aside>
  );
}
