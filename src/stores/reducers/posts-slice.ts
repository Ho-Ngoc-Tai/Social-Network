import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '@/types';

interface PostsState {
  posts: Record<string, Post>;
  loading: boolean;
  error: string | null;
  creating: boolean;
}

const initialState: PostsState = {
  posts: {},
  loading: false,
  error: null,
  creating: false,
};

export const postsReducer = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    fetchPostsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPostsSuccess: (state, action: PayloadAction<Post[]>) => {
      state.loading = false;
      state.error = null;
      action.payload.forEach((post) => {
        state.posts[post.id] = post;
      });
    },
    fetchPostsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    createPostStart: (state) => {
      state.creating = true;
      state.error = null;
    },
    createPostSuccess: (state, action: PayloadAction<Post>) => {
      state.creating = false;
      state.posts[action.payload.id] = action.payload;
    },
    createPostFailure: (state, action: PayloadAction<string>) => {
      state.creating = false;
      state.error = action.payload;
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      state.posts[action.payload.id] = action.payload;
    },
    deletePost: (state, action: PayloadAction<string>) => {
      delete state.posts[action.payload];
    },
    likePost: (state, action: PayloadAction<string>) => {
      const post = state.posts[action.payload];
      if (post) {
        post.isLiked = !post.isLiked;
        post.likesCount += post.isLiked ? 1 : -1;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  createPostStart,
  createPostSuccess,
  createPostFailure,
  updatePost,
  deletePost,
  likePost,
  clearError,
} = postsReducer.actions;
