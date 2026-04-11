import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfileData, UserPost, UserFriendStatus } from "../../../types/profile/profile";

export interface ProfileState {
  user: UserProfileData | null;
  posts: UserPost[];
  friendStatus: UserFriendStatus | null;
  isLoading: boolean;
  updateLoading: boolean;
  error: string | null;
  updateError: string | null;
}

const initialState: ProfileState = {
  user: null,
  posts: [],
  friendStatus: null,
  isLoading: false,
  updateLoading: false,
  error: null, 
  updateError: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    loadProfileRequested: (state, _action: PayloadAction<{ userId: string; page?: number; limit?: number }>) => {
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
    updateProfileRequested: (state, _action: PayloadAction<{ userId: string; data: Partial<UserProfileData> }>) => {
      state.updateLoading = true;
      state.updateError = null;
    },
    updateProfileSucceeded: (state, action: PayloadAction<{ user: UserProfileData }>) => {
      state.user = action.payload.user;
      state.updateLoading = false;
      state.updateError = null;
    },
    updateProfileFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.updateLoading = false;
      state.updateError = action.payload.error;
    },
    // Reload only friend status
    reloadFriendStatusRequested: (state, _action: PayloadAction<{ userId: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    reloadFriendStatusSucceeded: (state, action: PayloadAction<{ friend: UserFriendStatus }>) => {
      state.friendStatus = action.payload.friend;
      state.isLoading = false;
      state.error = null;
    },
    reloadFriendStatusFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.isLoading = false;
      state.error = action.payload.error;
    },
    deleteProfilePost: (state, action: PayloadAction<{ postId: string }>) => {
      state.posts = state.posts.filter(post => post.id !== action.payload.postId);
    },
    updateProfilePost: (state, action: PayloadAction<{ postId: string; content: string }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.content = action.payload.content;
      }
    },
  },
});

export const profileActions = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
