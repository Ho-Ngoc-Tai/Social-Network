"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { CommentTree } from "./CommentTree";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
import { profileActions } from "../../stores/reducers/profile/profileSlice";
import { useRouter } from "next/navigation";
import { NEXT_FEED_UPDATE_ENDPOINT } from "../../routes/next.api";

function formatTime(iso: string) {
  const d = new Date(iso);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

export function PostCard({ post, variant = 'feed' }: { post: Post; variant?: 'feed' | 'profile' }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLiked, setIsLiked] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(post.likes_count);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const comments = post.comments || [];
  const commentLoading = useAppSelector((s) => s.feed.commentLoading[post.id] || false);

  // Menu state for post actions
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editLoading, setEditLoading] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEditClick = () => {
    handleMenuClose();
    setEditDialogOpen(true);
  };

  const handleUpdatePost = async () => {
    setEditLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const url = NEXT_FEED_UPDATE_ENDPOINT(post.id);
      
      console.log('[PostCard] Update URL:', url);
      console.log('[PostCard] Token:', token ? 'present' : 'missing');
      
      // Try using POST to Next.js API route which forwards to backend
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          content: editContent,
          image: post.image || '',
        }),
      });
      
      if (response.ok) {
        setEditDialogOpen(false);
        // Update post in store
        if (variant === 'profile') {
          dispatch(profileActions.updateProfilePost({ 
            postId: post.id, 
            content: editContent 
          }));
        } else {
          dispatch(feedActions.updatePostSucceeded({ 
            postId: post.id, 
            content: editContent 
          }));
        }
      } else {
        console.error('Failed to update post:', await response.text());
      }
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setEditLoading(false);
    }
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
      const NEXT_POSTS_ENDPOINT = process.env.NEXT_PUBLIC_POSTS_ENDPOINT || 'https://social-backend.bijancob.io.vn/posts';
      
      const response = await fetch(`${NEXT_POSTS_ENDPOINT}/${post.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      
      if (response.ok) {
        // Remove post from correct Redux store immediately
        if (variant === 'profile') {
          dispatch(profileActions.deleteProfilePost({ postId: post.id }));
        } else {
          dispatch(feedActions.deletePostSucceeded({ postId: post.id }));
        }
      } else {
        console.error('Failed to delete post:', await response.text());
      }
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
    
    dispatch(feedActions.commentPostRequested({ postId: post.id, content: commentContent.trim() }));
    setCommentContent('');
    setShowCommentInput(false);
  }, [dispatch, post.id, commentContent]);

  const isProfile = variant === 'profile';

  return (
    <>
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
              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                onClick={(e) => e.stopPropagation()}
                PaperProps={{
                  sx: {
                    minWidth: 120,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  }
                }}
              >
                <MenuItem onClick={handleEditClick}>
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDeletePost} sx={{ color: "#d32f2f" }}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" sx={{ color: "#d32f2f" }} />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </Menu>
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

          {/* Comments Tree */}
          {comments.length > 0 && (
            <Box onClick={(e) => e.stopPropagation()}>
              <CommentTree postId={post.id} comments={comments} />
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
    
    {/* Edit Post Dialog */}
    <Dialog 
      open={editDialogOpen} 
      onClose={() => setEditDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Edit Post</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="What's on your mind?"
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
        <Button 
          onClick={handleUpdatePost} 
          variant="contained" 
          disabled={!editContent.trim() || editLoading}
        >
          {editLoading ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
}
