import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthStatus = "anonymous" | "authenticated";

export interface User {
  id: string;
  username?: string;
  full_name?: string;
  email?: string;
  status?: "ACTIVE" | "BLOCK";
  avatar?: string;
}

export interface AuthState {
  email: string;
  status: AuthStatus;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  status: "anonymous",
  user: null,
  token: null,
  isLoading: false,
  error: null,
  email: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login actions
    loginRequested: (state, action: PayloadAction<{ email: string; password: string }>) => {
      state.isLoading = true;
      state.error = null;
      void action.payload;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.status = "authenticated";
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
      state.error = null;
    },
    loginFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.status = "anonymous";
      state.user = null;
      state.token = null;
      state.email = "";
      state.isLoading = false;
      state.error = action.payload.error;
    },

    // Register actions
    registerRequested: (state, action: PayloadAction<{ username: string; full_name: string; email: string; password: string }>) => {
      state.isLoading = true;
      state.error = null;
      void action.payload;
    },
    registerSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.status = "authenticated";
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
      state.error = null;
    },
    registerFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.status = "anonymous";
      state.user = null;
      state.token = null;
      state.email = "";
      state.isLoading = false;
      state.error = action.payload.error;
    },

    // Logout actions
    logoutRequested: (state) => {
      state.isLoading = true;
    },
    logoutSuccess: (state) => {
      state.status = "anonymous";
      state.user = null;
      state.token = null;
      state.email = "";
      state.isLoading = false;
      state.error = null;
    },
    logoutFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.isLoading = false;
      state.error = action.payload.error;
    },

    // Session hydration
    sessionHydrationRequested: (state) => {
      state.isLoading = true;
    },
    sessionHydrated: (state, action: PayloadAction<{ status: AuthStatus; user: User | null; token: string | null }>) => {
      state.status = action.payload.status;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.email = action.payload.user?.email || "";
      state.isLoading = false;
      state.error = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
