import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Friend } from "../../../types/friend/friend";

interface FriendsState {
  friends: Friend[];
  isLoading: boolean;
  isSendingRequest: boolean;
  error: string | null;
}

const initialState: FriendsState = {
  friends: [],
  isLoading: false,
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
  },
});

export const friendsActions = friendsSlice.actions;
export const friendsReducer = friendsSlice.reducer;
