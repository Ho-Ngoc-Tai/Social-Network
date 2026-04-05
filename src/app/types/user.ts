export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  headline?: string;
  bio?: string;
  stats?: {
    posts: number;
    followers: number;
    following: number;
  };
}
