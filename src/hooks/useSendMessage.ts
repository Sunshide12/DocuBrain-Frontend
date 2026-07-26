import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { toast } from "sonner";
import { graphqlClient } from "@/lib/graphql";
import type { GetConversationResponse, SendMessageResponse } from "@/types/conversation";

const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($conversation_id: ID!, $content: String!) {
    sendMessage(conversation_id: $conversation_id, content: $content) {
      id
      role
      content
      response_type
      metadata
      agent_key
    }
  }
`;

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      graphqlClient.request<SendMessageResponse>(SEND_MESSAGE_MUTATION, {
        conversation_id: conversationId,
        content,
      }),
    onMutate: async (newMsg: string) => {
      await queryClient.cancelQueries({ queryKey: ["conversation", conversationId] });
      const previousData = queryClient.getQueryData<GetConversationResponse>([
        "conversation",
        conversationId,
      ]);

      queryClient.setQueryData<GetConversationResponse>(
        ["conversation", conversationId],
        (old) => {
          if (!old?.conversation) return old;
          return {
            ...old,
            conversation: {
              ...old.conversation,
              messages: [
                ...old.conversation.messages,
                {
                  id: Date.now().toString(),
                  role: "user" as const,
                  content: newMsg,
                  response_type: null,
                  metadata: null,
                  agent_key: null,
                  created_at: new Date().toISOString(),
                },
              ],
            },
          };
        }
      );

      return { previousData };
    },
    onError: (_err, _newMsg, context) => {
      queryClient.setQueryData(["conversation", conversationId], context?.previousData);
      toast.error("Failed to send message");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["conversation", conversationId] });
    },
  });
}
