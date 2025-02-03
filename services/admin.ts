import { Message } from "@prisma/client";

export async function fetchUserMessages(userName: string): Promise<Message[]> {
  const response = await fetch(`/api/admin/messages?userName=${userName}`);

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  const data: Message[] = await response.json();
  return data;
}
