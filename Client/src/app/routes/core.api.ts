// Auth
export const CORE_USER_INFO_ENDPOINT = "user/profile";
export const CORE_LOGIN_ENDPOINT = "auth/login";
export const CORE_REGISTER_ENDPOINT = "auth/register";
export const CORE_CURRENT_USER_ENDPOINT = "auth/me";

// Feed
export const CORE_FEED_LIST_ENDPOINT = "posts";
export const CORE_FEED_CREATE_ENDPOINT = "posts";
export const CORE_FEED_DETAIL_ENDPOINT = (id: string) => `posts/${id}`;
export const CORE_FEED_UPDATE_ENDPOINT = (id: string) => `posts/${id}`;
export const CORE_FEED_DELETE_ENDPOINT = (id: string) => `posts/${id}`;

// Post
export const CORE_POST_LIST_ENDPOINT = "posts";
export const CORE_POST_CREATE_ENDPOINT = "posts";
export const CORE_POST_DETAIL_ENDPOINT = (id: string) => `posts/${id}`;
export const CORE_POST_UPDATE_ENDPOINT = (id: string) => `posts/${id}`;
export const CORE_POST_LIKE_ENDPOINT = (id: string) => `posts/${id}/like`;
export const CORE_POST_COMMENT_ENDPOINT = (id: string) => `posts/${id}/comment`;

// User
export const CORE_USER_PROFILE_ENDPOINT = (id: string) => `user/${id}/profile`;
export const CORE_USER_UPDATE_ENDPOINT = "user/profile/update";
export const CORE_USER_FOLLOW_ENDPOINT = (id: string) => `user/${id}/follow`;
export const CORE_USER_UNFOLLOW_ENDPOINT = (id: string) => `user/${id}/unfollow`;
