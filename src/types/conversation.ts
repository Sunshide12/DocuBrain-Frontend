export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  response_type: string | null;
  metadata: string | null;
  agent_key: string | null;
  created_at: string;
}

export interface ConversationDocument {
  id: string;
  title: string | null;
  file_path: string;
}

export interface Conversation {
  id: string;
  title: string;
  agent_type: string;
  document: ConversationDocument | null;
  messages: ConversationMessage[];
}

export interface GetConversationResponse {
  conversation: Conversation | null;
}

export interface SendMessageResponse {
  sendMessage: ConversationMessage;
}
