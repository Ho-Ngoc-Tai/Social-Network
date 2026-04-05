import { put, takeLatest, call } from "redux-saga/effects";
import { authActions } from "../../reducers/auth/authSlice";
import { NEXT_LOGIN_ENDPOINT, NEXT_REGISTER_ENDPOINT, NEXT_CURRENT_USER_ENDPOINT } from "../../../routes/next.api";

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
  const response = await fetch(NEXT_LOGIN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Login failed: ${response.status}`);
  }
  
  return await response.json();
}

// Register API call
async function registerApi(username: string, full_name: string, email: string, password: string): Promise<RegisterResponse> {
  const response = await fetch(NEXT_REGISTER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, full_name, email, password }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Registration failed: ${response.status}`);
  }
  
  return await response.json();
}

// Get current user API call
async function getCurrentUserApi(token: string): Promise<CurrentUserResponse> {
  const response = await fetch(NEXT_CURRENT_USER_ENDPOINT, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to get current user: ${response.status}`);
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
    }
    
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
    }
    
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    
    // Update Redux state
    yield put(authActions.sessionHydrated({ status: "anonymous", user: null, token: null }));
  } catch {
    yield put(authActions.logoutFailed({ error: 'Logout failed' }));
  }
}

function* hydrateSessionWorker(): Generator {
  try {
    // Only access localStorage on client side
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    yield put(authActions.sessionHydrated({ status: "anonymous", user: null, token: null }));
  }
}

export function* authSaga() {
  yield takeLatest(authActions.loginRequested.type, loginWorker);
  yield takeLatest(authActions.registerRequested.type, registerWorker);
  yield takeLatest(authActions.logoutRequested.type, logoutWorker);
  yield takeLatest(authActions.sessionHydrationRequested.type, hydrateSessionWorker);
}
