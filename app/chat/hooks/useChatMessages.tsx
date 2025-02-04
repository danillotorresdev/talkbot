import { ChatResponse, fetchChatMessages } from "@/services/chat";
import { useQuery } from "@tanstack/react-query";

export function useChatMessages(userName: string) {
  return useQuery<ChatResponse, Error>({
    queryKey: ["chatMessages", userName],
    queryFn: () => fetchChatMessages(userName),
    enabled: !!userName,
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });
}
