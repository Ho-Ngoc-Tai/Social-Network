import { put, takeLatest, call } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { friendsActions } from "../../reducers/friends/friendsSlice";
import { NEXT_FRIENDS_LIST_ENDPOINT, NEXT_USER_FRIEND_ENDPOINT } from "../../../routes/next.api";
import { FriendsListResponse, Friend } from "../../../types/friend/friend";

async function loadFriendsApi(): Promise<FriendsListResponse> {
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
    const response: FriendsListResponse = yield call(loadFriendsApi);
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
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to send friend request: ${response.status}`);
  }

  return response.json();
}

function* sendFriendRequestWorker(action: PayloadAction<{ userId: string }>) {
  try {
    yield call(sendFriendRequestApi, action.payload.userId);
    yield put(friendsActions.sendFriendRequestSucceeded());
  } catch (error) {
    yield put(friendsActions.sendFriendRequestFailed({
      error: error instanceof Error ? error.message : 'Failed to send friend request',
    }));
  }
}

export function* friendsSaga() {
  yield takeLatest(friendsActions.loadFriendsRequested.type, loadFriendsWorker);
  yield takeLatest(friendsActions.sendFriendRequestRequested.type, sendFriendRequestWorker);
}
