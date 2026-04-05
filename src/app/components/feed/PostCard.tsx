"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";

import { routes } from "../../constants/routes";
import { Post } from "../../types/post/post";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { feedActions } from "../../stores/reducers/feed/feedSlice";

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric" });
}

export function PostCard({ post }: { post: Post }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const likeLoading = useAppSelector((s) => s.feed.likeLoading[post.id] || false);

  const handleCardClick = () => {
    router.push(`/posts/${post.id}`);
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Like clicked for post:', post.id);
    dispatch(feedActions.likePostRequested({ postId: post.id }));
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        borderRadius: 3,
        backgroundColor: "rgba(255,255,255,0.72)",
        border: "none",
        boxShadow: "none",
        transition: "background-color 120ms ease",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "rgba(250, 248, 255, 0.85)",
        },
      }}
    >
      <CardContent sx={{ display: "flex", gap: 2, py: 2.5 }}>
        <Avatar src={post.author.avatar || undefined} alt={post.author.full_name} sx={{ width: 48, height: 48 }} />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                component={Link}
                href={routes.profile(post.author.id)}
                onClick={handleAuthorClick}
                variant="subtitle1"
                sx={{ fontWeight: 750, textDecoration: "none" }}
              >
                {post.author.full_name}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
              {formatTime(post.created_at)}
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ mt: 1.5, whiteSpace: "pre-wrap", fontSize: "1rem" }}>
            {post.content}
          </Typography>

          <Box sx={{ mt: 2.5, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5 }}>
            <Chip
              icon={
                <IconButton 
                  size="small" 
                  onClick={handleLikeClick}
                  disabled={likeLoading}
                  sx={{ 
                    p: 0.5,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(255,0,0,0.1)' }
                  }}
                >
                  {likeLoading ? (
                    <Box component="span" sx={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid currentColor', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <FavoriteBorderRoundedIcon fontSize="small" />
                  )}
                </IconButton>
              }
              label={post.likes_count}
              variant="filled"
              sx={{ borderRadius: 999, backgroundColor: "rgba(226,231,255,1)", height: 32 }}
            />
            <Chip
              icon={<ModeCommentOutlinedIcon fontSize="small" />}
              label={post.comments_count}
              variant="filled"
              sx={{ borderRadius: 999, backgroundColor: "rgba(226,231,255,1)", height: 28 }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
