import { takeLatest, put, call } from 'redux-saga/effects';

import { fetchProfileFailure, fetchProfileFollowersSuccess, fetchProfileFollowingSuccess, fetchProfilePostsSuccess, fetchProfileStart, fetchProfileSuccess } from '../reducers/profile-slice';

function* fetchProfileSaga(action: any) {
  try {
    // TODO: Implement GraphQL query call
    // const response = yield call(apolloClient.query, {
    //   query: GET_USER_QUERY,
    //   variables: { id: action.payload },
    // });
    // yield put(fetchProfileSuccess(response.data.user));
    yield put(fetchProfileSuccess({
      id: action.payload,
      name: 'Test User',
      email: 'test@example.com',
      avatar: '',
      bio: 'Test bio',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
    }));
  } catch (error: any) {
    yield put(fetchProfileFailure(error.message));
  }
}

function* fetchProfilePostsSaga(action: any) {
  try {
    // TODO: Implement GraphQL query call
    // const response = yield call(apolloClient.query, {
    //   query: GET_USER_POSTS_QUERY,
    //   variables: action.payload,
    // });
    // yield put(fetchProfilePostsSuccess(response.data.userPosts));
    yield put(fetchProfilePostsSuccess([]));
  } catch (error: any) {
    yield put(fetchProfileFailure(error.message));
  }
}

function* fetchProfileFollowersSaga(action: any) {
  try {
    // TODO: Implement GraphQL query call
    // const response = yield call(apolloClient.query, {
    //   query: GET_FOLLOWERS_QUERY,
    //   variables: action.payload,
    // });
    // yield put(fetchProfileFollowersSuccess(response.data.followers));
    yield put(fetchProfileFollowersSuccess([]));
  } catch (error: any) {
    yield put(fetchProfileFailure(error.message));
  }
}

function* fetchProfileFollowingSaga(action: any) {
  try {
    // TODO: Implement GraphQL query call
    // const response = yield call(apolloClient.query, {
    //   query: GET_FOLLOWING_QUERY,
    //   variables: action.payload,
    // });
    // yield put(fetchProfileFollowingSuccess(response.data.following));
    yield put(fetchProfileFollowingSuccess([]));
  } catch (error: any) {
    yield put(fetchProfileFailure(error.message));
  }
}

export function* profileSaga() {
  yield takeLatest(fetchProfileStart.type, fetchProfileSaga);
  yield takeLatest('FETCH_PROFILE_POSTS', fetchProfilePostsSaga);
  yield takeLatest('FETCH_PROFILE_FOLLOWERS', fetchProfileFollowersSaga);
  yield takeLatest('FETCH_PROFILE_FOLLOWING', fetchProfileFollowingSaga);
}
