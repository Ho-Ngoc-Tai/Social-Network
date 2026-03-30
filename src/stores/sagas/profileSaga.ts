import { delay, put, takeLatest } from "redux-saga/effects";

import { profileActions } from "@/stores/reducers/profileSlice";
import { getMockProfile } from "@/services/mockData";

function* loadProfileWorker(action: ReturnType<typeof profileActions.loadProfileRequested>) {
  yield delay(300);
  const result = getMockProfile(action.payload.id);
  yield put(profileActions.loadProfileSucceeded(result));
}

export function* profileSaga() {
  yield takeLatest(profileActions.loadProfileRequested.type, loadProfileWorker);
}
