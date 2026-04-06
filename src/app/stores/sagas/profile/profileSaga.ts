import { put, takeLatest, call } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { profileActions } from "../../reducers/profile/profileSlice";
import { NEXT_USER_PROFILE_ENDPOINT } from "../../../routes/next.api";
import { UserProfileResponse } from "../../../types/profile/profile";

async function loadUserProfileApi(userId: string, page?: number, limit?: number): Promise<UserProfileResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const queryParams = new URLSearchParams();
  if (page) queryParams.set('page', String(page));
  if (limit) queryParams.set('limit', String(limit));

  const queryString = queryParams.toString();
  const url = `${NEXT_USER_PROFILE_ENDPOINT(userId)}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const errorData: unknown = await response.json().catch(() => ({}));

      const message = (() => {
        if (!errorData || typeof errorData !== 'object') return null;
        const ed = errorData as Record<string, unknown>;
        if (typeof ed.message === 'string' && ed.message) return ed.message;
        return null;
      })();

      throw new Error(message || `Failed to load user profile: ${response.status}`);
    }

    return await response.json();
  } catch (fetchError) {
    throw fetchError;
  }
}

function* loadUserProfileWorker(action: PayloadAction<{ userId: string; page?: number; limit?: number }>) {
  try {
    const response: UserProfileResponse = yield call(
      loadUserProfileApi, 
      action.payload.userId,
      action.payload.page,
      action.payload.limit
    );

    yield put(profileActions.loadProfileSucceeded({
      user: response.data.user,
      posts: response.data.posts,
      friend: response.data.friend,
    }));

  } catch (error) {
    yield put(profileActions.loadProfileFailed({
      error: error instanceof Error ? error.message : 'Failed to load user profile',
    }));
  }
}

export function* profileSaga() {
  yield takeLatest(profileActions.loadProfileRequested.type, loadUserProfileWorker);
}
