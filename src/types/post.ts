import type { User } from "@/types/user";

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: User;
  likesCount: number;
  commentsCount: number;
}
