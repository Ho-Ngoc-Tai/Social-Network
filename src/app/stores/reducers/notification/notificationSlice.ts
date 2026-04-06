import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from "../../../types/notification/notification";

export interface NotificationState {
  items: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  nextCursor: string | null;
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  hasMore: false,
  nextCursor: null,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    loadNotificationsRequested: (state, action: PayloadAction<{ limit?: number; cursor?: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    loadNotificationsSucceeded: (state, action: PayloadAction<{ items: Notification[]; has_more: boolean; next_cursor: string | null; unread_count?: number }>) => {
      // Deduplicate and merge new items
      const newItems = action.payload.items;
      const existingIds = new Set(state.items.map(item => item.id));
      const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
      
      state.items = [...uniqueNewItems, ...state.items];
      state.hasMore = action.payload.has_more;
      state.nextCursor = action.payload.next_cursor;
      state.unreadCount = action.payload.unread_count ?? uniqueNewItems.filter(n => !n.is_read).length;
      state.isLoading = false;
    },
    loadNotificationsFailed: (state, action: PayloadAction<{ error: string }>) => {
      state.isLoading = false;
      state.error = action.payload.error;
    },
    markNotificationReadRequested: (state, action: PayloadAction<{ notificationId: string }>) => {
      // Optimistic update
      const notification = state.items.find(n => n.id === action.payload.notificationId);
      if (notification && !notification.is_read) {
        notification.is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllNotificationsReadRequested: (state) => {
      // Optimistic update
      state.items.forEach(n => n.is_read = true);
      state.unreadCount = 0;
    },
    fetchUnreadCountRequested: () => {
      // No state change needed, just trigger saga
    },
    fetchUnreadCountSucceeded: (state, action: PayloadAction<{ unread_count: number }>) => {
      state.unreadCount = action.payload.unread_count;
    },
    fetchUnreadCountFailed: () => {
      // Silently fail for unread count
    },
  },
});

export const notificationActions = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;
