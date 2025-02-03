import { useRef } from "react";

interface ChatInputProps {
  sendMessage: (message: string) => void;
}

export default function ChatInput({ sendMessage }: Readonly<ChatInputProps>) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (inputRef.current?.value.trim()) {
      sendMessage(inputRef.current.value);
      inputRef.current.value = ""; // Limpa o input após enviar a mensagem
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        ref={inputRef}
        type="text"
        placeholder="Type a message..."
        className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        onKeyUp={(e) => e.key === "Enter" && handleSendMessage()}
      />
      <button
        onClick={handleSendMessage}
        className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300"
      >
        Send
      </button>
    </div>
  );
}
