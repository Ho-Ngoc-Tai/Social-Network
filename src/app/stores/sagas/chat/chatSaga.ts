import { put, takeLatest, call } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { chatActions } from "../../reducers/chat/chatSlice";
import { 
  NEXT_CONVERSATIONS_ENDPOINT,
  NEXT_OPEN_CONVERSATION_ENDPOINT,
  NEXT_CONVERSATION_MESSAGES_ENDPOINT,
  NEXT_SEND_MESSAGE_ENDPOINT,
  NEXT_MARK_AS_READ_ENDPOINT,
} from "../../../routes/next.api";
import { ConversationsResponse, OpenConversationResponse, MessagesResponse, SendMessageResponse, MarkAsReadResponse } from "../../../types/chat/chat";

async function loadConversationsApi(): Promise<ConversationsResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const response = await fetch(NEXT_CONVERSATIONS_ENDPOINT, {
    method: 'GET',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch conversations: ${response.status}`);
  }

  return response.json();
}

function* loadConversationsWorker() {
  try {
    const response: ConversationsResponse = yield call(loadConversationsApi);
    yield put(chatActions.loadConversationsSucceeded({ conversations: response.data }));
  } catch (error) {
    yield put(chatActions.loadConversationsFailed({
      error: error instanceof Error ? error.message : 'Failed to fetch conversations',
    }));
  }
}

// Open conversation with user API
async function openConversationApi(userId: string): Promise<OpenConversationResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const response = await fetch(NEXT_OPEN_CONVERSATION_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to open conversation: ${response.status}`);
  }

  return response.json();
}

function* openConversationWorker(action: PayloadAction<{ userId: string }>) {
  try {
    const response: OpenConversationResponse = yield call(openConversationApi, action.payload.userId);
    yield put(chatActions.openConversationSucceeded({ data: response.data }));
  } catch (error) {
    yield put(chatActions.openConversationFailed({
      error: error instanceof Error ? error.message : 'Failed to open conversation',
    }));
  }
}

// Load messages API (use peer_id from conversation)
async function loadMessagesApi(peerId: string): Promise<MessagesResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const response = await fetch(NEXT_CONVERSATION_MESSAGES_ENDPOINT(peerId), {
    method: 'GET',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to load messages: ${response.status}`);
  }

  return response.json();
}

function* loadMessagesWorker(action: PayloadAction<{ peerId: string }>) {
  try {
    const response: MessagesResponse = yield call(loadMessagesApi, action.payload.peerId);
    yield put(chatActions.loadMessagesSucceeded({ messages: response.data }));
  } catch (error) {
    yield put(chatActions.loadMessagesFailed({
      error: error instanceof Error ? error.message : 'Failed to load messages',
    }));
  }
}

// Send message API
async function sendMessageApi(receiverId: string, content: string): Promise<SendMessageResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const response = await fetch(NEXT_SEND_MESSAGE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify({ receiverId, content }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to send message: ${response.status}`);
  }

  return response.json();
}

function* sendMessageWorker(action: PayloadAction<{ receiverId: string; content: string }>) {
  try {
    const response: SendMessageResponse = yield call(sendMessageApi, action.payload.receiverId, action.payload.content);
    yield put(chatActions.sendMessageSucceeded({ message: response.data }));
  } catch (error) {
    yield put(chatActions.sendMessageFailed({
      error: error instanceof Error ? error.message : 'Failed to send message',
    }));
  }
}

// Mark as read API
async function markAsReadApi(peerId: string): Promise<MarkAsReadResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const response = await fetch(NEXT_MARK_AS_READ_ENDPOINT(peerId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to mark as read: ${response.status}`);
  }

  return response.json();
}

function* markAsReadWorker(action: PayloadAction<{ peerId: string }>) {
  try {
    const response: MarkAsReadResponse = yield call(markAsReadApi, action.payload.peerId);
    yield put(chatActions.markAsReadSucceeded({ peerId: action.payload.peerId, updated: response.data.updated }));
  } catch (error) {
    yield put(chatActions.markAsReadFailed({
      error: error instanceof Error ? error.message : 'Failed to mark as read',
    }));
  }
}

export function* chatSaga() {
  yield takeLatest(chatActions.loadConversationsRequested.type, loadConversationsWorker);
  yield takeLatest(chatActions.openConversationRequested.type, openConversationWorker);
  yield takeLatest(chatActions.loadMessagesRequested.type, loadMessagesWorker);
  yield takeLatest(chatActions.sendMessageRequested.type, sendMessageWorker);
  yield takeLatest(chatActions.markAsReadRequested.type, markAsReadWorker);
}
