import type { Post, Comment } from "../../../types/post/post";
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
    deletePostSucceeded: (state, action: PayloadAction<{ postId: string }>) => {
      state.items = state.items.filter(item => item.id !== action.payload.postId);
    },
    updatePostSucceeded: (state, action: PayloadAction<{ postId: string; content: string }>) => {
      const post = state.items.find(p => p.id === action.payload.postId);
      if (post) {
        post.content = action.payload.content;
      }
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
    commentPostRequested: (state, action: PayloadAction<{ postId: string; content: string; parentId?: string; tempId?: string }>) => {
      state.commentLoading[action.payload.postId] = true;
      state.commentError = null;
      // Add optimistic comment with tempId if provided
      if (action.payload.tempId) {
        const post = state.items.find(p => p.id === action.payload.postId);
        if (post) {
          if (!post.comments) post.comments = [];
          post.comments.unshift({
            id: action.payload.tempId,
            content: action.payload.content,
            author: { id: 'current-user', full_name: 'You', username: 'you', avatar: null },
            created_at: new Date().toISOString(),
            likes_count: 0,
            replies_count: 0,
            parent: action.payload.parentId || null,
          });
        }
      }
    },
    commentPostSucceeded: (state, action: PayloadAction<{ postId: string; comment: Comment; tempId?: string }>) => {
      const post = state.items.find(p => p.id === action.payload.postId);
      if (post) {
        post.comments_count += 1;
        if (!post.comments) post.comments = [];
        
        // If tempId provided, replace temp comment with real one
        if (action.payload.tempId) {
          const tempIndex = post.comments.findIndex((c: Comment) => c.id === action.payload.tempId);
          if (tempIndex >= 0) {
            post.comments[tempIndex] = { ...action.payload.comment, parent: post.comments[tempIndex].parent };
          } else {
            post.comments.unshift(action.payload.comment);
          }
        } else {
          post.comments.unshift(action.payload.comment);
        }
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
    uploadImageSucceeded: (state, action: PayloadAction<{ url: string }>) => {
      state.uploadedImageUrl = action.payload.url;
      state.uploadImageLoading = false;
      state.uploadImageError = null;
    },
    uploadImageFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.uploadImageLoading = false;
      state.uploadImageError = action.payload.error;
    },
    loadPostDetailRequested: (state, _action: PayloadAction<{ postId: string }>) => {
      state.commentLoading[_action.payload.postId] = true;
    },
    loadPostDetailSucceeded: (state, action: PayloadAction<{ postId: string; comments: Comment[] }>) => {
      const post = state.items.find(p => p.id === action.payload.postId);
      if (post) {
        // Merge with localStorage cache for parent info
        let mergedComments = action.payload.comments;
        if (typeof window !== 'undefined') {
          try {
            const cache = JSON.parse(localStorage.getItem('comment_parents') || '{}');
            const postCache = cache[action.payload.postId] || {};
            mergedComments = action.payload.comments.map((c: Comment) => ({
              ...c,
              parent: postCache[c.id] !== undefined ? postCache[c.id] : c.parent
            }));
          } catch {
            // ignore
          }
        }
        post.comments = mergedComments;
      }
      state.commentLoading[action.payload.postId] = false;
    },
    loadPostDetailFailed: (state, action: PayloadAction<{ postId: string; error: string }>) => {
      state.commentLoading[action.payload.postId] = false;
    },
  },
});

export const feedActions = feedSlice.actions;
export const feedReducer = feedSlice.reducer;
