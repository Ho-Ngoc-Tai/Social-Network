"use client";

import { useEffect, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "./storeHooks";
import { socketService, SocketNotification } from "../services/socket/socketService";
import { notificationActions } from "../stores/reducers/notification/notificationSlice";
import { friendsActions } from "../stores/reducers/friends/friendsSlice";

export function useSocket() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const isAuthenticated = useAppSelector((s) => s.auth.status === "authenticated");

  const handleNewNotification = useCallback(
    (data: SocketNotification) => {
      // Convert socket notification to Redux notification format
      const notification = {
        id: data.id,
        type: mapActionToType(data.action),
        title: data.title,
        content: data.content,
        is_read: data.is_read,
        created_at: data.created_at,
        actor: data.actor,
        target: data.target,
      };

      // Add to Redux store via real-time action
      dispatch(
        notificationActions.receiveRealtimeNotification({ notification })
      );

      // Reload friends/pending requests when receiving friend-related events
      if (data.action === "FRIEND_REQ" || data.action === "FRIEND_ACCEPT") {
        console.log("[Socket] Reloading friends/pending requests...");
        dispatch(friendsActions.loadFriendsRequested());
        dispatch(friendsActions.loadPendingRequestsRequested());
      }

      // Show browser notification if permitted
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(data.title, {
            body: data.content,
            icon: "/favicon.ico",
          });
        }
      }
    },
    [dispatch]
  );

  useEffect(() => {
    console.log('[useSocket] Effect running:', { isAuthenticated, hasToken: !!token });
    
    if (!isAuthenticated || !token) {
      console.log('[useSocket] Not authenticated, skipping');
      return;
    }

    // Connect socket
    console.log('[useSocket] Connecting socket...');
    socketService.connect(token);
    console.log('[useSocket] Socket connected?', socketService.isConnected());

    // Subscribe to new_notification event
    const unsubscribe = socketService.on("new_notification", (data) => {
      console.log('[Socket] Received new_notification:', data);
      handleNewNotification(data as SocketNotification);
    });

    // Request browser notification permission
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }

    return () => {
      unsubscribe();
    };
  }, [isAuthenticated, token, handleNewNotification]);

  return {
    isConnected: socketService.isConnected(),
  };
}

// Map socket action to notification type
function mapActionToType(
  action: SocketNotification["action"]
): "like" | "comment" | "follow" | "mention" | "post" {
  switch (action) {
    case "FRIEND_REQ":
    case "FRIEND_ACCEPT":
      return "follow";
    case "like":
      return "like";
    case "comment":
      return "comment";
    case "mention":
      return "mention";
    case "post":
      return "post";
    default:
      return "follow";
  }
}
