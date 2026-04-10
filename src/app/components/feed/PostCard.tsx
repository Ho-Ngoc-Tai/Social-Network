"use client";

import Link from "next/link";
import { useState, useCallback } from "react";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

import { routes } from "../../constants/routes";
import { Post } from "../../types/post/post";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { feedActions } from "../../stores/reducers/feed/feedSlice";
import { useRouter } from "next/navigation";


function formatTime(iso: string) {
  const d = new Date(iso);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

export function PostCard({ post, variant = 'feed' }: { post: Post; variant?: 'feed' | 'profile' }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const likeLoading = useAppSelector((s) => s.feed.likeLoading[post.id] || false);
  const [isLiked, setIsLiked] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(post.likes_count);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState<Array<{ id: string; content: string; author: { id: string; full_name: string; avatar: string | null }; created_at: string }>>([]);
  const commentLoading = useAppSelector((s) => s.feed.commentLoading[post.id] || false);

  // Menu state for post actions
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEditPost = () => {
    handleMenuClose();
    console.log("[PostCard] Edit post clicked:", post.id);
    // TODO: Navigate to edit post or open edit dialog
    // router.push(`/posts/${post.id}/edit`);
  };

  const handleDeletePost = async () => {
    handleMenuClose();
    console.log("[PostCard] Delete post clicked:", post.id);
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      console.error("[PostCard] No token found");
      return;
    }
    
    try {
      const response = await fetch(`https://social-backend.bijancob.io.vn/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("[PostCard] Delete failed:", errorData);
        alert(errorData.message || `Failed to delete: ${response.status}`);
        return;
      }
      
      console.log("[PostCard] Post deleted successfully");
      // Refresh the feed
      dispatch(feedActions.loadFeedRequested({ page: 1, limit: 10 }));
    } catch (error) {
      console.error("[PostCard] Delete error:", error);
    }
  };

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

  const isProfile = variant === 'profile';

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        ...(isProfile && { width: '50%', mx: 'auto' }),
        borderRadius: 4,
        backgroundColor: "#ffffff",
        border: "none",
        boxShadow: "0 2px 12px rgba(99, 102, 241, 0.08)",
        transition: "all 200ms ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: isLiked 
            ? 'linear-gradient(90deg, #EC4899 0%, #F472B6 100%)' 
            : 'linear-gradient(90deg, #8B5CF6 0%, #22D3EE 100%)',
          opacity: isLiked ? 1 : 0.7,
          transition: 'opacity 200ms ease',
        },
        "&:hover": {
          backgroundColor: "#f8f9ff",
          boxShadow: "0 8px 28px rgba(99, 102, 241, 0.15)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ display: "flex", gap: 2, py: 2.5 }}>
        <Avatar 
          src={post.author.avatar || undefined} 
          alt={post.author.full_name} 
          sx={{ 
            width: 52, 
            height: 52, 
            cursor: 'pointer',
            border: '2px solid #ffffff',
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.2)',
            transition: 'transform 200ms ease',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
          component={Link}
          href={routes.profile(encodeURIComponent(post.author.id))}
          onClick={handleAuthorClick}
        />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            <Box sx={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                component={Link}
                href={routes.profile(encodeURIComponent(post.author.id))}
                onClick={handleAuthorClick}
                variant="subtitle1"
                sx={{ 
                  fontWeight: 700, 
                  textDecoration: "none",
                  color: '#1A1F3C',
                  letterSpacing: '-0.01em',
                }}
              >
                {post.author.full_name}
              </Typography>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#00c853',
                  ml: 0.5,
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  whiteSpace: "nowrap",
                  color: '#4A5568',
                  fontWeight: 500,
                }}
              >
                {formatTime(post.created_at)}
              </Typography>
              <IconButton onClick={handleMenuOpen}>
                <MoreHorizOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>
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
            <Box sx={{ mt: 2.5, mx: 0, display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
              {post.image && (
                <Box sx={{ 
                  position: 'relative', 
                  width: '100%', 
                  maxWidth: 560, 
                  height: 320, 
                  borderRadius: 3, 
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                }}>
                  <Image
                    src={post.image}
                    alt="Post image"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.1) 100%)',
                    pointerEvents: 'none',
                  }} />
                </Box>
              )}
              {post.files?.map((fileUrl, idx) => (
                <Box key={idx} sx={{ 
                  position: 'relative', 
                  width: isProfile ? '48%' : '48%', 
                  maxWidth: 280, 
                  height: 200, 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                }}>
                  <Image
                    src={fileUrl}
                    alt={`Post image ${idx + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </Box>
              ))}
            </Box>
          )}

          <Box sx={{ mt: 3, display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Like Button */}
              <Box
                onClick={handleLikeClick}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  py: 0.75,
                  px: 1.5,
                  borderRadius: 999,
                  backgroundColor: isLiked ? 'rgba(233, 30, 99, 0.08)' : 'rgba(0, 76, 237, 0.06)',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  '&:hover': {
                    backgroundColor: isLiked ? 'rgba(233, 30, 99, 0.15)' : 'rgba(0, 76, 237, 0.12)',
                    transform: 'scale(1.02)',
                  },
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
                      color: '#004ced',
                      transition: 'all 0.2s ease'
                    }} 
                  />
                )}
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: isLiked ? 600 : 500,
                    color: isLiked ? '#e91e63' : '#004ced',
                  }}
                >
                  {localLikesCount}
                </Typography>
              </Box>

              {/* Comment Button */}
              <Box
                onClick={handleCommentClick}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  py: 0.75,
                  px: 1.5,
                  borderRadius: 999,
                  backgroundColor: showCommentInput ? 'rgba(0, 76, 237, 0.12)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 76, 237, 0.08)',
                  },
                }}
              >
                <ChatBubbleOutlineRoundedIcon 
                  fontSize="small" 
                  sx={{ color: showCommentInput ? '#004ced' : '#5e5e5e' }}
                />
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: showCommentInput ? '#004ced' : '#5e5e5e',
                  }}
                >
                  {post.comments_count}
                </Typography>
              </Box>

              {/* Share Button */}
              <IconButton
                size="small"
                sx={{
                  p: 0.75,
                  color: '#4A5568',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 76, 237, 0.08)',
                    color: '#004ced',
                  },
                }}
              >
                <ShareOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Bookmark */}
            <IconButton
              size="small"
              sx={{
                p: 0.75,
                color: '#4A5568',
                '&:hover': {
                  backgroundColor: 'rgba(0, 76, 237, 0.08)',
                  color: '#004ced',
                },
              }}
            >
              <BookmarkBorderOutlinedIcon fontSize="small" />
            </IconButton>
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
