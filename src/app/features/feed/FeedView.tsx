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
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import FlashOnRoundedIcon from "@mui/icons-material/FlashOnRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

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
      {/* For You Card */}
      <Card sx={{ 
        borderRadius: 3, 
        background: "linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)",
        border: "1px solid rgba(102,126,234,0.2)",
        boxShadow: "0 4px 20px rgba(102,126,234,0.1)",
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        }
      }}>
        <CardContent sx={{ py: 2.5 }}>
          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
            <ExploreRoundedIcon sx={{ color: "#667eea", fontSize: 18 }} />
            <Typography variant="overline" sx={{ 
              color: "#667eea", 
              fontWeight: 700,
              letterSpacing: "0.08em",
              fontSize: "0.7rem",
            }}>
              FOR YOU
            </Typography>
          </Stack>
          <Stack direction="row" gap={1} flexWrap="wrap">
            <Chip 
              label="Campus" 
              icon={<FlashOnRoundedIcon sx={{ fontSize: 14 }} />}
              sx={{ 
                borderRadius: 999, 
                background: "linear-gradient(135deg, #667eea20 0%, #764ba220 100%)",
                border: "1px solid rgba(102,126,234,0.3)",
                height: 32,
                fontWeight: 600,
                fontSize: "0.8rem",
                color: "#5a67d8",
                "& .MuiChip-icon": { color: "#667eea" }
              }} 
            />
            <Chip 
              label="Projects" 
              sx={{ 
                borderRadius: 999, 
                background: "linear-gradient(135deg, #764ba220 0%, #f093fb20 100%)",
                border: "1px solid rgba(118,75,162,0.3)",
                height: 32,
                fontWeight: 600,
                fontSize: "0.8rem",
                color: "#764ba2",
              }} 
            />
            <Chip 
              label="Events" 
              sx={{ 
                borderRadius: 999, 
                background: "linear-gradient(135deg, #f093fb20 0%, #f5576c20 100%)",
                border: "1px solid rgba(240,147,251,0.3)",
                height: 32,
                fontWeight: 600,
                fontSize: "0.8rem",
                color: "#d53f8c",
              }} 
            />
            <Chip 
              label="Research" 
              sx={{ 
                borderRadius: 999, 
                background: "linear-gradient(135deg, #4facfe20 0%, #00f2fe20 100%)",
                border: "1px solid rgba(79,172,254,0.3)",
                height: 32,
                fontWeight: 600,
                fontSize: "0.8rem",
                color: "#3182ce",
              }} 
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card sx={{ 
        borderRadius: 3, 
        background: "linear-gradient(135deg, rgba(118,75,162,0.08) 0%, rgba(240,147,251,0.08) 100%)",
        border: "1px solid rgba(118,75,162,0.15)",
        boxShadow: "0 4px 20px rgba(118,75,162,0.08)",
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #764ba2 0%, #f093fb 100%)",
        }
      }}>
        <CardContent sx={{ py: 2.5 }}>
          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
            <FlashOnRoundedIcon sx={{ color: "#764ba2", fontSize: 18 }} />
            <Typography variant="overline" sx={{ 
              color: "#764ba2", 
              fontWeight: 700,
              letterSpacing: "0.08em",
              fontSize: "0.7rem",
            }}>
              QUICK ACTIONS
            </Typography>
          </Stack>
          <Stack gap={1.5} sx={{ mt: 2 }}>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              background: "linear-gradient(135deg, #667eea10 0%, #764ba210 100%)",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": { background: "linear-gradient(135deg, #667eea20 0%, #764ba220 100%)", transform: "translateX(4px)" }
            }}>
              <AddCircleRoundedIcon sx={{ color: "#667eea", fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#4a5568" }}>Create a post</Typography>
            </Box>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              background: "linear-gradient(135deg, #764ba210 0%, #f093fb10 100%)",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": { background: "linear-gradient(135deg, #764ba220 0%, #f093fb20 100%)", transform: "translateX(4px)" }
            }}>
              <SearchRoundedIcon sx={{ color: "#764ba2", fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#4a5568" }}>Find classmates</Typography>
            </Box>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              background: "linear-gradient(135deg, #f093fb10 0%, #f5576c10 100%)",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": { background: "linear-gradient(135deg, #f093fb20 0%, #f5576c20 100%)", transform: "translateX(4px)" }
            }}>
              <ForumRoundedIcon sx={{ color: "#d53f8c", fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#4a5568" }}>Join discussions</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

function RightRail() {
  return (
    <Stack gap={3} sx={{ position: "sticky", top: 96 }}>
      {/* Trending Card */}
      <Card sx={{ 
        borderRadius: 3, 
        background: "linear-gradient(135deg, rgba(240,147,251,0.1) 0%, rgba(245,87,108,0.1) 100%)",
        border: "1px solid rgba(240,147,251,0.2)",
        boxShadow: "0 4px 20px rgba(240,147,251,0.1)",
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #f093fb 0%, #f5576c 100%)",
        }
      }}>
        <CardContent sx={{ py: 2.5 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" gap={1}>
              <LocalFireDepartmentRoundedIcon sx={{ color: "#f5576c", fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ 
                fontWeight: 800, 
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Trending
              </Typography>
            </Stack>
            <Box sx={{ 
              px: 1.5, 
              py: 0.5, 
              borderRadius: 999, 
              background: "linear-gradient(135deg, #f093fb30 0%, #f5576c30 100%)",
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "#d53f8c",
            }}>
              HOT
            </Box>
          </Stack>
          <Divider sx={{ my: 2, opacity: 0.4, background: "linear-gradient(90deg, transparent, rgba(240,147,251,0.5), transparent)" }} />
          <Stack gap={2}>
            {[
              { tag: "#surrealdb", desc: "Graph relationships", color: "#667eea" },
              { tag: "#graphql", desc: "Queries & mutations", color: "#764ba2" },
              { tag: "#nextjs", desc: "App Router architecture", color: "#f093fb" },
            ].map((item) => (
              <Box key={item.tag} sx={{ 
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": { transform: "translateX(4px)" }
              }}>
                <Typography variant="subtitle2" sx={{ 
                  fontWeight: 750,
                  color: item.color,
                }}>
                  {item.tag}
                </Typography>
                <Typography variant="caption" sx={{ color: "#718096", fontWeight: 500 }}>
                  {item.desc}
                </Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Notes Card */}
      <Card sx={{ 
        borderRadius: 3, 
        background: "linear-gradient(135deg, rgba(79,172,254,0.08) 0%, rgba(0,242,254,0.08) 100%)",
        border: "1px solid rgba(79,172,254,0.15)",
        boxShadow: "0 4px 20px rgba(79,172,254,0.08)",
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
        }
      }}>
        <CardContent sx={{ py: 2.5 }}>
          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
            <InfoRoundedIcon sx={{ color: "#3182ce", fontSize: 18 }} />
            <Typography variant="overline" sx={{ 
              color: "#3182ce", 
              fontWeight: 700,
              letterSpacing: "0.08em",
              fontSize: "0.7rem",
            }}>
              INFO
            </Typography>
          </Stack>
          <Box sx={{ 
            p: 2, 
            borderRadius: 2, 
            background: "linear-gradient(135deg, #4facfe15 0%, #00f2fe15 100%)",
            border: "1px dashed rgba(79,172,254,0.3)",
          }}>
            <Typography variant="body2" sx={{ 
              color: "#4a5568",
              fontWeight: 500,
              lineHeight: 1.6,
            }}>
              🚀 This is a demo version. Connect with your classmates and explore the campus community!
            </Typography>
          </Box>
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
