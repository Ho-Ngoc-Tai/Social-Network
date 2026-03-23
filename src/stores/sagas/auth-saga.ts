import { takeLatest, put, call } from 'redux-saga/effects';
import { loginStart, loginSuccess, loginFailure, logout } from '@/stores/reducers/auth-slice';
import { LOGIN_MUTATION, REGISTER_MUTATION, LOGOUT_MUTATION } from '@/apis/auth.api';
import { client } from '@/libs/apollo-client';
import { gql } from '@apollo/client';

function* loginSaga(action: any): Generator<any, void, unknown> {
  try {
    const response: any = yield call(client.mutate, {
      mutation: LOGIN_MUTATION,
      variables: action.payload,
    });
    yield put(loginSuccess(response.data.login));
  } catch (error: any) {
    yield put(loginFailure(error.message));
  }
}

function* registerSaga(action: any): Generator<any, void, unknown> {
  try {
    const response: any = yield call(client.mutate, {
      mutation: REGISTER_MUTATION,
      variables: action.payload,
    });
    yield put(loginSuccess(response.data.register));
  } catch (error: any) {
    yield put(loginFailure(error.message));
  }
}

function* logoutSaga(): Generator<any, void, unknown> {
  try {
    yield call(client.mutate, { mutation: LOGOUT_MUTATION });
    yield put(logout());
  } catch (error: any) {
    console.error('Logout error:', error);
  }
}

export function* authSaga(): Generator<any, void, unknown> {
  yield takeLatest(loginStart.type, loginSaga);
  yield takeLatest('REGISTER', registerSaga);
  yield takeLatest(logout.type, logoutSaga);
}
