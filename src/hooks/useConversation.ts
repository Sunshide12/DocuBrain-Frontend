import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { graphqlClient } from "@/lib/graphql";
import type { GetConversationResponse } from "@/types/conversation";

export const CONVERSATION_QUERY = gql`
  query GetConversation($id: ID!) {
    conversation(id: $id) {
      id
      title
      agent_type
      document {
        id
        title
        file_path
      }
      messages {
        id
        role
        content
        response_type
        metadata
        agent_key
        created_at
      }
    }
  }
`;

export function useConversation(conversationId: string) {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () =>
      graphqlClient.request<GetConversationResponse>(CONVERSATION_QUERY, { id: conversationId }),
    enabled: !!conversationId,
    refetchInterval: 3000,
  });
}
