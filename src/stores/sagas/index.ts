import { all } from 'redux-saga/effects';
import { authSaga } from './auth-saga';
import { postsSaga } from './posts-saga';
import { feedSaga } from './feed-saga';
import { profileSaga } from './profile-saga';
import { notificationsSaga } from './notifications-saga';


export function* rootSaga() {
  yield all([
    authSaga(),
    postsSaga(),
    feedSaga(),
    profileSaga(),
    notificationsSaga(),
  ]);
}
