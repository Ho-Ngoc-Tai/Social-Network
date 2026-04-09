"use client";

import { useEffect, useRef, useCallback } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";

import { AuthGate } from "../../components/AuthGate";
import { AppShell } from "../../components/layout/AppShell";
import { ThreeColumn } from "../../components/layout/ThreeColumn";
import { ComposerCard } from "../../components/feed/ComposerCard";
import { PostCard } from "../../components/feed/PostCard";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { feedActions } from "../../stores/reducers/feed/feedSlice";

function LeftRail() {
  return (
    <Stack gap={3} sx={{ position: "sticky", top: 96 }}>
      <Card sx={{ borderRadius: 4, backgroundColor: "rgba(242, 243, 255, 0.6)", border: "none", boxShadow: "none" }}>
        <CardContent sx={{ py: 2.5 }}>
          <Typography variant="overline" color="text.secondary">
            For you
          </Typography>
          <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 2 }}>
            <Chip label="Campus" sx={{ borderRadius: 999, backgroundColor: "rgba(226,231,255,1)", height: 28 }} />
            <Chip label="Projects" sx={{ borderRadius: 999, backgroundColor: "rgba(226,231,255,1)", height: 28 }} />
            <Chip label="Events" sx={{ borderRadius: 999, backgroundColor: "rgba(226,231,255,1)", height: 28 }} />
            <Chip label="Research" sx={{ borderRadius: 999, backgroundColor: "rgba(226,231,255,1)", height: 28 }} />
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 4, backgroundColor: "rgba(242, 243, 255, 0.6)", border: "none", boxShadow: "none" }}>
        <CardContent sx={{ py: 2.5 }}>
          <Typography variant="overline" color="text.secondary">
            Quick actions
          </Typography>
          <Stack gap={2} sx={{ mt: 2 }}>
            <Typography variant="body2">- Create a post</Typography>
            <Typography variant="body2">- Find classmates</Typography>
            <Typography variant="body2">- Join club discussions</Typography>
          </Stack>
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
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Trending
            </Typography>
            <LocalFireDepartmentRoundedIcon fontSize="small" color="primary" />
          </Stack>
          <Divider sx={{ my: 2, opacity: 0.6 }} />
          <Stack gap={2}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 750 }}>
                #surrealdb
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Graph relationships and social features
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 750 }}>
                #graphql
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Queries, mutations, pagination
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 750 }}>
                #nextjs
              </Typography>
              <Typography variant="caption" color="text.secondary">
                App Router + scalable architecture
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 4, backgroundColor: "rgba(242, 243, 255, 0.6)", border: "none", boxShadow: "none" }}>
        <CardContent sx={{ py: 2.5 }}>
          <Typography variant="overline" color="text.secondary">
            Notes
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            This is UI-only. Replace mock sagas with GraphQL calls later.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}

export function FeedView() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.feed.items);
  const currentPage = useAppSelector((s) => s.feed.currentPage);
  const hasMore = useAppSelector((s) => s.feed.hasMore);
  const isLoading = useAppSelector((s) => s.feed.isLoading);
  const hasMounted = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      dispatch(feedActions.loadFeedRequested({ page: 1, limit: 10 }));
    }
  }, [dispatch]);

  // Infinite scroll observer
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      dispatch(feedActions.loadFeedRequested({ page: currentPage + 1, limit: 10 }));
    }
  }, [dispatch, isLoading, hasMore, currentPage]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (lastItemRef.current) {
      observerRef.current.observe(lastItemRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [loadMore, hasMore, isLoading, items.length]);

  return (
    <AuthGate>
      <AppShell>
        <ThreeColumn
          left={<LeftRail />}
          main={
            <Stack gap={3}>
              <ComposerCard />
              <Stack gap={3}>
                {items.map((p, index) => (
                  <div
                    key={p.id}
                    ref={index === items.length - 1 ? lastItemRef : null}
                  >
                    <PostCard post={p} />
                  </div>
                ))}
                {isLoading && (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}
              </Stack>
            </Stack>
          }
          right={<RightRail />}
        />
      </AppShell>
    </AuthGate>
  );
}
