import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { User } from "@/types/user";
import type { Post } from "@/types/post";

export interface ProfileState {
  user: User | null;
  posts: Post[];
  isLoading: boolean;
}

const initialState: ProfileState = {
  user: null,
  posts: [],
  isLoading: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    loadProfileRequested: (state, action: PayloadAction<{ id: string }>) => {
      state.isLoading = true;
      void action.payload;
    },
    loadProfileSucceeded: (
      state,
      action: PayloadAction<{ user: User; posts: Post[] }>,
    ) => {
      state.user = action.payload.user;
      state.posts = action.payload.posts;
      state.isLoading = false;
    },
  },
});

export const profileActions = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
