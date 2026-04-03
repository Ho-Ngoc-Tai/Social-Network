// Auth
export const NEXT_USER_INFO_ENDPOINT = "/api/user/profile";
export const NEXT_LOGIN_ENDPOINT = "/api/auth/login";
export const NEXT_REGISTER_ENDPOINT = "/api/auth/register";
export const NEXT_CURRENT_USER_ENDPOINT = "/api/auth/me";

// Feed
export const NEXT_FEED_LIST_ENDPOINT = "/api/posts";
export const NEXT_FEED_CREATE_ENDPOINT = "/api/posts";
export const NEXT_FEED_DETAIL_ENDPOINT = (id: string) => `/api/posts/${id}`;
export const NEXT_FEED_UPDATE_ENDPOINT = (id: string) => `/api/posts/${id}`;
export const NEXT_FEED_DELETE_ENDPOINT = (id: string) => `/api/posts/${id}`;

// Post
export const NEXT_POST_LIST_ENDPOINT = "/api/posts";
export const NEXT_POST_CREATE_ENDPOINT = "/api/posts";
export const NEXT_POST_DETAIL_ENDPOINT = (id: string) => `/api/posts/${id}`;
export const NEXT_POST_UPDATE_ENDPOINT = (id: string) => `/api/posts/${id}`;
export const NEXT_POST_LIKE_ENDPOINT = (id: string) => `/api/posts/${id}/like`;
export const NEXT_POST_COMMENT_ENDPOINT = (id: string) => `/api/posts/${id}/comment`;

// User
export const NEXT_USER_PROFILE_ENDPOINT = (id: string) => `/api/user/${id}/profile`;
export const NEXT_USER_UPDATE_ENDPOINT = "/api/user/profile/update";
export const NEXT_USER_FOLLOW_ENDPOINT = (id: string) => `/api/user/${id}/follow`;
export const NEXT_USER_UNFOLLOW_ENDPOINT = (id: string) => `/api/user/${id}/unfollow`;
