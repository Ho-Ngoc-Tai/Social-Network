import { takeLatest, put, call } from 'redux-saga/effects';
import { fetchNotificationsFailure, fetchNotificationsStart, fetchNotificationsSuccess } from '../reducers/notifications-slice';

function* fetchNotificationsSaga(action: any) {
  try {
    // TODO: Implement GraphQL query call
    // const response = yield call(apolloClient.query, {
    //   query: GET_NOTIFICATIONS_QUERY,
    //   variables: action.payload,
    // });
    // yield put(fetchNotificationsSuccess({ 
    //   notifications: response.data.notifications, 
    //   unreadCount: response.data.unreadNotificationsCount 
    // }));
    yield put(fetchNotificationsSuccess({ 
      notifications: [], 
      unreadCount: 0 
    }));
  } catch (error: any) {
    yield put(fetchNotificationsFailure(error.message));
  }
}

export function* notificationsSaga() {
  yield takeLatest(fetchNotificationsStart.type, fetchNotificationsSaga);
}
