export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'post';
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
  actor?: {
    id: string;
    full_name: string;
    avatar: string | null;
  };
  target?: {
    id: string;
    type: 'post' | 'comment' | 'user';
  };
}

export interface NotificationsResponse {
  data: {
    items: Notification[];
    next_cursor: string | null;
    has_more: boolean;
  };
  message: string;
}
