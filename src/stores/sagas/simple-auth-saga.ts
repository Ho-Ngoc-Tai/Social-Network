import { takeLatest, put } from 'redux-saga/effects';
import { loginSuccess, loginFailure, logout } from '@/stores/reducers/auth-slice';

// Simple working saga without GraphQL
function* simpleLoginSaga(action: any) {
  try {
    console.log('Simple login with:', action.payload);
    
    // Mock successful login
    const mockUser = {
      id: '1',
      name: 'Nguyễn Văn A',
      email: action.payload.email,
      avatar: '',
      bio: 'Tôi là người dùng test',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      followersCount: 10,
      followingCount: 25,
      postsCount: 5,
      token: 'simple-mock-token-12345'
    };
    
    yield put(loginSuccess(mockUser));
    console.log('Login successful:', mockUser);
    
  } catch (error: any) {
    console.error('Simple login error:', error);
    yield put(loginFailure(error.message));
  }
}

function* simpleLogoutSaga() {
  try {
    console.log('Simple logout');
    yield put(logout());
  } catch (error: any) {
    console.error('Simple logout error:', error);
  }
}

export function* simpleAuthSaga() {
  yield takeLatest('SIMPLE_LOGIN', simpleLoginSaga);
  yield takeLatest('SIMPLE_LOGOUT', simpleLogoutSaga);
}
