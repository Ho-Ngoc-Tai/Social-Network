import type { Post } from "../../../types/post/post";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FeedState {
  items: Post[];
  isLoading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
  hasMore: boolean;
  currentPage: number;
}

const initialState: FeedState = {
  items: [],
  isLoading: false,
  error: null,
  createLoading: false,
  createError: null,
  hasMore: true,
  currentPage: 1,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    loadFeedRequested: (state, _action: PayloadAction<{ page?: number; limit?: number; authorId?: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    loadFeedSucceeded: (state, action: PayloadAction<{ items: Post[]; hasMore: boolean; page: number }>) => {
      if (action.payload.page === 1) {
        // First page - replace items
        state.items = action.payload.items;
      } else {
        // Additional pages - append items, deduplicate by id
        const existingIds = new Set(state.items.map(item => item.id));
        const newItems = action.payload.items.filter(item => !existingIds.has(item.id));
        state.items = [...state.items, ...newItems];
      }
      state.hasMore = action.payload.hasMore;
      state.currentPage = action.payload.page;
      state.isLoading = false;
    },
    loadFeedFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.error = action.payload.error;
      state.isLoading = false;
    },
    createPostRequested: (state, _action: PayloadAction<{ content: string }>) => {
      state.createLoading = true;
      state.createError = null;
    },
    createPostSucceeded: (state, action: PayloadAction<{ post: Post }>) => {
      state.items = [action.payload.post, ...state.items];
      state.createLoading = false;
    },
    createPostFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.createError = action.payload.error;
      state.createLoading = false;
    },
  },
});

export const feedActions = feedSlice.actions;
export const feedReducer = feedSlice.reducer;
