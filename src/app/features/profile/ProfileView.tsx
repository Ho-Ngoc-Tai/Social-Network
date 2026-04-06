"use client";

import { useEffect } from "react";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
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

  useEffect(() => {
    dispatch(profileActions.loadProfileRequested({ userId: id, page: 1, limit: 10 }));
  }, [dispatch, id]);

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
    </div>
  );
}
