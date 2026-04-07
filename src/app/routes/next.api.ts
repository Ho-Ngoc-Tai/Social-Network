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
export const NEXT_POST_COMMENT_ENDPOINT = (id: string) => `/api/posts/${id}/comments`;

// User
export const NEXT_USER_PROFILE_ENDPOINT = (id: string) => `/api/users/${id}/profile`;
export const NEXT_USER_UPDATE_ENDPOINT = "/api/user/profile/update";
export const NEXT_USER_FRIEND_ENDPOINT = (id: string) => `/api/users/${id}/friend`;
export const NEXT_USER_UNFRIEND_ENDPOINT = (id: string) => `/api/users/${id}/unfriend`;

// Friends
export const NEXT_FRIENDS_LIST_ENDPOINT = "/api/users/friends";

// Chat
export const NEXT_CONVERSATIONS_ENDPOINT = "/api/conversations";
export const NEXT_OPEN_CONVERSATION_ENDPOINT = "/api/conversations/open";
export const NEXT_CONVERSATION_MESSAGES_ENDPOINT = (userId: string) => `/api/conversations/thread/${userId}/messages`;
export const NEXT_SEND_MESSAGE_ENDPOINT = "/api/conversations/messages";
export const NEXT_MARK_AS_READ_ENDPOINT = (userId: string) => `/api/conversations/thread/${userId}/read`;

// Notifications
export const NEXT_NOTIFICATIONS_ENDPOINT = "/api/notifications";
export const NEXT_NOTIFICATIONS_UNREAD_COUNT_ENDPOINT = "/api/notifications/unread-count";
