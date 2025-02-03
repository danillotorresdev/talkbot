import { Message, postChatMessage } from "@/services/chat";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSendMessage(userName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ message }: { message: string }) =>
      postChatMessage({ userName, message }),

    onMutate: async ({ message }) => {
      await queryClient.cancelQueries({ queryKey: ["chatMessages", userName] });

      let previousMessages = queryClient.getQueryData<{ messages: Message[] }>([
        "chatMessages",
        userName,
      ]);

      if (!previousMessages) {
        previousMessages = { messages: [] }; // 🚨 Garante que previousMessages sempre tem um array
      }

      queryClient.setQueryData(["chatMessages", userName], {
        messages: [
          ...previousMessages.messages,
          {
            id: Math.random().toString(),
            chatId: "temp",
            author: userName,
            content: message,
            timestamp: new Date(),
            isNew: true,
          },
        ],
      });

      return { previousMessages }; // Retorna previousMessages corretamente
    },

    onError: (_err, _variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["chatMessages", userName],
          context.previousMessages
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chatMessages", userName] });
    },
  });
}
