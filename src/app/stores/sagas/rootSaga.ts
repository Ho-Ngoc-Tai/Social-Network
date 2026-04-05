import { all, fork } from "redux-saga/effects";
import { authSaga } from "./auth/authSaga";
import { feedSaga } from "./feed/index";
import { profileSaga } from "./profile/profileSaga";


export function* rootSaga() {
  yield all([fork(authSaga), fork(feedSaga), fork(profileSaga)]);
}
