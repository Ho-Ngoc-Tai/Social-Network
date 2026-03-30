import { delay, put, select, takeLatest } from "redux-saga/effects";

import { feedActions } from "@/stores/reducers/feedSlice";
import type { RootState } from "@/stores/store";
import { createMockPost, getMockFeed } from "@/services/mockData";

function* loadFeedWorker() {
  yield delay(350);
  const items = getMockFeed();
  yield put(feedActions.loadFeedSucceeded({ items }));
}

function* createPostWorker(action: ReturnType<typeof feedActions.createPostRequested>) {
  yield delay(250);
  const state: RootState = yield select();
  const email = state.auth.email ?? "student@university.edu";
  const post = createMockPost({ content: action.payload.content, authorName: email.split("@")[0] });
  yield put(feedActions.createPostSucceeded({ post }));
}

export function* feedSaga() {
  yield takeLatest(feedActions.loadFeedRequested.type, loadFeedWorker);
  yield takeLatest(feedActions.createPostRequested.type, createPostWorker);
}
