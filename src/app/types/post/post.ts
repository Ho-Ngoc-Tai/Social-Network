export interface User {
  id: string;
  full_name: string;
  username: string;
  avatar: string | null;
}

export interface Comment {
  id: string;
  content: string;
  post_id?: string;
  parent: string | null;
  author: User;
  created_at: string;
  likes_count: number;
  replies_count?: number;
  is_liked?: boolean;
}

export interface Post {
  id: string;
  content: string;
  image: string | null;
  files: string[];
  author: User;
  likes_count: number;
  comments_count: number;
  status: string;
  created_at: string;
  comments?: Comment[];
}
