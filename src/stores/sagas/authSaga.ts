import { delay, put, takeLatest } from "redux-saga/effects";

import { authActions } from "@/stores/reducers/authSlice";

function* loginWorker(action: ReturnType<typeof authActions.loginRequested>) {
  yield delay(250);
  yield put(
    authActions.sessionHydrated({
      status: "authenticated",
      email: action.payload.email,
    }),
  );
}

function* logoutWorker() {
  yield delay(100);
  yield put(authActions.sessionHydrated({ status: "anonymous", email: null }));
}

export function* authSaga() {
  yield takeLatest(authActions.loginRequested.type, loginWorker);
  yield takeLatest(authActions.logoutRequested.type, logoutWorker);
}
