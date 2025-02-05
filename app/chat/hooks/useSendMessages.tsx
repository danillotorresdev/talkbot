import { Message, postChatMessage } from "@/services/chat";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSendMessage(userName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ message }: { message: string }) =>
      postChatMessage({ userName, message }),

    onMutate: async ({ message }) => {
      await queryClient.cancelQueries({ queryKey: ["chatMessages", userName] });

      const previousMessages =
        queryClient.getQueryData<{ messages: Message[] }>([
          "chatMessages",
          userName,
        ]) ?? { messages: [] };

      if (!Array.isArray(previousMessages.messages)) {
        console.error("Invalid previousMessages structure:", previousMessages);
        return { previousMessages: { messages: [] } };
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

      return { previousMessages };
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
