import { put, takeLatest, call, select } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { feedActions } from "../../reducers/feed/feedSlice";
import { NEXT_FEED_LIST_ENDPOINT, NEXT_FEED_CREATE_ENDPOINT, NEXT_POST_LIKE_ENDPOINT, NEXT_POST_COMMENT_ENDPOINT, NEXT_UPLOAD_IMAGE_ENDPOINT } from "../../../routes/next.api";
import { UploadImageResponse } from "../../../types/upload/upload";
import { Post } from "../../../types/post/post";

// API Response Types
interface FeedListResponse {
  data: {
    items: Post[];
    hasMore: boolean;
  };
  message: string;
}

interface CreatePostResponse {
  data: Post;
  message: string;
}

interface LikePostResponse {
  data: {
    liked: boolean;
  };
  message: string;
}

interface CommentPostResponse {
  data: {
    id: string;
    content: string;
    post_id: string;
    parent: string | null;
    author: {
      id: string;
      full_name: string;
      username: string;
      avatar: string | null;
    };
    created_at: string;
  };
  message: string;
}

// API calls
async function loadFeedApi(params: { page?: number; limit?: number; authorId?: string }): Promise<FeedListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.authorId) searchParams.append('author', params.authorId);
  
  const url = `${NEXT_FEED_LIST_ENDPOINT}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
  if (!response.ok) {
    // Debug exact status first
    
    // Try to parse error safely
    let errorData: Record<string, unknown> = {};
    try {
      errorData = await response.json();
    } catch {
      errorData = { 
        error: `HTTP error! status: ${response.status}`,
        message: `Failed to load feed: ${response.status}`
      };
    }
    
    // Auto-logout on 401 OR if error contains 401
    if (response.status === 401 || (typeof errorData.error === 'string' && errorData.error.includes('401'))) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    
    throw new Error((errorData as { message?: string }).message || `Failed to load feed: ${response.status}`);
  }
  
  return await response.json();
} catch (fetchError) {
  throw fetchError;
}
}

async function createPostApi(content: string, image?: string, files?: string[]): Promise<CreatePostResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  try {
    const body: { content: string; status: string; image?: string; files?: string[] } = { content, status: 'published' };
    if (image) body.image = image;
    if (files && files.length > 0) body.files = files;

    const response = await fetch(NEXT_FEED_CREATE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorData: unknown = await response.json().catch(() => ({}));
      const message = (() => {
        if (!errorData || typeof errorData !== 'object') return null;
        const ed = errorData as Record<string, unknown>;
        if (typeof ed.message === 'string' && ed.message) return ed.message;
        if (ed.details && typeof ed.details === 'object') {
          const nested = ed.details as Record<string, unknown>;
          if (typeof nested.message === 'string' && nested.message) return nested.message;
          if (nested.error && typeof nested.error === 'object') {
            const deeper = nested.error as Record<string, unknown>;
            if (typeof deeper.message === 'string' && deeper.message) return deeper.message;
          }
        }
        return null;
      })();

      const detailsStr = (() => {
        try {
          return JSON.stringify(errorData);
        } catch {
          return '';
        }
      })();

      throw new Error(message || `Failed to create post: ${response.status}${detailsStr ? ` | ${detailsStr}` : ''}`);
    }
    
    return await response.json();
  } catch (fetchError) {
    throw fetchError;
  }
}

async function likePostApi(postId: string): Promise<LikePostResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  try {
    const response = await fetch(NEXT_POST_LIKE_ENDPOINT(postId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({ status: true }), // true = like, false = unlike
    });
    
    if (!response.ok) {
      const errorData: unknown = await response.json().catch(() => ({}));
      const message = (() => {
        if (!errorData || typeof errorData !== 'object') return null;
        const ed = errorData as Record<string, unknown>;
        if (typeof ed.message === 'string' && ed.message) return ed.message;
        return null;
      })();

      throw new Error(message || `Failed to toggle like: ${response.status}`);
    }
    
    return await response.json();
  } catch (fetchError) {
    throw fetchError;
  }
}

// Saga workers
function* loadFeedWorker(action: PayloadAction<{ page?: number; limit?: number; authorId?: string }>) {
  try {
    const response: FeedListResponse = yield call(loadFeedApi, action.payload);
    
    yield put(feedActions.loadFeedSucceeded({
      items: response.data.items,
      hasMore: response.data.hasMore,
      page: action.payload.page || 1,
    }));
    
  } catch (error) {
    yield put(feedActions.loadFeedFailed({
      error: error instanceof Error ? error.message : 'Failed to load feed',
    }));
  }
}

function* createPostWorker(action: PayloadAction<{ content: string; image?: string; files?: string[] }>) {
  try {
    const response: CreatePostResponse = yield call(
      createPostApi, 
      action.payload.content,
      action.payload.image,
      action.payload.files
    );
    
    yield put(feedActions.createPostSucceeded({
      post: response.data,
    }));
    
  } catch (error) {
    yield put(feedActions.createPostFailed({
      error: error instanceof Error ? error.message : 'Failed to create post',
    }));
  }
}

function* likePostWorker(action: PayloadAction<{ postId: string }>) {
  try {
    const response: LikePostResponse = yield call(likePostApi, action.payload.postId);
    
    // Get current post from store to calculate proper count
    const currentPost: Post | undefined = yield select((state: { feed: { items: Post[] } }) => 
      state.feed.items.find(p => p.id === action.payload.postId)
    );
    
    const currentCount = currentPost?.likes_count || 0;
    const newCount = response.data.liked ? currentCount + 1 : Math.max(0, currentCount - 1);
    
    yield put(feedActions.likePostSucceeded({
      postId: action.payload.postId,
      liked: response.data.liked,
      likesCount: newCount,
    }));
    
  } catch (error) {
    yield put(feedActions.likePostFailed({
      postId: action.payload.postId,
      error: error instanceof Error ? error.message : 'Failed to toggle like',
    }));
  }
}

async function commentPostApi(postId: string, content: string): Promise<CommentPostResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  try {
    const response = await fetch(NEXT_POST_COMMENT_ENDPOINT(postId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorData: unknown = await response.json().catch(() => ({}));
      const message = (() => {
        if (!errorData || typeof errorData !== 'object') return null;
        const ed = errorData as Record<string, unknown>;
        if (typeof ed.message === 'string' && ed.message) return ed.message;
        return null;
      })();

      throw new Error(message || `Failed to comment: ${response.status}`);
    }

    return await response.json();
  } catch (fetchError) {
    throw fetchError;
  }
}

// Upload image API
async function uploadImageApi(file: File): Promise<UploadImageResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(NEXT_UPLOAD_IMAGE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // Don't set Content-Type - browser will set it with boundary for multipart
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to upload image: ${response.status}`);
  }

  return response.json();
}

function* uploadImageWorker(action: PayloadAction<{ file: File }>) {
  try {
    const response: UploadImageResponse = yield call(uploadImageApi, action.payload.file);
    yield put(feedActions.uploadImageSucceeded({
      url: response.data.url,
      filename: response.data.filename,
    }));
  } catch (error) {
    yield put(feedActions.uploadImageFailed({
      error: error instanceof Error ? error.message : 'Failed to upload image',
    }));
  }
}

function* commentPostWorker(action: PayloadAction<{ postId: string; content: string }>) {
  try {
    const response: CommentPostResponse = yield call(commentPostApi, action.payload.postId, action.payload.content);

    yield put(feedActions.commentPostSucceeded({
      postId: action.payload.postId,
      comment: response.data,
    }));

  } catch (error) {
    yield put(feedActions.commentPostFailed({
      postId: action.payload.postId,
      error: error instanceof Error ? error.message : 'Failed to create comment',
    }));
  }
}

export function* feedSaga() {
  yield takeLatest(feedActions.loadFeedRequested.type, loadFeedWorker);
  yield takeLatest(feedActions.createPostRequested.type, createPostWorker);
  yield takeLatest(feedActions.likePostRequested.type, likePostWorker);
  yield takeLatest(feedActions.commentPostRequested.type, commentPostWorker);
  yield takeLatest(feedActions.uploadImageRequested.type, uploadImageWorker);
}
