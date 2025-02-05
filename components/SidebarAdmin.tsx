"use client";

import { useQuery } from "@tanstack/react-query";
import LogoutButton from "@/components/LogoutButton";
import { fetchUsers } from "@/services/users";

interface SidebarAdminProps {
  onSelectUser: (userName: string) => void;
  selectedUser: string | null;
}

const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const users = await fetchUsers();
      return users;
    },
    initialData: [],
  });
};

export default function SidebarAdmin({
  onSelectUser,
  selectedUser,
}: Readonly<SidebarAdminProps>) {
  const { data: users, isLoading, isError } = useUsers();

  return (
    <aside
      className="w-80 bg-gray-900 text-white h-full flex flex-col"
      aria-label="Admin Sidebar"
    >
      <div className="p-4 border-b border-gray-700 text-lg font-bold">
        Users
      </div>

      <div className="flex flex-1 overflow-y-auto p-4">
        {isLoading && (
          <output className="text-gray-200 text-center p-4">
            Loading users...
          </output>
        )}
        {isError && (
          <output className="text-red-400 text-center p-4">
            Failed to load users
          </output>
        )}
        {!isLoading && !isError && users?.length === 0 && (
          <output className="text-gray-200 text-center p-4">
            No users found
          </output>
        )}

        {!isLoading && !isError && users?.length > 0 && (
          <select
            className="w-full bg-gray-900 text-white p-4"
            aria-label="User List"
            value={selectedUser ?? ""}
            onChange={(e) => {
              const selectedValue = e.target.value;
              onSelectUser(selectedValue);
            }}
          >
            {users.map((user: string) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="p-4 border-t border-gray-700 text-center">
        <LogoutButton aria-label="Log out of admin panel" />
      </div>
    </aside>
  );
}
