export interface UserProfileData {
  id: string;
  username: string;
  email: string;
  full_name: string;
  status: string;
  created_at: string;
  profile: {
    address: string | null;
    gender: string | null;
    phone: string | null;
  };
}

export interface UserPost {
  id: string;
  content: string;
  image: string | null;
  files: string[];
  author: {
    id: string;
    full_name: string;
    username: string;
    avatar: string | null;
  };
  status: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
}

export interface UserFriendStatus {
  is_friend: boolean;
  status: string | null; // "pending", "accepted", etc.
  blocked_by_me: boolean;
  blocked_by_them: boolean;
}

export interface UserProfileResponse {
  data: {
    user: UserProfileData;
    posts: UserPost[];
    friend: UserFriendStatus;
  };
  message: string;
}
