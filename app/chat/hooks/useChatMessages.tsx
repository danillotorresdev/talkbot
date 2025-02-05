import { ChatResponse, fetchChatMessages } from "@/services/chat";
import { useQuery } from "@tanstack/react-query";

export function useChatMessages(userName: string) {
  const query = useQuery<ChatResponse, Error>({
    queryKey: ["chatMessages", userName],
    queryFn: () => fetchChatMessages(userName),
    enabled: !!userName,
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });

  return query;
}
