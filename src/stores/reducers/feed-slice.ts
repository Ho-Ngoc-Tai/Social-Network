import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeedItem } from '@/types';

interface FeedState {
  items: FeedItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  nextCursor?: string;
  refreshing: boolean;
}

const initialState: FeedState = {
  items: [],
  loading: false,
  error: null,
  hasMore: true,
  nextCursor: undefined,
  refreshing: false,
};

export const feedReducer = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    fetchFeedStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFeedSuccess: (state, action: PayloadAction<{ items: FeedItem[]; hasMore: boolean; nextCursor?: string }>) => {
      state.loading = false;
      state.error = null;
      state.items = action.payload.items;
      state.hasMore = action.payload.hasMore;
      state.nextCursor = action.payload.nextCursor;
    },
    fetchFeedFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    loadMoreFeedStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loadMoreFeedSuccess: (state, action: PayloadAction<{ items: FeedItem[]; hasMore: boolean; nextCursor?: string }>) => {
      state.loading = false;
      state.error = null;
      state.items = [...state.items, ...action.payload.items];
      state.hasMore = action.payload.hasMore;
      state.nextCursor = action.payload.nextCursor;
    },
    refreshFeedStart: (state) => {
      state.refreshing = true;
      state.error = null;
    },
    refreshFeedSuccess: (state, action: PayloadAction<{ items: FeedItem[]; hasMore: boolean; nextCursor?: string }>) => {
      state.refreshing = false;
      state.error = null;
      state.items = action.payload.items;
      state.hasMore = action.payload.hasMore;
      state.nextCursor = action.payload.nextCursor;
    },
    likePostInFeed: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.post.id === action.payload);
      if (item) {
        item.post.isLiked = !item.post.isLiked;
        item.post.likesCount += item.post.isLiked ? 1 : -1;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchFeedStart,
  fetchFeedSuccess,
  fetchFeedFailure,
  loadMoreFeedStart,
  loadMoreFeedSuccess,
  refreshFeedStart,
  refreshFeedSuccess,
  likePostInFeed,
  clearError,
} = feedReducer.actions;
