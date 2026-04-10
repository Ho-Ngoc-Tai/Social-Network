"use client";

import { useEffect, useRef, useState } from "react";
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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { friendsActions } from "../../stores/reducers/friends/friendsSlice";
import { routes } from "../../constants/routes";
import { useSearchParams } from "next/navigation";

export function FriendsView() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"friends" | "pending" | "blocked">(() => {
    // Initialize from URL query param
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl === 'pending' || tabFromUrl === 'blocked') {
      return tabFromUrl;
    }
    return 'friends';
  });
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });
  
  // Get current userId from localStorage or JWT token
  const getCurrentUserId = () => {
    if (typeof window === 'undefined') return null;
    const userId = localStorage.getItem('userId');
    const user_id = localStorage.getItem('user_id');
    const idFromStorage = localStorage.getItem('id');
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    
    let userIdFromToken = null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userIdFromToken = payload.sub || payload.userId || payload.id;
      } catch {
        console.log('Failed to parse token');
      }
    }
    return userId || user_id || idFromStorage || userIdFromToken;
  };
  
  const currentUserId = getCurrentUserId();
  
  const friends = useAppSelector((s) => s.friends.friends);
  const pendingRequests = useAppSelector((s) => s.friends.pendingRequests);
  const blockedUsers = useAppSelector((s) => s.friends.blockedUsers);
  
  // Separate incoming (others sent to me) vs outgoing (I sent to others)
  const incomingRequests = pendingRequests.filter(p => p.in_user?.id === currentUserId);
  const outgoingRequests = pendingRequests.filter(p => p.out_user?.id === currentUserId);
  
  const users = useAppSelector((s) => s.friends.users);
  const isLoading = useAppSelector((s) => s.friends.isLoading);
  const isLoadingPending = useAppSelector((s) => s.friends.isLoadingPending);
  const isLoadingBlocked = useAppSelector((s) => s.friends.isLoadingBlocked);
  const isLoadingUsers = useAppSelector((s) => s.friends.isLoadingUsers);
  const isSendingRequest = useAppSelector((s) => s.friends.isSendingRequest);
  const error = useAppSelector((s) => s.friends.error);

  useEffect(() => {
    dispatch(friendsActions.loadFriendsRequested());
    dispatch(friendsActions.loadPendingRequestsRequested());
    dispatch(friendsActions.loadBlockedRequested());
  }, [dispatch]);

  // Track previous isSendingRequest state for success detection
  const prevIsSendingRequest = useRef(isSendingRequest);
  
  // Show snackbar on success/error
  useEffect(() => {
    if (!isSendingRequest && prevIsSendingRequest.current && !error) {
      // Operation completed successfully
      setTimeout(() => setSnackbar({ open: true, message: "Operation completed successfully", severity: "success" }), 0);
    }
    if (!isSendingRequest && !isLoading && !isLoadingPending && !isLoadingBlocked) {
      if (error) {
        setTimeout(() => setSnackbar({ open: true, message: error, severity: "error" }), 0);
      }
    }
    prevIsSendingRequest.current = isSendingRequest;
  }, [isSendingRequest, isLoading, isLoadingPending, isLoadingBlocked, error]);

  const handleOpenAddFriend = () => {
    setAddFriendOpen(true);
    dispatch(friendsActions.loadUsersRequested());
  };

  const handleCloseAddFriend = () => {
    setAddFriendOpen(false);
    setSearchQuery("");
  };

  const handleSendFriendRequest = (userId: string) => {
    dispatch(friendsActions.sendFriendRequestRequested({ userId }));
  };
  
  const handleCancelRequest = (userId: string) => {
    dispatch(friendsActions.unfriendRequested({ userId }));
  };

  // Filter users - exclude already friends, pending, and blocked
  const friendIds = new Set(friends.map(f => f.out_user?.id || f.in_user?.id));
  const pendingIds = new Set(pendingRequests.map(p => p.out_user?.id));
  const blockedIds = new Set(blockedUsers.map(b => b.out_user?.id));
  
  const availableUsers = users.filter(user => 
    !friendIds.has(user.id) && 
    !pendingIds.has(user.id) && 
    !blockedIds.has(user.id) &&
    (searchQuery === "" || 
     user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.username?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
          onClick={handleOpenAddFriend}
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
        // Pending Requests - Split into Incoming vs Outgoing
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
          <Stack gap={3}>
            {/* INCOMING - People who sent requests TO ME */}
            {incomingRequests.length > 0 && (
              <Box>
                <Typography 
                  sx={{ 
                    fontWeight: 600, 
                    color: "#131b2e",
                    fontSize: "0.875rem",
                    mb: 1.5,
                    px: 1
                  }}
                >
                  Requests from others ({incomingRequests.length})
                </Typography>
                <Stack gap={2}>
                  {incomingRequests.map((request) => (
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
                            <Typography 
                              sx={{ 
                                color: "#004ced",
                                fontSize: "0.75rem",
                                mt: 0.5
                              }}
                            >
                              Wants to be your friend
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<CheckIcon />}
                              sx={{
                                bgcolor: "#004ced",
                                color: "#fff",
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 500,
                                "&:hover": { bgcolor: "#003bb5" }
                              }}
                              onClick={() => {
                                dispatch(friendsActions.acceptFriendRequestRequested({ userId: request.out_user?.id || '' }));
                              }}
                            >
                              Confirm
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<CloseIcon />}
                              sx={{
                                borderColor: "#e4e6eb",
                                color: "#65676b",
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 500,
                                "&:hover": { bgcolor: "#f0f2f5", borderColor: "#d8dadf" }
                              }}
                              onClick={() => {
                                dispatch(friendsActions.unfriendRequested({ userId: request.out_user?.id || '' }));
                              }}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            )}

            {/* OUTGOING - Requests I SENT */}
            {outgoingRequests.length > 0 && (
              <Box>
                <Typography 
                  sx={{ 
                    fontWeight: 600, 
                    color: "#131b2e",
                    fontSize: "0.875rem",
                    mb: 1.5,
                    px: 1
                  }}
                >
                  Your sent requests ({outgoingRequests.length})
                </Typography>
                <Stack gap={2}>
                  {outgoingRequests.map((request) => (
                    <Card
                      key={request.id}
                      sx={{
                        borderRadius: 3,
                        bgcolor: "#f8f9fa",
                        boxShadow: "none",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                          <Avatar
                            src={request.in_user?.avatar || undefined}
                            alt={request.in_user?.full_name || undefined}
                            sx={{ 
                              width: 56, 
                              height: 56,
                              bgcolor: "#131b2e",
                              color: "#fff",
                              fontSize: "1.25rem",
                              fontWeight: 500
                            }}
                          >
                            {request.in_user?.full_name?.charAt(0)?.toUpperCase() || "?"}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 600, 
                                color: "#65676b",
                                fontSize: "1.0625rem",
                                mb: 0.3
                              }}
                            >
                              {request.in_user?.full_name || "Unknown"}
                            </Typography>
                            <Typography 
                              sx={{ 
                                color: "#65676b",
                                fontSize: "0.875rem"
                              }}
                            >
                              @{request.in_user?.username || "unknown"}
                            </Typography>
                            <Typography 
                              sx={{ 
                                color: "#65676b",
                                fontSize: "0.75rem",
                                mt: 0.5
                              }}
                            >
                              Request sent, waiting for response
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CloseIcon />}
                            sx={{
                              borderColor: "#e4e6eb",
                              color: "#65676b",
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 500,
                              "&:hover": { bgcolor: "#f0f2f5", borderColor: "#d8dadf" }
                            }}
                            onClick={() => handleCancelRequest(request.in_user?.id || '')}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            )}
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

      {/* Add Friend Dialog */}
      <Dialog 
        open={addFriendOpen} 
        onClose={handleCloseAddFriend}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1 
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Add Friend
          </Typography>
          <IconButton onClick={handleCloseAddFriend} size="small">
            <CloseOutlinedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Search */}
          <TextField
            fullWidth
            placeholder="Search by name or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: '#5e5e5e', mr: 1 }} />
              ),
            }}
            sx={{ mb: 3 }}
          />

          {/* Users List */}
          {isLoadingUsers ? (
            <Typography sx={{ textAlign: 'center', color: '#5e5e5e', py: 4 }}>
              Loading users...
            </Typography>
          ) : availableUsers.length === 0 ? (
            <Typography sx={{ textAlign: 'center', color: '#5e5e5e', py: 4 }}>
              {searchQuery ? 'No users found matching your search.' : 'No available users to add.'}
            </Typography>
          ) : (
            <Stack gap={2}>
              {availableUsers.map((user) => (
                <Card
                  key={user.id}
                  sx={{
                    borderRadius: 3,
                    boxShadow: 'none',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={user.avatar || undefined}
                      alt={user.full_name || undefined}
                      sx={{ 
                        width: 48, 
                        height: 48,
                        bgcolor: '#131b2e',
                        color: '#fff',
                        fontSize: '1.1rem',
                        fontWeight: 500
                      }}
                    >
                      {user.full_name?.charAt(0)?.toUpperCase() || '?'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 600, color: '#131b2e' }}>
                        {user.full_name || 'Unknown'}
                      </Typography>
                      <Typography sx={{ color: '#5e5e5e', fontSize: '0.875rem' }}>
                        @{user.username}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      disabled={isSendingRequest}
                      onClick={() => handleSendFriendRequest(user.id)}
                      sx={{
                        bgcolor: '#131b2e',
                        color: '#fff',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        '&:hover': { bgcolor: '#004ced' }
                      }}
                    >
                      Add
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
