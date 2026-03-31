import { put, takeLatest, call } from "redux-saga/effects";
import { authActions } from "../../reducers/auth/authSlice";

// API Response Types
interface LoginResponse {
  data: {
    accessToken: string;
    user: {
      id: string;
      username: string;
      full_name: string;
      email: string;
      status: "ACTIVE" | "BLOCK";
    };
  };
  message: string;
}

interface RegisterResponse {
  data: {
    accessToken: string;
    user: {
      id: string;
      username: string;
      full_name: string;
      email: string;
      status: "ACTIVE" | "BLOCK";
    };
  };
  message: string;
}

interface CurrentUserResponse {
  data: {
    id: string;
    username: string;
    full_name: string;
    email: string;
    status: "ACTIVE" | "BLOCK";
  };
}

// Login API call
async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch('https://social-app-backend-44cw.onrender.com/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return await response.json();
}

// Register API call
async function registerApi(username: string, full_name: string, email: string, password: string): Promise<RegisterResponse> {
  const response = await fetch('https://social-app-backend-44cw.onrender.com/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, full_name, email, password }),
  });
  
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  
  return await response.json();
}

// Get current user API call
async function getCurrentUserApi(token: string): Promise<CurrentUserResponse> {
  const response = await fetch('https://social-app-backend-44cw.onrender.com/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to get current user');
  }
  
  return await response.json();
}

function* loginWorker(action: ReturnType<typeof authActions.loginRequested>): Generator {
  try {
    const { email, password } = action.payload;
    
    // Call login API
    const response = yield call(loginApi, email, password);
    
    // Extract token and user data
    const { accessToken, user } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('access_token', accessToken);
    
    // Update Redux state
    yield put(
      authActions.sessionHydrated({
        status: "authenticated",
        user: {
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          email: user.email,
          status: user.status,
        },
        token: accessToken,
      }),
    );
    
  } catch (error) {
    yield put(
      authActions.loginFailed({
        error: error instanceof Error ? error.message : 'Login failed',
      }),
    );
  }
}

function* registerWorker(action: ReturnType<typeof authActions.registerRequested>): Generator {
  try {
    const { username, full_name, email, password } = action.payload;
    
    // Call register API
    const response = yield call(registerApi, username, full_name, email, password);
    
    // Extract token and user data
    const { accessToken, user } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('access_token', accessToken);
    
    // Update Redux state
    yield put(
      authActions.sessionHydrated({
        status: "authenticated",
        user: {
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          email: user.email,
          status: user.status,
        },
        token: accessToken,
      }),
    );
    
  } catch (error) {
    yield put(
      authActions.registerFailed({
        error: error instanceof Error ? error.message : 'Registration failed',
      }),
    );
  }
}

function* logoutWorker() {
  try {
    // Remove token from localStorage
    localStorage.removeItem('access_token');
    
    // Update Redux state
    yield put(authActions.sessionHydrated({ status: "anonymous", user: null, token: null }));
  } catch {
    yield put(authActions.logoutFailed({ error: 'Logout failed' }));
  }
}

function* hydrateSessionWorker(): Generator {
  try {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      // Get current user info
      const response = yield call(getCurrentUserApi, token);
      
      yield put(
        authActions.sessionHydrated({
          status: "authenticated",
          user: response.data,
          token: token,
        }),
      );
    } else {
      yield put(authActions.sessionHydrated({ status: "anonymous", user: null, token: null }));
    }
  } catch {
    // Token invalid, remove it
    localStorage.removeItem('access_token');
    yield put(authActions.sessionHydrated({ status: "anonymous", user: null, token: null }));
  }
}

export function* authSaga() {
  yield takeLatest(authActions.loginRequested.type, loginWorker);
  yield takeLatest(authActions.registerRequested.type, registerWorker);
  yield takeLatest(authActions.logoutRequested.type, logoutWorker);
  yield takeLatest(authActions.sessionHydrationRequested.type, hydrateSessionWorker);
}
