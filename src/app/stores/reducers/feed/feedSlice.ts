import type { Post } from "../../../types/post/post";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FeedState {
  items: Post[];
  isLoading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
  createSuccess: boolean;
  likeLoading: Record<string, boolean>;
  likeError: string | null;
  commentLoading: Record<string, boolean>;
  commentError: string | null;
  uploadImageLoading: boolean;
  uploadImageError: string | null;
  uploadedImageUrl: string | null;
  hasMore: boolean;
  currentPage: number;
}

const initialState: FeedState = {
  items: [],
  isLoading: false,
  error: null,
  createLoading: false,
  createError: null,
  createSuccess: false,
  likeLoading: {},
  likeError: null,
  commentLoading: {},
  commentError: null,
  uploadImageLoading: false,
  uploadImageError: null,
  uploadedImageUrl: null,
  hasMore: true,
  currentPage: 1,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadFeedRequested: (state, _action: PayloadAction<{ page?: number; limit?: number }>) => {
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
    createPostRequested: (state, _action: PayloadAction<{ content: string; image?: string; files?: string[] }>) => {
      state.createLoading = true;
      state.createError = null;
      state.createSuccess = false;
    },
    createPostSucceeded: (state, action: PayloadAction<{ post: Post }>) => {
      state.items = [action.payload.post, ...state.items];
      state.createLoading = false;
      state.createSuccess = true;
    },
    createPostFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.createError = action.payload.error;
      state.createLoading = false;
      state.createSuccess = false;
    },
    resetCreateState: (state) => {
      state.createSuccess = false;
      state.createError = null;
      state.uploadedImageUrl = null;
    },
    likePostRequested: (state, action: PayloadAction<{ postId: string }>) => {
      state.likeLoading[action.payload.postId] = true;
      state.likeError = null;
    },
    likePostSucceeded: (state, action: PayloadAction<{ postId: string; liked: boolean; likesCount: number }>) => {
      const post = state.items.find(p => p.id === action.payload.postId);
      if (post) {
        post.likes_count = action.payload.likesCount;
      }
      state.likeLoading[action.payload.postId] = false;
    },
    likePostFailed: (state, action: PayloadAction<{ postId: string; error: string }>) => {
      state.likeLoading[action.payload.postId] = false;
      state.likeError = action.payload.error;
    },
    commentPostRequested: (state, action: PayloadAction<{ postId: string; content: string }>) => {
      state.commentLoading[action.payload.postId] = true;
      state.commentError = null;
    },
    commentPostSucceeded: (state, action: PayloadAction<{ postId: string; comment: { id: string; content: string; author: { id: string; full_name: string; avatar: string | null }; created_at: string } }>) => {
      const post = state.items.find(p => p.id === action.payload.postId);
      if (post) {
        post.comments_count += 1;
      }
      state.commentLoading[action.payload.postId] = false;
    },
    commentPostFailed: (state, action: PayloadAction<{ postId: string; error: string }>) => {
      state.commentLoading[action.payload.postId] = false;
      state.commentError = action.payload.error;
    },
    uploadImageRequested: (state, _action: PayloadAction<{ file: File }>) => {
      state.uploadImageLoading = true;
      state.uploadImageError = null;
    },
    uploadImageSucceeded: (state, action: PayloadAction<{ url: string; filename: string }>) => {
      state.uploadedImageUrl = action.payload.url;
      state.uploadImageLoading = false;
      state.uploadImageError = null;
    },
    uploadImageFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.uploadImageLoading = false;
      state.uploadImageError = action.payload.error;
    },
  },
});

export const feedActions = feedSlice.actions;
export const feedReducer = feedSlice.reducer;
