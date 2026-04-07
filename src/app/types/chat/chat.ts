export interface Message {
  id: string;
  sender: string;
  conversation: string;
  content: string;
  created_at: string;
}

export interface Conversation {
  conversation_id: string;
  peer_id: string;
  last_message: string;
  last_message_row: Message;
  unread_count: number;
  updated_at: string;
}

export interface ConversationsResponse {
  data: Conversation[];
  message: string;
}

export interface OpenConversationData {
  is_new: boolean;
  conversation_id: string;
  peer_id: string;
  unread_count: number;
}

export interface OpenConversationResponse {
  data: OpenConversationData;
  message: string;
}

export interface MessagesResponse {
  data: Message[];
  message: string;
}

export interface SendMessageResponse {
  data: Message;
  message: string;
}

export interface MarkAsReadResponse {
  data: {
    updated: number;
  };
  message: string;
}
