// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export interface AuthUser extends User {
  token: string;
}

// Post Types
export interface Post {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  images?: string[];
}

export interface CreatePostInput {
  content: string;
  images?: string[];
}

export interface UpdatePostInput {
  content?: string;
  images?: string[];
}

// Comment Types
export interface Comment {
  id: string;
  content: string;
  author: User;
  post: Post;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  isLiked: boolean;
  replies?: Comment[];
}

export interface CreateCommentInput {
  content: string;
  postId: string;
  parentCommentId?: string;
}

// Like Types
export interface Like {
  id: string;
  user: User;
  post?: Post;
  comment?: Comment;
  createdAt: string;
}

// Feed Types
export interface FeedItem {
  post: Post;
  timestamp: string;
}

export interface FeedResponse {
  items: FeedItem[];
  hasMore: boolean;
  nextCursor?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION';
  user: User;
  post?: Post;
  comment?: Comment;
  isRead: boolean;
  createdAt: string;
}

// Search Types
export interface SearchResult {
  users: User[];
  posts: Post[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface SearchFilters {
  type?: 'users' | 'posts' | 'all';
  limit?: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

// GraphQL Types
export interface GraphQLResponse<T> {
  data?: T;
  errors?: ApiError[];
}

// Redux State Types
export interface RootState {
  auth: AuthState;
  posts: PostsState;
  feed: FeedState;
  profile: ProfileState;
  notifications: NotificationsState;
  ui: UIState;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface PostsState {
  posts: Record<string, Post>;
  loading: boolean;
  error: string | null;
  creating: boolean;
}

export interface FeedState {
  items: FeedItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  nextCursor?: string;
  refreshing: boolean;
}

export interface ProfileState {
  profile: User | null;
  loading: boolean;
  error: string | null;
  posts: Post[];
  followers: User[];
  following: User[];
}

export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  loading: boolean;
}

// Pagination Types
export interface PaginationParams {
  limit?: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  hasMore: boolean;
  nextCursor?: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileForm {
  name?: string;
  bio?: string;
  avatar?: string;
}
