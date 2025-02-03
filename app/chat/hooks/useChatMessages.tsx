import { ChatResponse, fetchChatMessages } from "@/services/chat";
import { useQuery } from "@tanstack/react-query";

export function useChatMessages(userName: string) {
  return useQuery<ChatResponse, Error>({
    queryKey: ["chatMessages", userName],
    queryFn: () => fetchChatMessages(userName),
    enabled: !!userName,
    staleTime: 0, // Faz com que sempre faça um re-fetch nos testes
    gcTime: 0, // Garante que os dados não sejam armazenados após ficarem inativos
    retry: false, // Impede que ele tente refazer a requisição automaticamente
  });
}
