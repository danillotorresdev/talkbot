import { useQuery } from "@tanstack/react-query";
import { fetchUserMessages } from "@/services/admin";
import { Message } from "@prisma/client";

export function useUserMessages(userName: string) {
  return useQuery<Message[], Error>({
    queryKey: ["userMessages", userName],
    queryFn: () => fetchUserMessages(userName),
    enabled: Boolean(userName),
    staleTime: 1000 * 60 * 5,
    retry: 0, 
  });
}
