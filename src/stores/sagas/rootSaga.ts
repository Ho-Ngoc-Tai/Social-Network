import { all, fork } from "redux-saga/effects";

import { authSaga } from "@/stores/sagas/authSaga";
import { feedSaga } from "@/stores/sagas/feedSaga";
import { profileSaga } from "@/stores/sagas/profileSaga";

export function* rootSaga() {
  yield all([fork(authSaga), fork(feedSaga), fork(profileSaga)]);
}
