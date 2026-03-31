import { delay, put, takeLatest } from "redux-saga/effects";

import { getMockProfile } from "../../../services/mockData";
import { profileActions } from "../../reducers/profile/profileSlice";

function* loadProfileWorker(action: ReturnType<typeof profileActions.loadProfileRequested>): Generator {
  yield delay(300);
  const result = getMockProfile(action.payload.id);
  yield put(profileActions.loadProfileSucceeded(result));
}

export function* profileSaga() {
  yield takeLatest(profileActions.loadProfileRequested.type, loadProfileWorker);
}
