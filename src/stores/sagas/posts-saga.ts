import { takeLatest, put, call } from 'redux-saga/effects';
import { createPostFailure, createPostStart, createPostSuccess, fetchPostsFailure, fetchPostsStart, fetchPostsSuccess } from '../reducers/posts-slice';


function* fetchPostsSaga(action: any) {
  try {
    // TODO: Implement GraphQL query call
    // const response = yield call(apolloClient.query, {
    //   query: GET_POSTS_QUERY,
    //   variables: action.payload,
    // });
    // yield put(fetchPostsSuccess(response.data.posts));
    yield put(fetchPostsSuccess([]));
  } catch (error: any) {
    yield put(fetchPostsFailure(error.message));
  }
}

function* createPostSaga(action: any) {
  try {
    // TODO: Implement GraphQL mutation call
    // const response = yield call(apolloClient.mutate, {
    //   mutation: CREATE_POST_MUTATION,
    //   variables: action.payload,
    // });
    // yield put(createPostSuccess(response.data.createPost));
    yield put(createPostSuccess({
      id: '1',
      content: action.payload.content,
      author: { 
        id: '1', 
        name: 'Test User', 
        email: 'test@example.com',
        avatar: '',
        bio: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        followersCount: 0,
        followingCount: 0,
        postsCount: 1,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
    }));
  } catch (error: any) {
    yield put(createPostFailure(error.message));
  }
}

export function* postsSaga() {
  yield takeLatest(fetchPostsStart.type, fetchPostsSaga);
  yield takeLatest(createPostStart.type, createPostSaga);
}
