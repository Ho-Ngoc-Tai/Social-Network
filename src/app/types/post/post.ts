export interface User {
  id: string;
  full_name: string;
  username: string;
  avatar: string | null;
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
}
