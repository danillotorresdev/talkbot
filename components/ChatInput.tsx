import { useRef, useState } from "react";

interface ChatInputProps {
  sendMessage: (message: string) => void;
}

export default function ChatInput({ sendMessage }: Readonly<ChatInputProps>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [messageSent, setMessageSent] = useState(false);

  const handleSendMessage = () => {
    if (inputRef.current?.value.trim()) {
      sendMessage(inputRef.current.value);
      inputRef.current.value = "";
      inputRef.current.focus();
      setMessageSent(true);
      setTimeout(() => setMessageSent(false), 2000);
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
        aria-label="Type your message here"
      />
      <button
        onClick={handleSendMessage}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleSendMessage();
        }}
        className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 
                   focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
        aria-label="Send message"
      >
        Send
      </button>

      {messageSent && (
        <span className="sr-only" aria-live="assertive">
          Message sent
        </span>
      )}
    </div>
  );
}
