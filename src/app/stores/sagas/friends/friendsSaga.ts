import { put, takeLatest, call } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { friendsActions } from "../../reducers/friends/friendsSlice";
import { profileActions } from "../../reducers/profile/profileSlice";
import { 
  NEXT_FRIENDS_LIST_ENDPOINT, 
  NEXT_USER_FRIEND_ENDPOINT, 
  NEXT_USER_ACCEPT_FRIEND_ENDPOINT,
  NEXT_PENDING_REQUESTS_ENDPOINT,
  NEXT_USER_UNFRIEND_ENDPOINT,
  NEXT_BLOCKED_LIST_ENDPOINT,
  NEXT_USER_BLOCK_ENDPOINT,
  NEXT_USER_UNBLOCK_ENDPOINT,
  NEXT_ALL_USERS_ENDPOINT
} from "../../../routes/next.api";
import { LoadFriendsResponse, Friend, LoadPendingRequestsResponse, LoadBlockedResponse, LoadUsersResponse } from "../../../types/friends/friends";

async function loadFriendsApi(): Promise<LoadFriendsResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const response = await fetch(NEXT_FRIENDS_LIST_ENDPOINT, {
    method: 'GET',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch friends: ${response.status}`);
  }

  return response.json();
}

function* loadFriendsWorker() {
  try {
    const response: LoadFriendsResponse = yield call(loadFriendsApi);
    yield put(friendsActions.loadFriendsSucceeded({ friends: response.data }));
  } catch (error) {
    yield put(friendsActions.loadFriendsFailed({
      error: error instanceof Error ? error.message : 'Failed to fetch friends list',
    }));
  }
}

// Send friend request API
async function sendFriendRequestApi(userId: string): Promise<{ data: Friend; message: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const response = await fetch(NEXT_USER_FRIEND_ENDPOINT(userId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to send friend request: ${response.status}`);
  }

  return response.json();
}

// Accept friend request API
async function acceptFriendRequestApi(userId: string): Promise<{ data: Friend; message: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  // Try without /accept - backend might use same endpoint with different logic
  const response = await fetch(NEXT_USER_FRIEND_ENDPOINT(userId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to accept friend request: ${response.status}`);
  }

  return response.json();
}

function* sendFriendRequestWorker(action: PayloadAction<{ userId: string }>) {
  try {
    yield call(sendFriendRequestApi, action.payload.userId);
    yield put(friendsActions.sendFriendRequestSucceeded());
    yield put(friendsActions.loadPendingRequestsRequested());
    yield put(friendsActions.loadFriendsRequested());
    yield put(profileActions.reloadFriendStatusRequested({ userId: action.payload.userId }));
  } catch (error) {
    console.error("[FriendsSaga] Send friend request failed:", error);
    yield put(friendsActions.sendFriendRequestFailed({
      error: error instanceof Error ? error.message : 'Failed to send friend request',
    }));
  }
}

// Load pending requests API
async function loadPendingRequestsApi(): Promise<LoadPendingRequestsResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const response = await fetch(NEXT_PENDING_REQUESTS_ENDPOINT, {
    method: 'GET',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch pending requests: ${response.status}`);
  }

  return response.json();
}

function* loadPendingRequestsWorker() {
  try {
    const response: LoadPendingRequestsResponse = yield call(loadPendingRequestsApi);
    console.log("[FriendsSaga] Pending requests loaded:", response.data);
    console.log("[FriendsSaga] First request sample:", response.data?.[0]);
    yield put(friendsActions.loadPendingRequestsSucceeded({ pendingRequests: response.data }));
  } catch (error) {
    console.error("[FriendsSaga] Failed to load pending requests:", error);
    yield put(friendsActions.loadPendingRequestsFailed({
      error: error instanceof Error ? error.message : 'Failed to fetch pending requests',
    }));
  }
}

// Unfriend API
async function unfriendApi(userId: string): Promise<{ data: { success: boolean }; message: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const response = await fetch(NEXT_USER_UNFRIEND_ENDPOINT(userId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to unfriend: ${response.status}`);
  }

  return response.json();
}

function* acceptFriendRequestWorker(action: PayloadAction<{ userId: string }>) {
  try {
    // Use dedicated accept API endpoint
    yield call(acceptFriendRequestApi, action.payload.userId);
    yield put(friendsActions.acceptFriendRequestSucceeded());
    // Reload both lists and profile friend status after accepting
    yield put(friendsActions.loadFriendsRequested());
    yield put(friendsActions.loadPendingRequestsRequested());
    yield put(profileActions.reloadFriendStatusRequested({ userId: action.payload.userId }));
  } catch (error) {
    yield put(friendsActions.acceptFriendRequestFailed({
      error: error instanceof Error ? error.message : 'Failed to accept friend request',
    }));
  }
}

function* unfriendWorker(action: PayloadAction<{ userId: string }>) {
  try {
    yield call(unfriendApi, action.payload.userId);
    yield put(friendsActions.unfriendSucceeded());
    // Reload both lists and profile friend status after unfriend
    yield put(friendsActions.loadFriendsRequested());
    yield put(friendsActions.loadPendingRequestsRequested());
    yield put(profileActions.reloadFriendStatusRequested({ userId: action.payload.userId }));
  } catch (error) {
    yield put(friendsActions.unfriendFailed({
      error: error instanceof Error ? error.message : 'Failed to unfriend user',
    }));
  }
}

// Load blocked users API
async function loadBlockedApi(): Promise<LoadBlockedResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const response = await fetch(NEXT_BLOCKED_LIST_ENDPOINT, {
    method: 'GET',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch blocked users: ${response.status}`);
  }

  return response.json();
}

function* loadBlockedWorker() {
  try {
    const response: LoadBlockedResponse = yield call(loadBlockedApi);
    yield put(friendsActions.loadBlockedSucceeded({ blockedUsers: response.data }));
  } catch (error) {
    yield put(friendsActions.loadBlockedFailed({
      error: error instanceof Error ? error.message : 'Failed to fetch blocked users',
    }));
  }
}

// Block user API
async function blockUserApi(userId: string): Promise<{ data: { id: string; in: string; out: string }; message: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const response = await fetch(NEXT_USER_BLOCK_ENDPOINT(userId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to block user: ${response.status}`);
  }

  return response.json();
}

function* blockUserWorker(action: PayloadAction<{ userId: string }>) {
  try {
    yield call(blockUserApi, action.payload.userId);
    yield put(friendsActions.blockUserSucceeded());
    // Reload blocked list after blocking
    yield put(friendsActions.loadBlockedRequested());
    // Also reload friends and pending as the user is no longer in those lists
    yield put(friendsActions.loadFriendsRequested());
    yield put(friendsActions.loadPendingRequestsRequested());
  } catch (error) {
    yield put(friendsActions.blockUserFailed({
      error: error instanceof Error ? error.message : 'Failed to block user',
    }));
  }
}

// Unblock user API
async function unblockUserApi(userId: string): Promise<{ data: { success: boolean }; message: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const response = await fetch(NEXT_USER_UNBLOCK_ENDPOINT(userId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to unblock user: ${response.status}`);
  }

  return response.json();
}

function* unblockUserWorker(action: PayloadAction<{ userId: string }>) {
  try {
    yield call(unblockUserApi, action.payload.userId);
    yield put(friendsActions.unblockUserSucceeded());
    // Reload blocked list after unblocking
    yield put(friendsActions.loadBlockedRequested());
  } catch (error) {
    yield put(friendsActions.unblockUserFailed({
      error: error instanceof Error ? error.message : 'Failed to unblock user',
    }));
  }
}

// Load all users API
async function loadUsersApi(): Promise<LoadUsersResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const response = await fetch(NEXT_ALL_USERS_ENDPOINT, {
    method: 'GET',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch users: ${response.status}`);
  }

  return response.json();
}

function* loadUsersWorker() {
  try {
    const response: LoadUsersResponse = yield call(loadUsersApi);
    yield put(friendsActions.loadUsersSucceeded({ users: response.data }));
  } catch (error) {
    yield put(friendsActions.loadUsersFailed({
      error: error instanceof Error ? error.message : 'Failed to fetch users',
    }));
  }
}

export function* friendsSaga() {
  yield takeLatest(friendsActions.loadFriendsRequested.type, loadFriendsWorker);
  yield takeLatest(friendsActions.sendFriendRequestRequested.type, sendFriendRequestWorker);
  yield takeLatest(friendsActions.loadPendingRequestsRequested.type, loadPendingRequestsWorker);
  yield takeLatest(friendsActions.acceptFriendRequestRequested.type, acceptFriendRequestWorker);
  yield takeLatest(friendsActions.unfriendRequested.type, unfriendWorker);
  yield takeLatest(friendsActions.loadBlockedRequested.type, loadBlockedWorker);
  yield takeLatest(friendsActions.blockUserRequested.type, blockUserWorker);
  yield takeLatest(friendsActions.unblockUserRequested.type, unblockUserWorker);
  yield takeLatest(friendsActions.loadUsersRequested.type, loadUsersWorker);
}
