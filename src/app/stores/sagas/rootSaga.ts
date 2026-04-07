import { all, fork } from "redux-saga/effects";
import { authSaga } from "./auth/authSaga";
import { feedSaga } from "./feed/index";
import { profileSaga } from "./profile/profileSaga";
import { notificationSaga } from "./notification/notificationSaga";
import { friendsSaga } from "./friends/friendsSaga";
import { chatSaga } from "./chat/chatSaga";

export function* rootSaga() {
  yield all([fork(authSaga), fork(feedSaga), fork(profileSaga), fork(notificationSaga), fork(friendsSaga), fork(chatSaga)]);
}
