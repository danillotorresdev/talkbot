import LogoutButton from "@/components/LogoutButton";

interface SidebarProps {
  onSelectChat: () => void;
  userName: string;
  className?: string;
}

export default function Sidebar({
  onSelectChat,
  userName,
  className,
}: Readonly<SidebarProps>) {
  return (
    <aside
      className={`w-80 bg-gray-900 text-white h-full flex flex-col ${className}`}
      aria-label="Sidebar Navigation"
    >
      <div className="p-4 border-b border-gray-700 text-lg font-bold flex justify-between items-center">
        <span aria-label="Logged in user">
          👤 <strong>{userName}</strong>
        </span>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto">
        <button
          className="flex items-center gap-3 p-4 hover:bg-gray-800 cursor-pointer"
          onClick={onSelectChat}
          aria-label="Open Chat Bot"
        >
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold">
            🤖
          </div>
          <div>
            <p className="font-medium">Chat Bot</p>
            <span className="text-gray-400 text-sm">Online</span>
          </div>
        </button>
      </div>

      <div className="p-4 border-t border-gray-700 text-center">
        <LogoutButton />
      </div>
    </aside>
  );
}
