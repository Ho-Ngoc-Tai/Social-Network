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
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { profileActions } from "../../stores/reducers/profile/profileSlice";
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

  const [editOpen, setEditOpen] = useState(false);
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
    setEditOpen(false);
  };

  const handleSave = () => {
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
    if (!updateLoading && !updateError && editOpen) {
      setTimeout(() => setEditOpen(false), 0);
    }
  }, [updateLoading, updateError, editOpen]);

  return (
    <div>
      <Stack gap={3}>
        <Card sx={{ borderRadius: 4, overflow: "visible", boxShadow: "none", backgroundColor: "rgba(255,255,255,0.72)", border: "none" }}>
          <Box
            sx={{
              height: 160,
              background:
                "linear-gradient(135deg, rgba(0,82,255,0.12) 0%, rgba(0,56,182,0.04) 60%, rgba(250,248,255,0.0) 100%)",
              borderRadius: 4,
            }}
          />
          <CardContent sx={{ pt: 0, pb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: -6 }}>
                <Avatar
                  src={undefined}
                  alt={user?.full_name ?? "User"}
                  sx={{
                    width: 96,
                    height: 96,
                    border: "4px solid rgba(255,255,255,0.95)",
                  }}
                />
                <Box sx={{ pt: 4 }}>
                  <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: "-0.02em" }}>
                    {user?.full_name ?? "…"}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    @{user?.username ?? ""}
                  </Typography>
                </Box>
              </Box>

              <Stack direction="row" gap={1.5} sx={{ pt: 2, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <StatPill label="Posts" value={posts.length} />
                <StatPill label="Friends" value={friendStatus?.is_friend ? 1 : 0} />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={handleOpenEdit}
                >
                  Edit Profile
                </Button>
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
              <PostCard key={p.id} post={p} />
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
