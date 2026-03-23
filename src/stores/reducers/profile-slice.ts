import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Post } from '@/types';

interface ProfileState {
  profile: User | null;
  loading: boolean;
  error: string | null;
  posts: Post[];
  followers: User[];
  following: User[];
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  posts: [],
  followers: [],
  following: [],
};

export const profileReducer = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    fetchProfileStart: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    fetchProfileSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.error = null;
      state.profile = action.payload;
    },
    fetchProfileFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchProfilePostsSuccess: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    fetchProfileFollowersSuccess: (state, action: PayloadAction<User[]>) => {
      state.followers = action.payload;
    },
    fetchProfileFollowingSuccess: (state, action: PayloadAction<User[]>) => {
      state.following = action.payload;
    },
    followUser: (state, action: PayloadAction<string>) => {
      if (state.profile && state.profile.id !== action.payload) {
        state.profile.followersCount += 1;
      }
    },
    unfollowUser: (state, action: PayloadAction<string>) => {
      if (state.profile && state.profile.id !== action.payload) {
        state.profile.followersCount -= 1;
      }
    },
    clearProfile: (state) => {
      state.profile = null;
      state.posts = [];
      state.followers = [];
      state.following = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  fetchProfilePostsSuccess,
  fetchProfileFollowersSuccess,
  fetchProfileFollowingSuccess,
  followUser,
  unfollowUser,
  clearProfile,
  clearError,
} = profileReducer.actions;
