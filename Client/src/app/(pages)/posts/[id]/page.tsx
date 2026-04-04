"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";

import { useAppSelector } from "../../../hooks/storeHooks";
import { NEXT_FEED_DETAIL_ENDPOINT } from "../../../routes/next.api";
import { routes } from "../../../constants/routes";
import { Post } from "../../../types/post/post";

function formatFullDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  
  const authStatus = useAppSelector((s) => s.auth.status);
  const currentUserEmail = useAppSelector((s) => s.auth.email);
  const isAuthenticated = authStatus === "authenticated";

  useEffect(() => {
    if (!id) return;
    
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        
        const response = await fetch(NEXT_FEED_DETAIL_ENDPOINT(id), {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        
        if (!response.ok) {
          throw new Error(`Failed to load post: ${response.status}`);
        }
        
        const data = await response.json();
        setPost(data.data || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);

  const handleLike = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setLiked(!liked);
    // TODO: Call like API
  };

  const handleComment = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    // TODO: Open comment input
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Post',
        text: post?.content || '',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleEdit = () => {
    // TODO: Open edit modal
  };

  const handleDelete = () => {
    // TODO: Confirm and delete
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back
        </Button>
        <Card sx={{ borderRadius: 3, textAlign: "center", py: 6 }}>
          <Typography color="error" variant="h6">
            {error || 'Post not found'}
          </Typography>
          <Button variant="contained" onClick={() => router.push('/feed')} sx={{ mt: 2 }}>
            Go to Feed
          </Button>
        </Card>
      </Container>
    );
  }

  const isAuthor = isAuthenticated && currentUserEmail === post.author.username;

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Post
        </Typography>
      </Box>

      {/* Post Card */}
      <Card
        sx={{
          borderRadius: 3,
          backgroundColor: "rgba(255,255,255,0.9)",
          border: "none",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Author */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar
              src={post.author.avatar || undefined}
              alt={post.author.full_name}
              sx={{ width: 48, height: 48 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 750, cursor: "pointer" }}
                onClick={() => router.push(routes.profile(post.author.id))}
              >
                {post.author.full_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                @{post.author.username} · {formatFullDate(post.created_at)}
              </Typography>
            </Box>
            {isAuthor && (
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton size="small" onClick={handleEdit}>
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={handleDelete}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Content */}
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-wrap",
              fontSize: "1.1rem",
              lineHeight: 1.6,
              mb: post.image ? 2 : 0,
            }}
          >
            {post.content}
          </Typography>

          {/* Image */}
          {post.image && (
            <Box
              component="img"
              src={post.image}
              alt="Post image"
              sx={{
                width: "100%",
                maxHeight: 400,
                objectFit: "cover",
                borderRadius: 2,
                mb: 2,
              }}
            />
          )}

          {/* Files */}
          {post.files && post.files.length > 0 && (
            <Box sx={{ mb: 2 }}>
              {post.files.map((file, index) => (
                <Chip
                  key={index}
                  label={`File ${index + 1}`}
                  variant="outlined"
                  sx={{ mr: 1, mb: 1 }}
                  onClick={() => window.open(file, '_blank')}
                />
              ))}
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Stats */}
          <Box sx={{ display: "flex", gap: 3, mb: 2, color: "text.secondary" }}>
            <Typography variant="body2">
              <strong>{post.likes_count + (liked ? 1 : 0)}</strong> likes
            </Typography>
            <Typography variant="body2">
              <strong>{post.comments_count}</strong> comments
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Actions */}
          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <Button
              startIcon={liked ? <FavoriteRoundedIcon color="error" /> : <FavoriteBorderRoundedIcon />}
              onClick={handleLike}
              sx={{
                color: liked ? "error.main" : "text.secondary",
                fontWeight: liked ? 600 : 400,
              }}
            >
              Like
            </Button>
            <Button
              startIcon={<ModeCommentOutlinedIcon />}
              onClick={handleComment}
              sx={{ color: "text.secondary" }}
            >
              Comment
            </Button>
            <Button
              startIcon={<ShareOutlinedIcon />}
              onClick={handleShare}
              sx={{ color: "text.secondary" }}
            >
              Share
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Comments Section Placeholder */}
      <Card sx={{ borderRadius: 3, mt: 2, p: 3, backgroundColor: "rgba(242, 243, 255, 0.6)" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Comments
        </Typography>
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          No comments yet. Be the first to comment!
        </Typography>
      </Card>
    </Container>
  );
}
