"use client";

import { useState, useRef, useCallback, useEffect } from "react";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";

import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ArticleIcon from "@mui/icons-material/Article";

import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { notificationActions } from "../../stores/reducers/notification/notificationSlice";
import { Notification } from "../../types/notification/notification";
import { useRouter } from "next/navigation";

function formatTimeAgo(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString();
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "like":
      return (
        <Box sx={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#e91e63", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <FavoriteIcon sx={{ color: "white", fontSize: 20 }} />
        </Box>
      );
    case "comment":
      return (
        <Box sx={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#2196f3", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChatBubbleIcon sx={{ color: "white", fontSize: 20 }} />
        </Box>
      );
    case "follow":
      return (
        <Box sx={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#4caf50", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PersonAddIcon sx={{ color: "white", fontSize: 20 }} />
        </Box>
      );
    case "post":
      return (
        <Box sx={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#9c27b0", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ArticleIcon sx={{ color: "white", fontSize: 20 }} />
        </Box>
      );
    default:
      return (
        <Box sx={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#757575", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <NotificationsIcon sx={{ color: "white", fontSize: 20 }} />
        </Box>
      );
  }
}

export function NotificationBell() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items, unreadCount, isLoading, hasMore } = useAppSelector(
    (s) => s.notification
  );
  
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const hasFetchedRef = useRef(false);

  // Get navigation URL based on notification type
  const getNotificationUrl = (notification: Notification): string | null => {
    switch (notification.type) {
      case "follow":
        // Friend request - go to friends page pending tab
        return "/friends?tab=pending";
      case "like":
      case "comment":
        // Like/comment - go to post detail if target exists
        if (notification.target?.id) {
          return `/posts/${notification.target.id}`;
        }
        return null;
      case "post":
        // New post - go to post detail
        if (notification.target?.id) {
          return `/posts/${notification.target.id}`;
        }
        return null;
      default:
        return null;
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    const url = getNotificationUrl(notification);
    if (url) {
      handleClose();
      router.push(url);
    }
    // Mark as read
    if (!notification.is_read) {
      dispatch(notificationActions.markNotificationReadRequested({ notificationId: notification.id }));
    }
  };

  // Fetch unread count on mount
  useEffect(() => {
    dispatch(notificationActions.fetchUnreadCountRequested());
  }, [dispatch]);

  // Fetch notifications when dropdown opens
  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      dispatch(notificationActions.loadNotificationsRequested({ limit: 20 }));
    }
  }, [dispatch]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLoadMore = useCallback(() => {
    // TODO: Implement pagination with cursor
  }, []);

  const handleMarkAllRead = useCallback(() => {
    dispatch(notificationActions.markAllNotificationsReadRequested());
  }, [dispatch]);

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton 
        onClick={handleOpen}
        sx={{ color: "text.primary" }}
      >
        <Badge 
          badgeContent={unreadCount > 0 ? unreadCount : "0"} 
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.65rem',
              minWidth: 18,
              height: 18,
            }
          }}
        >
          {unreadCount > 0 ? (
            <NotificationsIcon sx={{ fontSize: 26 }} />
          ) : (
            <NotificationsNoneIcon sx={{ fontSize: 26 }} />
          )}
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 480,
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button 
              size="small" 
              onClick={handleMarkAllRead}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Mark all as read
            </Button>
          )}
        </Box>
        <Divider />

        {/* Notifications List */}
        <Box sx={{ maxHeight: 400, overflow: "auto" }}>
          {isLoading && items.length === 0 ? (
            <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
              <CircularProgress size={32} />
            </Box>
          ) : items.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <NotificationsNoneIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
              <Typography color="text.secondary">
                No notifications yet
              </Typography>
            </Box>
          ) : (
            items.map((notification: Notification) => (
              <Box
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  p: 2,
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                  cursor: getNotificationUrl(notification) ? "pointer" : "default",
                  backgroundColor: notification.is_read ? "transparent" : "rgba(25,118,210,0.08)",
                  "&:hover": {
                    backgroundColor: getNotificationUrl(notification) ? "rgba(0,0,0,0.04)" : undefined,
                  },
                  borderBottom: "1px solid",
                  borderColor: "rgba(0,0,0,0.06)",
                }}
              >
                {/* Actor Avatar or Icon */}
                {notification.actor ? (
                  <Avatar
                    src={notification.actor.avatar || undefined}
                    alt={notification.actor.full_name}
                    sx={{ width: 40, height: 40 }}
                  />
                ) : (
                  getNotificationIcon(notification.type)
                )}

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                    <strong>{notification.actor?.full_name || "System"}</strong>{" "}
                    {notification.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                    {formatTimeAgo(notification.created_at)}
                  </Typography>
                </Box>

                {/* Unread dot */}
                {!notification.is_read && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                      flexShrink: 0,
                      mt: 1,
                    }}
                  />
                )}
              </Box>
            ))
          )}

          {/* Load More */}
          {hasMore && (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Button size="small" onClick={handleLoadMore} sx={{ textTransform: "none" }}>
                Load more
              </Button>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
}
