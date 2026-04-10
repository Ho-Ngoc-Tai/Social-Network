"use client";

import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import BlockIcon from "@mui/icons-material/Block";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { profileActions } from "../../stores/reducers/profile/profileSlice";
import { friendsActions } from "../../stores/reducers/friends/friendsSlice";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { PostCard } from "../../components/feed/PostCard";
import { StatPill } from "../../components/ui/StatPill";


export function ProfileView({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.profile.user);
  const posts = useAppSelector((s) => s.profile.posts);
  const friendStatus = useAppSelector((s) => s.profile.friendStatus);
  const isLoading = useAppSelector((s) => s.profile.isLoading);
  const updateLoading = useAppSelector((s) => s.profile.updateLoading);
  const updateError = useAppSelector((s) => s.profile.updateError);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isOwner = String(currentUserId) === String(id);

  useEffect(() => {
    // Get userId from localStorage after mount (client-side only)
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
    
    const finalUserId = userId || user_id || idFromStorage || userIdFromToken;
    console.log('Profile Debug:', { currentUserId: finalUserId, id, isOwner: String(finalUserId) === String(id) });
    // Defer setState to avoid synchronous setState warning
    setTimeout(() => {
      setCurrentUserId(finalUserId);
      setIsReady(true);
    }, 0);
  }, [id]);

  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const hasSubmittedRef = useRef(false);
  const [editForm, setEditForm] = useState({
    full_name: "", 
    phone: "",
    address: "",
    gender: "",
  });

  useEffect(() => {
    dispatch(profileActions.loadProfileRequested({ userId: id, page: 1, limit: 10 }));
  }, [dispatch, id]);

  const handleOpenEdit = () => {
    setEditForm({
      full_name: user?.full_name || "",
      phone: user?.profile?.phone || "",
      address: user?.profile?.address || "",
      gender: user?.profile?.gender || "",
    });
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    hasSubmittedRef.current = false;
    setEditOpen(false);
  };

  const handleSave = () => {
    hasSubmittedRef.current = true;
    dispatch(profileActions.updateProfileRequested({
      userId: id,
      data: {
        full_name: editForm.full_name,
        profile: {
          phone: editForm.phone,
          address: editForm.address,
          gender: editForm.gender as "MALE" | "FEMALE" | "OTHER",
        },
      },
    }));
  };

  useEffect(() => {
    if (hasSubmittedRef.current && !updateLoading && !updateError && editOpen) {
      // Defer setState to avoid synchronous setState in effect
      setTimeout(() => {
        setEditOpen(false);
        hasSubmittedRef.current = false;
      }, 0);
    }
  }, [updateLoading, updateError, editOpen]);

  return (
    <div>
      <Stack gap={3}>
        {/* Back Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
          <IconButton 
            onClick={() => router.back()}
            sx={{ 
              color: '#1A1F3C',
              '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.08)' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Profile</Typography>
        </Box>

        <Card sx={{ borderRadius: 4, overflow: "visible", boxShadow: "none", backgroundColor: "rgba(255,255,255,0.72)", border: "none" }}>
          <Box
            sx={{
              height: 160,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
              backgroundSize: "200% 200%",
              borderRadius: 4,
              position: "relative",
              overflow: "hidden",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "60%",
                background: "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
              }
            }}
          />
          <CardContent sx={{ pt: 0, pb: 3, position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 3, flexWrap: { xs: "wrap", md: "nowrap" } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: -8 }}>
                <Box
                  sx={{
                    position: "relative",
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    p: 0.5,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
                    backgroundSize: "300% 300%",
                    animation: "gradientShift 4s ease infinite",
                    boxShadow: "0 8px 30px rgba(102, 126, 234, 0.4)",
                    "@keyframes gradientShift": {
                      "0%": { backgroundPosition: "0% 50%" },
                      "50%": { backgroundPosition: "100% 50%" },
                      "100%": { backgroundPosition: "0% 50%" },
                    },
                  }}
                >
                  <Avatar
                    src={undefined}
                    alt={user?.full_name ?? "User"}
                    sx={{
                      width: "100%",
                      height: "100%",
                      border: "4px solid #fff",
                      bgcolor: "#f0f2f5",
                    }}
                  />
                </Box>
                <Box sx={{ pt: 6 }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 900, 
                      letterSpacing: "-0.02em",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {user?.full_name ?? "…"}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#718096", fontWeight: 500 }}>
                    @{user?.username ?? ""}
                  </Typography>
                  <Stack direction="row" gap={2} sx={{ mt: 1 }}>
                    {user?.profile?.address && (
                      <Typography variant="body2" sx={{ color: "#a0aec0", display: "flex", alignItems: "center", gap: 0.5 }}>
                        📍 {user.profile.address}
                      </Typography>
                    )}
                    {user?.profile?.phone && (
                      <Typography variant="body2" sx={{ color: "#a0aec0", display: "flex", alignItems: "center", gap: 0.5 }}>
                        📱 {user.profile.phone}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </Box>

                <Stack direction="row" gap={1.5} sx={{ pt: 2, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {/* Stats Pills */}
                <Box sx={{ 
                  px: 2, 
                  py: 1, 
                  borderRadius: 999, 
                  background: "linear-gradient(135deg, #667eea20 0%, #764ba220 100%)",
                  border: "1px solid rgba(102,126,234,0.2)",
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#667eea" }}>
                    {posts.length} Posts
                  </Typography>
                </Box>
                
                {!isReady ? (
                  <Button 
                    variant="outlined" 
                    size="small" 
                    disabled
                    sx={{ borderRadius: 2, textTransform: "none" }}
                  >
                    ...
                  </Button>
                ) : isOwner ? (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={handleOpenEdit}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      borderColor: "#667eea",
                      color: "#667eea",
                      background: "rgba(102,126,234,0.05)",
                      '&:hover': { 
                        borderColor: "#764ba2",
                        background: "rgba(102,126,234,0.1)",
                      }
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    {friendStatus?.is_friend ? (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<HowToRegIcon />}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                          boxShadow: "0 4px 15px rgba(72,187,120,0.3)",
                          '&:hover': { 
                            background: "linear-gradient(135deg, #38a169 0%, #2f855a 100%)",
                          }
                        }}
                      >
                        Friends
                      </Button>
                    ) : friendStatus?.status === 'pending' ? (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PersonRemoveIcon />}
                        onClick={() => dispatch(friendsActions.unfriendRequested({ userId: id }))}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          background: "linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)",
                          boxShadow: "0 4px 15px rgba(237,137,54,0.3)",
                          '&:hover': { 
                            background: "linear-gradient(135deg, #dd6b20 0%, #c05621 100%)",
                          }
                        }}
                      >
                        Cancel Request
                      </Button>
                    ) : friendStatus?.blocked_by_me ? (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<BlockIcon />}
                        disabled
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          background: "#e2e8f0",
                          color: "#718096",
                        }}
                      >
                        Blocked
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PersonAddIcon />}
                        onClick={() => dispatch(friendsActions.sendFriendRequestRequested({ userId: id }))}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
                          '&:hover': { 
                            background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                          }
                        }}
                      >
                        Add Friend
                      </Button>
                    )}
                  </>
                )}
              </Stack>
            </Box>

            {user?.profile?.address ? (
              <Typography variant="body1" sx={{ mt: 3 }}>
                📍 {user.profile.address}
              </Typography>
            ) : null}
            {user?.profile?.phone ? (
              <Typography variant="body1" sx={{ mt: 1 }}>
                📞 {user.profile.phone}
              </Typography>
            ) : null}

            <Tabs value={0} sx={{ mt: 3 }}>
              <Tab label={`Posts (${posts.length})`} />
            </Tabs>
          </CardContent>
        </Card>

        {isLoading ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <Stack gap={3}>
            {posts.map((p) => (
              <PostCard key={p.id} post={p} variant="profile" />
            ))}
          </Stack>
        )}
      </Stack>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Full Name"
              value={editForm.full_name}
              onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Phone"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              fullWidth
            />
            <TextField
              label="Address"
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              fullWidth
            />
            <TextField
              label="Gender"
              select
              value={editForm.gender}
              onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
              fullWidth
              slotProps={{
                select: {
                  native: true,
                },
              }}
            >
              <option value=""></option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </TextField>
            {updateError && (
              <Typography color="error" variant="body2">
                {updateError}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={updateLoading}
            startIcon={updateLoading ? <CircularProgress size={16} /> : null}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
