import { put, takeLatest, call } from "redux-saga/effects";
import { notificationActions } from "../../reducers/notification/notificationSlice";
import { NEXT_NOTIFICATIONS_ENDPOINT, NEXT_NOTIFICATIONS_UNREAD_COUNT_ENDPOINT } from "../../../routes/next.api";
import { NotificationsResponse } from "../../../types/notification/notification";

interface UnreadCountResponse {
  data: {
    unread_count: number;
  };
  message: string;
}

async function loadNotificationsApi(params: { limit?: number; cursor?: string }): Promise<NotificationsResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.cursor) queryParams.set('cursor', params.cursor);

  const queryString = queryParams.toString();
  const url = `${NEXT_NOTIFICATIONS_ENDPOINT}${queryString ? `?${queryString}` : ''}`;

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

      throw new Error(message || `Failed to load notifications: ${response.status}`);
    }

    return await response.json();
  } catch (fetchError) {
    throw fetchError;
  }
}

async function fetchUnreadCountApi(): Promise<UnreadCountResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  try {
    const response = await fetch(NEXT_NOTIFICATIONS_UNREAD_COUNT_ENDPOINT, {
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

      throw new Error(message || `Failed to fetch unread count: ${response.status}`);
    }

    return await response.json();
  } catch (fetchError) {
    throw fetchError;
  }
}

function* loadNotificationsWorker(action: { type: string; payload: { limit?: number; cursor?: string } }) {
  try {
    const response: NotificationsResponse = yield call(loadNotificationsApi, action.payload);

    yield put(notificationActions.loadNotificationsSucceeded({
      items: response.data.items,
      has_more: response.data.has_more,
      next_cursor: response.data.next_cursor,
    }));

  } catch (error) {
    yield put(notificationActions.loadNotificationsFailed({
      error: error instanceof Error ? error.message : 'Failed to load notifications',
    }));
  }
}

function* fetchUnreadCountWorker() {
  try {
    const response: UnreadCountResponse = yield call(fetchUnreadCountApi);

    yield put(notificationActions.fetchUnreadCountSucceeded({
      unread_count: response.data.unread_count,
    }));

  } catch (error) {
    yield put(notificationActions.fetchUnreadCountFailed({
      error: error instanceof Error ? error.message : 'Failed to fetch unread count',
    }));
  }
}

export function* notificationSaga() {
  yield takeLatest(notificationActions.loadNotificationsRequested.type, loadNotificationsWorker);
  yield takeLatest(notificationActions.fetchUnreadCountRequested.type, fetchUnreadCountWorker);
}
