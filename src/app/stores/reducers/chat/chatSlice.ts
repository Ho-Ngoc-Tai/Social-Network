import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Conversation, OpenConversationData, Message } from "../../../types/chat/chat";

interface ChatState {
  conversations: Conversation[];
  selectedConversationId: string | null;
  messages: Message[];
  isLoading: boolean;
  isLoadingMessages: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  selectedConversationId: null,
  messages: [],
  isLoading: false,
  isLoadingMessages: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    loadConversationsRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loadConversationsSucceeded: (state, action: PayloadAction<{ conversations: Conversation[] }>) => {
      state.conversations = action.payload.conversations;
      state.isLoading = false;
      state.error = null;
    },
    loadConversationsFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.isLoading = false;
      state.error = action.payload.error;
    },
    selectConversation: (state, action: PayloadAction<{ conversationId: string }>) => {
      state.selectedConversationId = action.payload.conversationId;
      state.messages = []; // Clear messages when switching
    },
    // Load messages
    loadMessagesRequested: (state, action: PayloadAction<{ peerId: string }>) => {
      state.isLoadingMessages = true;
      state.error = null;
    },
    loadMessagesSucceeded: (state, action: PayloadAction<{ messages: Message[] }>) => {
      state.messages = action.payload.messages;
      state.isLoadingMessages = false;
      state.error = null;
    },
    loadMessagesFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.isLoadingMessages = false;
      state.error = action.payload.error;
    },
    // Open conversation with user
    openConversationRequested: (state, action: PayloadAction<{ userId: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    openConversationSucceeded: (state, action: PayloadAction<{ data: OpenConversationData }>) => {
      const { data } = action.payload;
      state.selectedConversationId = data.conversation_id;
      // Add to conversations if it's a new conversation
      const exists = state.conversations.find(c => c.conversation_id === data.conversation_id);
      if (!exists) {
        state.conversations.unshift({
          conversation_id: data.conversation_id,
          peer_id: data.peer_id,
          last_message: "",
          last_message_row: {
            id: "",
            sender: "",
            conversation: data.conversation_id,
            content: "",
            created_at: new Date().toISOString(),
          },
          unread_count: data.unread_count,
          updated_at: new Date().toISOString(),
        });
      }
      state.isLoading = false;
    },
    openConversationFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.isLoading = false;
      state.error = action.payload.error;
    },
    // Send message
    sendMessageRequested: (state, action: PayloadAction<{ receiverId: string; content: string }>) => {
      state.error = null;
    },
    sendMessageSucceeded: (state, action: PayloadAction<{ message: Message }>) => {
      state.messages.push(action.payload.message);
    },
    sendMessageFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.error = action.payload.error;
    },
    // Mark messages as read
    markAsReadRequested: (state, action: PayloadAction<{ peerId: string }>) => {
      state.error = null;
    },
    markAsReadSucceeded: (state, action: PayloadAction<{ peerId: string; updated: number }>) => {
      // Update unread count in conversation
      const conversation = state.conversations.find(c => c.peer_id === action.payload.peerId);
      if (conversation) {
        conversation.unread_count = 0;
      }
    },
    markAsReadFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.error = action.payload.error;
    },
    clearChatError: (state) => {
      state.error = null;
    },
  },
});

export const chatActions = chatSlice.actions;
export const chatReducer = chatSlice.reducer;
