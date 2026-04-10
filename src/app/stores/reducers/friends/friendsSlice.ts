import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Friend, PendingFriendRequest, BlockedUser, User } from "../../../types/friends/friends";

interface FriendsState {
  friends: Friend[];
  pendingRequests: PendingFriendRequest[];
  blockedUsers: BlockedUser[];
  users: User[];
  isLoading: boolean;
  isLoadingPending: boolean;
  isLoadingBlocked: boolean;
  isLoadingUsers: boolean;
  isSendingRequest: boolean;
  error: string | null;
}

const initialState: FriendsState = {
  friends: [],
  pendingRequests: [],
  blockedUsers: [],
  users: [],
  isLoading: false,
  isLoadingPending: false,
  isLoadingBlocked: false,
  isLoadingUsers: false,
  isSendingRequest: false,
  error: null,
};

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    loadFriendsRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loadFriendsSucceeded: (state, action: PayloadAction<{ friends: Friend[] }>) => {
      state.friends = action.payload.friends;
      state.isLoading = false;
      state.error = null;
    },
    loadFriendsFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.isLoading = false;
      state.error = action.payload.error;
    },
    // Send friend request
    sendFriendRequestRequested: (state, _action: PayloadAction<{ userId: string }>) => {
      state.isSendingRequest = true;
      state.error = null;
    },
    sendFriendRequestSucceeded: (state) => {
      state.isSendingRequest = false;
      state.error = null;
    },
    sendFriendRequestFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.isSendingRequest = false;
      state.error = action.payload.error;
    },
    // Load pending friend requests
    loadPendingRequestsRequested: (state) => {
      state.isLoadingPending = true;
      state.error = null;
    },
    loadPendingRequestsSucceeded: (state, action: PayloadAction<{ pendingRequests: PendingFriendRequest[] }>) => {
      state.pendingRequests = action.payload.pendingRequests;
      state.isLoadingPending = false;
      state.error = null;
    },
    loadPendingRequestsFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.isLoadingPending = false;
      state.error = action.payload.error;
    },
    // Accept friend request (using same sendFriendRequestRequested but different UI)
    acceptFriendRequestRequested: (state, _action: PayloadAction<{ userId: string }>) => {
      state.isSendingRequest = true;
      state.error = null;
    },
    acceptFriendRequestSucceeded: (state) => {
      state.isSendingRequest = false;
      state.error = null;
    },
    acceptFriendRequestFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.isSendingRequest = false;
      state.error = action.payload.error;
    },
    // Reject/Cancel/Unfriend
    unfriendRequested: (state, _action: PayloadAction<{ userId: string }>) => {
      state.isSendingRequest = true;
      state.error = null;
    },
    unfriendSucceeded: (state) => {
      state.isSendingRequest = false;
      state.error = null;
    },
    unfriendFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.isSendingRequest = false;
      state.error = action.payload.error;
    },
    // Load blocked users
    loadBlockedRequested: (state) => {
      state.isLoadingBlocked = true;
      state.error = null;
    },
    loadBlockedSucceeded: (state, action: PayloadAction<{ blockedUsers: BlockedUser[] }>) => {
      state.blockedUsers = action.payload.blockedUsers;
      state.isLoadingBlocked = false;
      state.error = null;
    },
    loadBlockedFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.isLoadingBlocked = false;
      state.error = action.payload.error;
    },
    // Load all users
    loadUsersRequested: (state) => {
      state.isLoadingUsers = true;
      state.error = null;
    },
    loadUsersSucceeded: (state, action: PayloadAction<{ users: User[] }>) => {
      state.users = action.payload.users;
      state.isLoadingUsers = false;
      state.error = null;
    },
    loadUsersFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.isLoadingUsers = false;
      state.error = action.payload.error;
    },
    // Block user
    blockUserRequested: (state, _action: PayloadAction<{ userId: string }>) => {
      state.isSendingRequest = true;
      state.error = null;
    },
    blockUserSucceeded: (state) => {
      state.isSendingRequest = false;
      state.error = null;
    },
    blockUserFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.isSendingRequest = false;
      state.error = action.payload.error;
    },
    // Unblock user
    unblockUserRequested: (state, _action: PayloadAction<{ userId: string }>) => {
      state.isSendingRequest = true;
      state.error = null;
    },
    unblockUserSucceeded: (state) => {
      state.isSendingRequest = false;
      state.error = null;
    },
    unblockUserFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.isSendingRequest = false;
      state.error = action.payload.error;
    },
  },
});

export const friendsActions = friendsSlice.actions;
export const friendsReducer = friendsSlice.reducer;
