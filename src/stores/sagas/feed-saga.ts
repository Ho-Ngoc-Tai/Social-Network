import { takeLatest, put, call } from 'redux-saga/effects';
import { fetchFeedFailure, fetchFeedStart, fetchFeedSuccess, loadMoreFeedStart, loadMoreFeedSuccess, refreshFeedStart, refreshFeedSuccess } from '../reducers/feed-slice';


function* fetchFeedSaga(action: any) {
  try {
    // TODO: Implement GraphQL query call
    // const response = yield call(apolloClient.query, {
    //   query: GET_FEED_QUERY,
    //   variables: action.payload,
    // });
    // yield put(fetchFeedSuccess(response.data.feed));
    yield put(fetchFeedSuccess({ items: [], hasMore: true }));
  } catch (error: any) {
    yield put(fetchFeedFailure(error.message));
  }
}

function* loadMoreFeedSaga(action: any) {
  try {
    // TODO: Implement GraphQL query call
    // const response = yield call(apolloClient.query, {
    //   query: GET_FEED_QUERY,
    //   variables: action.payload,
    // });
    // yield put(loadMoreFeedSuccess(response.data.feed));
    yield put(loadMoreFeedSuccess({ items: [], hasMore: false }));
  } catch (error: any) {
    yield put(fetchFeedFailure(error.message));
  }
}

function* refreshFeedSaga(action: any) {
  try {
    // TODO: Implement GraphQL query call
    // const response = yield call(apolloClient.query, {
    //   query: GET_FEED_QUERY,
    //   variables: action.payload,
    // });
    // yield put(refreshFeedSuccess(response.data.feed));
    yield put(refreshFeedSuccess({ items: [], hasMore: true }));
  } catch (error: any) {
    yield put(fetchFeedFailure(error.message));
  }
}

export function* feedSaga() {
  yield takeLatest(fetchFeedStart.type, fetchFeedSaga);
  yield takeLatest(loadMoreFeedStart.type, loadMoreFeedSaga);
  yield takeLatest(refreshFeedStart.type, refreshFeedSaga);
}
