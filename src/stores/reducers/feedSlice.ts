import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { Post } from "@/types/post";

export interface FeedState {
  items: Post[];
  isLoading: boolean;
}

const initialState: FeedState = {
  items: [],
  isLoading: false,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    loadFeedRequested: (state) => {
      state.isLoading = true;
    },
    loadFeedSucceeded: (state, action: PayloadAction<{ items: Post[] }>) => {
      state.items = action.payload.items;
      state.isLoading = false;
    },
    createPostRequested: (state, action: PayloadAction<{ content: string }>) => {
      state.isLoading = true;
      void action.payload;
    },
    createPostSucceeded: (state, action: PayloadAction<{ post: Post }>) => {
      state.items = [action.payload.post, ...state.items];
      state.isLoading = false;
    },
  },
});

export const feedActions = feedSlice.actions;
export const feedReducer = feedSlice.reducer;
