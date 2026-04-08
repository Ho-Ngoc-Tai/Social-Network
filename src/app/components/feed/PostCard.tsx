"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
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
  const [isLiked, setIsLiked] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(post.likes_count);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState<Array<{ id: string; content: string; author: { id: string; full_name: string; avatar: string | null }; created_at: string }>>([]);
  const commentLoading = useAppSelector((s) => s.feed.commentLoading[post.id] || false);

  const handleCardClick = () => {
    router.push(`/posts/${post.id}`);
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleLikeClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Optimistic update: immediately show red heart and increment count
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLocalLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    dispatch(feedActions.likePostRequested({ postId: post.id }));
  }, [isLiked, post.id, dispatch]);

  const handleCommentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowCommentInput(!showCommentInput);
  }, [showCommentInput]);

  const handleSubmitComment = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!commentContent.trim()) return;
    
    // Optimistic: add comment immediately to local state
    const newComment = {
      id: `temp-${Date.now()}`,
      content: commentContent.trim(),
      author: { id: 'current-user', full_name: 'You', avatar: null },
      created_at: new Date().toISOString(),
    };
    setComments(prev => [newComment, ...prev]);
    
    dispatch(feedActions.commentPostRequested({ postId: post.id, content: commentContent.trim() }));
    setCommentContent('');
    setShowCommentInput(false);
  }, [dispatch, post.id, commentContent]);

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
        <Avatar 
          src={post.author.avatar || undefined} 
          alt={post.author.full_name} 
          sx={{ width: 48, height: 48, cursor: 'pointer' }}
          component={Link}
          href={routes.profile(encodeURIComponent(post.author.id))}
          onClick={handleAuthorClick}
        />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                component={Link}
                href={routes.profile(encodeURIComponent(post.author.id))}
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

          <Box 
            sx={{ 
              mt: 1.5, 
              fontSize: "1rem",
              lineHeight: 1.6,
              '& h1, & h2, & h3': {
                margin: '16px 0 8px',
                fontWeight: 600,
              },
              '& ul, & ol': {
                margin: '8px 0',
                paddingLeft: 24,
              },
              '& li': {
                margin: '4px 0',
              },
              '& img': {
                maxWidth: '100%',
                borderRadius: 2,
                margin: '8px 0',
              },
              '& a': {
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
              '& strong': {
                fontWeight: 700,
              },
              '& em': {
                fontStyle: 'italic',
              },
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Display images if any */}
          {(post.image || (post.files && post.files.length > 0)) && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {post.image && (
                <Box sx={{ position: 'relative', width: '100%', height: 400, borderRadius: 2, overflow: 'hidden' }}>
                  <Image
                    src={post.image}
                    alt="Post image"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </Box>
              )}
              {post.files?.map((fileUrl, idx) => (
                <Box key={idx} sx={{ position: 'relative', width: '100%', height: 400, borderRadius: 2, overflow: 'hidden' }}>
                  <Image
                    src={fileUrl}
                    alt={`Post image ${idx + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </Box>
              ))}
            </Box>
          )}

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
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      backgroundColor: isLiked ? 'rgba(255,0,0,0.15)' : 'rgba(255,0,0,0.1)',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  {isLiked ? (
                    <FavoriteRoundedIcon 
                      fontSize="small" 
                      sx={{ 
                        color: '#e91e63',
                        transition: 'all 0.2s ease',
                        transform: 'scale(1)'
                      }} 
                    />
                  ) : (
                    <FavoriteBorderRoundedIcon 
                      fontSize="small" 
                      sx={{ 
                        color: 'text.secondary',
                        transition: 'all 0.2s ease'
                      }} 
                    />
                  )}
                </IconButton>
              }
              label={localLikesCount}
              variant="filled"
              sx={{ 
                borderRadius: 999, 
                backgroundColor: isLiked ? "rgba(255,235,238,1)" : "rgba(226,231,255,1)", 
                height: 32,
                transition: 'all 0.2s ease',
                '& .MuiChip-label': {
                  color: isLiked ? '#e91e63' : 'inherit',
                  fontWeight: isLiked ? 600 : 400
                }
              }}
            />
            <Chip
              icon={
                <IconButton 
                  size="small" 
                  onClick={handleCommentClick}
                  disabled={commentLoading}
                  sx={{ p: 0.5 }}
                >
                  <ModeCommentOutlinedIcon fontSize="small" />
                </IconButton>
              }
              label={post.comments_count}
              variant="filled"
              sx={{ borderRadius: 999, backgroundColor: showCommentInput ? "rgba(200,230,255,1)" : "rgba(226,231,255,1)", height: 28, cursor: 'pointer' }}
              onClick={handleCommentClick}
            />
          </Box>

          {/* Comments List */}
          {comments.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {comments.map((comment) => (
                <Box key={comment.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <Avatar 
                    src={comment.author.avatar || undefined} 
                    alt={comment.author.full_name} 
                    sx={{ width: 32, height: 32 }} 
                  />
                  <Box sx={{ flex: 1, backgroundColor: 'rgba(240,242,245,1)', borderRadius: 2, p: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {comment.author.full_name}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {comment.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {formatTime(comment.created_at)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Comment Input */}
          {showCommentInput && (
            <Box 
              component="form" 
              onSubmit={handleSubmitComment}
              onClick={(e) => e.stopPropagation()}
              sx={{ mt: 2, display: 'flex', gap: 1 }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Write a comment..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                disabled={commentLoading}
                autoFocus
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.8)'
                  }
                }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                size="small"
                disabled={!commentContent.trim() || commentLoading}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                {commentLoading ? '...' : 'Post'}
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
