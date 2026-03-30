"use client";

import { useEffect } from "react";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";

import { AuthGate } from "@/components/AuthGate";
import { AppShell } from "@/components/layout/AppShell";
import { ThreeColumn } from "@/components/layout/ThreeColumn";
import { PostCard } from "@/components/feed/PostCard";
import { StatPill } from "@/components/profile/StatPill";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { profileActions } from "@/stores/reducers/profileSlice";

function LeftRail() {
  return (
    <Stack gap={3} sx={{ position: "sticky", top: 96 }}>
      <Card sx={{ borderRadius: 4, backgroundColor: "rgba(242, 243, 255, 0.6)", border: "none", boxShadow: "none" }}>
        <CardContent sx={{ py: 2.5 }}>
          <Typography variant="overline" color="text.secondary">
            About
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Showcase your projects, join discussions, and connect with classmates.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}

function RightRail() {
  return (
    <Stack gap={3} sx={{ position: "sticky", top: 96 }}>
      <Card sx={{ borderRadius: 4, backgroundColor: "rgba(242, 243, 255, 0.6)", border: "none", boxShadow: "none" }}>
        <CardContent sx={{ py: 2.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Highlights
          </Typography>
          <Divider sx={{ my: 2, opacity: 0.6 }} />
          <Stack gap={2}>
            <Typography variant="body2">- Clean architecture</Typography>
            <Typography variant="body2">- GraphQL-first data flow</Typography>
            <Typography variant="body2">- Stitch-inspired UI</Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

export function ProfileView({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.profile.user);
  const posts = useAppSelector((s) => s.profile.posts);

  useEffect(() => {
    dispatch(profileActions.loadProfileRequested({ id }));
  }, [dispatch, id]);

  return (
    <AuthGate>
      <AppShell>
        <ThreeColumn
          left={<LeftRail />}
          main={
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
                        src={user?.avatarUrl}
                        alt={user?.name ?? "User"}
                        sx={{
                          width: 96,
                          height: 96,
                          border: "4px solid rgba(255,255,255,0.95)",
                        }}
                      />
                      <Box sx={{ pt: 4 }}>
                        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: "-0.02em" }}>
                          {user?.name ?? "…"}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {user?.headline ?? ""}
                        </Typography>
                      </Box>
                    </Box>

                    <Stack direction="row" gap={1.5} sx={{ pt: 2, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      <StatPill label="Posts" value={user?.stats?.posts ?? 0} />
                      <StatPill label="Followers" value={user?.stats?.followers ?? 0} />
                      <StatPill label="Following" value={user?.stats?.following ?? 0} />
                    </Stack>
                  </Box>

                  {user?.bio ? (
                    <Typography variant="body1" sx={{ mt: 3 }}>
                      {user.bio}
                    </Typography>
                  ) : null}

                  <Tabs value={0} sx={{ mt: 3 }}>
                    <Tab label="Posts" />
                    <Tab label="Media" disabled />
                    <Tab label="Likes" disabled />
                  </Tabs>
                </CardContent>
              </Card>

              <Stack gap={3}>
                {posts.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </Stack>
            </Stack>
          }
          right={<RightRail />}
        />
      </AppShell>
    </AuthGate>
  );
}
