export interface FriendUser {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar: string | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  avatar: string | null;
  status: 'ACTIVE' | 'INACTIVE' | string;
  created_at: string;
  profile: {
    address?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    phone?: string;
  };
}

export interface Friend {
  id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  updated_at: string;
  in_user: FriendUser;
  out_user: FriendUser;
}

export interface PendingFriendRequest {
  id: string;
  status: 'pending';
  created_at: string;
  updated_at: string;
  in_user: FriendUser;
  out_user: FriendUser;
}

export interface LoadFriendsResponse {
  data: Friend[];
  message: string;
}

export interface LoadPendingRequestsResponse {
  data: PendingFriendRequest[];
  message: string;
}

export interface LoadUsersResponse {
  data: User[];
  message: string;
}

export interface BlockedUser {
  id: string;
  in_user: FriendUser;
  out_user: FriendUser;
  created_at: string;
}

export interface LoadBlockedResponse {
  data: BlockedUser[];
  message: string;
}

export interface UnblockResponse {
  data: {
    success: boolean;
  };
  message: string;
}

export interface SendFriendRequestResponse {
  data: {
    id: string;
    status: 'pending';
    created_at: string;
    updated_at: string;
    in: string;
    out: string;
  };
  message: string;
}
