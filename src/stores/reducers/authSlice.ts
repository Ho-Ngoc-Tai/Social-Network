import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthStatus = "anonymous" | "authenticated";

export interface AuthState {
  status: AuthStatus;
  email: string | null;
}

const initialState: AuthState = {
  status: "anonymous",
  email: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequested: (state, action: PayloadAction<{ email: string }>) => {
      state.status = "authenticated";
      void action.payload;
    },
    logoutRequested: (state) => {
      state.status = "anonymous";
      state.email = null;
    },
    sessionHydrated: (state, action: PayloadAction<{ status: AuthStatus; email: string | null }>) => {
      state.status = action.payload.status;
      state.email = action.payload.email;
    },
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
