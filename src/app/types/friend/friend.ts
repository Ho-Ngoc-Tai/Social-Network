export interface Friend {
  id: string;
  username: string;
  email: string;
  full_name: string;
  avatar: string | null;
  status: string;
  created_at: string;
  profile?: {
    address: string | null;
    gender: string | null;
    phone: string | null;
  } | null;
}

export interface FriendsListResponse {
  data: Friend[];
  message: string;
}
