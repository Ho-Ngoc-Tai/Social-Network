import { put, takeLatest, call } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { feedActions } from "../../reducers/feed/feedSlice";
import { NEXT_FEED_LIST_ENDPOINT, NEXT_FEED_CREATE_ENDPOINT } from "../../../routes/next.api";
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

// API calls
async function loadFeedApi(params: { page?: number; limit?: number; authorId?: string }): Promise<FeedListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.authorId) searchParams.append('authorId', params.authorId);
  
  const url = `${NEXT_FEED_LIST_ENDPOINT}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  console.log('Feed API Debug:', {
    url,
    token: token ? `${token.substring(0, 20)}...` : 'null',
    tokenLength: token?.length || 0,
    params,
    localStorage: typeof window !== 'undefined' ? {
      accessToken: localStorage.getItem('accessToken') ? 'exists' : 'null',
      keys: Object.keys(localStorage)
    } : 'server-side'
  });
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    console.log('Feed API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      headers: Object.fromEntries(response.headers.entries()),
      ok: response.ok
    });
    
    console.log('About to check response.ok:', response.ok);
  
  if (!response.ok) {
    // Debug exact status first
    console.log('Response Status Debug:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url
    });
    
    // Try to parse error safely
    let errorData: Record<string, unknown> = {};
    try {
      errorData = await response.json();
    } catch (jsonError) {
      console.error('JSON Parse Error:', jsonError);
      errorData = { 
        error: `HTTP error! status: ${response.status}`,
        message: `Failed to load feed: ${response.status}`
      };
    }
    
    console.error('Feed API Error:', errorData);
    
    // Debug response status vs errorData
    console.log('Status Comparison:', {
      responseStatus: response.status,
      errorDataError: errorData.error,
      errorDataMessage: (errorData as { message?: string }).message,
      isStatus401: response.status === 401,
      errorContains401: typeof errorData.error === 'string' && errorData.error.includes('401')
    });
    
    // Auto-logout on 401 OR if error contains 401
    if (response.status === 401 || (typeof errorData.error === 'string' && errorData.error.includes('401'))) {
      console.log('Token expired, logging out...');
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
  console.error('Fetch Error:', fetchError);
  throw fetchError;
}
}

async function createPostApi(content: string): Promise<CreatePostResponse> {
  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  try {
    const response = await fetch(NEXT_FEED_CREATE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create post: ${response.status}`);
    }
    
    return await response.json();
  } catch (fetchError) {
    console.error('Create Post Fetch Error:', fetchError);
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

function* createPostWorker(action: PayloadAction<{ content: string }>) {
  try {
    const response: CreatePostResponse = yield call(createPostApi, action.payload.content);
    
    yield put(feedActions.createPostSucceeded({
      post: response.data,
    }));
    
  } catch (error) {
    yield put(feedActions.createPostFailed({
      error: error instanceof Error ? error.message : 'Failed to create post',
    }));
  }
}

export function* feedSaga() {
  yield takeLatest(feedActions.loadFeedRequested.type, loadFeedWorker);
  yield takeLatest(feedActions.createPostRequested.type, createPostWorker);
}
