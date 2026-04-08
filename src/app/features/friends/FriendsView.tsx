"use client";

import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { friendsActions } from "../../stores/reducers/friends/friendsSlice";
import { routes } from "../../constants/routes";

export function FriendsView() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"friends" | "pending" | "blocked">("friends");
  
  const friends = useAppSelector((s) => s.friends.friends);
  const pendingRequests = useAppSelector((s) => s.friends.pendingRequests);
  const blockedUsers = useAppSelector((s) => s.friends.blockedUsers);
  const isLoading = useAppSelector((s) => s.friends.isLoading);
  const isLoadingPending = useAppSelector((s) => s.friends.isLoadingPending);
  const isLoadingBlocked = useAppSelector((s) => s.friends.isLoadingBlocked);
  const error = useAppSelector((s) => s.friends.error);

  useEffect(() => {
    dispatch(friendsActions.loadFriendsRequested());
    dispatch(friendsActions.loadPendingRequestsRequested());
    dispatch(friendsActions.loadBlockedRequested());
  }, [dispatch]);

  const isLoadingCurrent = activeTab === "friends" ? isLoading : activeTab === "pending" ? isLoadingPending : isLoadingBlocked;

  if (isLoadingCurrent) {
    return (
      <Box sx={{ p: 4, textAlign: "center", minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography sx={{ color: "#5e5e5e" }}>
          {activeTab === "friends" ? "Loading friends..." : "Loading requests..."}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center", minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography sx={{ color: "#ba1a1a" }}>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700, 
            color: "#131b2e",
            letterSpacing: "-0.02em"
          }}
        >
          Friends & Requests
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          sx={{
            bgcolor: "#131b2e",
            color: "#fff",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {                    
              bgcolor: "#004ced"
            }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              }}
        >
          Add Friend
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs                                                                   
        value={activeTab} 
        onChange={(_, v) => setActiveTab(v)}
        sx={{ 
          mb: 3,                           
          '& .MuiTabs-flexContainer': { gap: 2 },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            color: '#5e5e5e',
            '&.Mui-selected': { color: '#131b2e', fontWeight: 600 }
          }
        }}
      >
        <Tab value="friends" label={`Friends (${friends.length})`} />
        <Tab value="pending" label={`Pending (${pendingRequests.length})`} />
        <Tab value="blocked" label={`Blocked (${blockedUsers.length})`} />
      </Tabs>

      {/* Content */}
      {activeTab === "friends" ? (
        // Friends List
        friends.length === 0 ? (
          <Box sx={{ 
            p: 6, 
            textAlign: "center", 
            bgcolor: "#f8f9fa", 
            borderRadius: 3,
            border: "1px dashed rgba(0,0,0,0.12)"
          }}>
            <Typography sx={{ color: "#5e5e5e", fontSize: "1rem" }}>
              You don&apos;t have any friends yet.
            </Typography>
          </Box>
        ) : (
          <Stack gap={2}>
            {friends.map((friend) => (
              <Card
                key={friend.id}
                component={Link}
                href={routes.profile(encodeURIComponent(friend.id))}
                sx={{
                  textDecoration: "none",
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  transition: "all 0.2s ease",
                  boxShadow: "none",
                  border: "1px solid rgba(0,0,0,0.06)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    borderColor: "rgba(0,0,0,0.12)"
                  },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                    <Avatar
                      src={friend.out_user?.avatar || undefined}
                      alt={friend.out_user?.full_name || undefined}
                      sx={{ 
                        width: 56, 
                        height: 56,
                        bgcolor: "#131b2e",
                        color: "#fff",
                        fontSize: "1.25rem",
                        fontWeight: 500
                      }}
                    >
                      {friend.out_user?.full_name?.charAt(0)?.toUpperCase() || "?"}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          color: "#131b2e",
                          fontSize: "1.0625rem",
                          mb: 0.3
                        }}
                      >
                        {friend.out_user?.full_name || "Unknown"}
                      </Typography>
                      <Typography 
                        sx={{ 
                          color: "#5e5e5e",
                          fontSize: "0.875rem"
                        }}
                      >
                        @{friend.out_user?.username || "unknown"}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )
      ) : activeTab === "pending" ? (
        // Pending Requests List
        pendingRequests.length === 0 ? (
          <Box sx={{ 
            p: 6, 
            textAlign: "center", 
            bgcolor: "#f8f9fa", 
            borderRadius: 3,
            border: "1px dashed rgba(0,0,0,0.12)"
          }}>
            <Typography sx={{ color: "#5e5e5e", fontSize: "1rem" }}>
              No pending friend requests.
            </Typography>
          </Box>
        ) : (
          <Stack gap={2}>
            {pendingRequests.map((request) => (
              <Card
                key={request.id}
                sx={{
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  boxShadow: "none",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                    <Avatar
                      src={request.out_user?.avatar || undefined}
                      alt={request.out_user?.full_name || undefined}
                      sx={{ 
                        width: 56, 
                        height: 56,
                        bgcolor: "#131b2e",
                        color: "#fff",
                        fontSize: "1.25rem",
                        fontWeight: 500
                      }}
                    >
                      {request.out_user?.full_name?.charAt(0)?.toUpperCase() || "?"}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          color: "#131b2e",
                          fontSize: "1.0625rem",
                          mb: 0.3
                        }}
                      >
                        {request.out_user?.full_name || "Unknown"}
                      </Typography>
                      <Typography 
                        sx={{ 
                          color: "#5e5e5e",
                          fontSize: "0.875rem"
                        }}
                      >
                        @{request.out_user?.username || "unknown"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<CheckIcon />}
                        sx={{
                          bgcolor: "#131b2e",
                          color: "#fff",
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 500,
                          "&:hover": { bgcolor: "#004ced" }
                        }}
                        onClick={() => {
                          dispatch(friendsActions.acceptFriendRequestRequested({ userId: request.out_user?.id || '' }));
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<CloseIcon />}
                        sx={{
                          borderColor: "rgba(0,0,0,0.2)",
                          color: "#5e5e5e",
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 500,
                          "&:hover": { borderColor: "#ba1a1a", color: "#ba1a1a", bgcolor: "transparent" }
                        }}
                        onClick={() => {
                          dispatch(friendsActions.unfriendRequested({ userId: request.out_user?.id || '' }));
                        }}
                      >
                        Reject
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )
      ) : (
        // Blocked Users List
        blockedUsers.length === 0 ? (
          <Box sx={{ 
            p: 6, 
            textAlign: "center", 
            bgcolor: "#f8f9fa", 
            borderRadius: 3,
            border: "1px dashed rgba(0,0,0,0.12)"
          }}>
            <Typography sx={{ color: "#5e5e5e", fontSize: "1rem" }}>
              No blocked users.
            </Typography>
          </Box>
        ) : (
          <Stack gap={2}>
            {blockedUsers.map((user) => (
              <Card
                key={user.id}
                sx={{
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  boxShadow: "none",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                    <Avatar
                      src={user.out_user?.avatar || undefined}
                      alt={user.out_user?.full_name || undefined}
                      sx={{ 
                        width: 56, 
                        height: 56,
                        bgcolor: "#131b2e",
                        color: "#fff",
                        fontSize: "1.25rem",
                        fontWeight: 500
                      }}
                    >
                      {user.out_user?.full_name?.charAt(0)?.toUpperCase() || "?"}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          color: "#131b2e",
                          fontSize: "1.0625rem",
                          mb: 0.3
                        }}
                      >
                        {user.out_user?.full_name || "Unknown"}
                      </Typography>
                      <Typography 
                        sx={{ 
                          color: "#5e5e5e",
                          fontSize: "0.875rem"
                        }}
                      >
                        @{user.out_user?.username || "unknown"}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: "rgba(0,0,0,0.2)",
                        color: "#5e5e5e",
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 500,
                        "&:hover": { borderColor: "#131b2e", color: "#131b2e", bgcolor: "transparent" }
                      }}
                      onClick={() => {
                        dispatch(friendsActions.unblockUserRequested({ userId: user.out_user?.id || '' }));
                      }}
                    >
                      Unblock
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )
      )}
    </Box>
  );
}
