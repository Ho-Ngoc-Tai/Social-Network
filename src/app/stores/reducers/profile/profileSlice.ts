import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfileData, UserPost, UserFriendStatus } from "../../../types/profile/profile";

export interface ProfileState {
  user: UserProfileData | null;
  posts: UserPost[];
  friendStatus: UserFriendStatus | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  user: null,
  posts: [],
  friendStatus: null,
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    loadProfileRequested: (state, action: PayloadAction<{ userId: string; page?: number; limit?: number }>) => {
      state.isLoading = true;
      state.error = null;
    },
    loadProfileSucceeded: (
      state,
      action: PayloadAction<{ user: UserProfileData; posts: UserPost[]; friend: UserFriendStatus }>,
    ) => {
      state.user = action.payload.user;
      state.posts = action.payload.posts;
      state.friendStatus = action.payload.friend;
      state.isLoading = false;
      state.error = null;
    },
    loadProfileFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.isLoading = false;
      state.error = action.payload.error;
    },
  },
});

export const profileActions = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
