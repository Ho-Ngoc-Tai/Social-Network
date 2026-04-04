"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";

import { routes } from "../../constants/routes";
import { Post } from "../../types/post/post";

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric" });
}

export function PostCard({ post }: { post: Post }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/posts/${post.id}`);
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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
              icon={<FavoriteBorderRoundedIcon fontSize="small" />}
              label={post.likes_count}
              variant="filled"
              sx={{ borderRadius: 999, backgroundColor: "rgba(226,231,255,1)", height: 28 }}
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
