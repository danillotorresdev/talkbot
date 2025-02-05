export interface Message {
  id?: string;
  chatId?: string;
  author: string;
  content: string;
  timestamp?: Date;
  isNew?: boolean;
}

export interface ChatResponse {
  messages: Message[];
  error?: string;
}

export async function fetchChatMessages(
  userName: string
): Promise<ChatResponse> {
  const response = await fetch(`/api/chat?userName=${userName}`);

  if (!response.ok) {
    const errorResponse = await response.json().catch(() => null);
    throw new Error(errorResponse?.error || "Failed to fetch chat messages");
  }

  const data = await response.json();
  console.log("API Response:", data); 
  return data;
}

export async function postChatMessage({
  userName,
  message,
}: {
  userName: string;
  message: string;
}): Promise<Message> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName, message }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  const data: Message = await response.json();

  return {
    id: data.id ?? Math.random().toString(), // Garante um ID válido
    chatId: data.chatId ?? "temp",
    author: data.author,
    content: data.content,
    timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
  };
}
