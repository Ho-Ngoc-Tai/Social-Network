"use client";

import { useState, useCallback, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { feedActions } from "../../stores/reducers/feed/feedSlice";

export interface CommentAuthor {
  id: string;
  full_name: string;
  avatar: string | null;
}

import type { Comment } from "../../types/post/post";

interface CommentTreeProps {
  postId: string;
  comments: Comment[];
}

// Merge API comments with localStorage parent cache
async function mergeWithParentCache(postId: string, comments: Comment[]): Promise<Comment[]> {
  if (typeof window === 'undefined') return comments;
  try {
    const { getCommentParents } = await import('../../hooks/useCommentCache');
    const cache = getCommentParents(postId);
    return comments.map((c: Comment) => ({
      ...c,
      parent: cache[c.id] !== undefined ? cache[c.id] : c.parent
    }));
  } catch {
    return comments;
  }
}

// Build nested comment tree
function buildCommentTree(comments: Comment[]): (Comment & { replies?: Comment[] })[] {
  const commentMap = new Map<string, Comment & { replies?: Comment[] }>();
  const roots: (Comment & { replies?: Comment[] })[] = [];

  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  comments.forEach(comment => {
    const node = commentMap.get(comment.id)!;
    if (comment.parent && commentMap.has(comment.parent)) {
      const parent = commentMap.get(comment.parent)!;
      if (!parent.replies) parent.replies = [];
      parent.replies.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  return date.toLocaleDateString();
}

function CommentItem({ 
  comment, 
  postId, 
  depth = 0 
}: { 
  comment: Comment & { replies?: Comment[] }; 
  postId: string; 
  depth?: number;
}) {
  const dispatch = useAppDispatch();
  const [isLiked, setIsLiked] = useState(comment.is_liked || false);
  const [localLikes, setLocalLikes] = useState(comment.likes_count || 0);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(depth < 1);
  const [replyContent, setReplyContent] = useState("");
  const currentUser = useAppSelector((s) => s.auth.user);
  const isCurrentUser = currentUser?.id === comment.author.id;

  const handleLike = useCallback(() => {
    setIsLiked(!isLiked);
    setLocalLikes(isLiked ? localLikes - 1 : localLikes + 1);
  }, [isLiked, localLikes]);

  const handleReplySubmit = useCallback(() => {
    if (!replyContent.trim()) return;
    
    // Generate tempId for optimistic update (only for real comments)
    const tempId = comment.id.startsWith('temp-') 
      ? undefined 
      : `temp-${Date.now()}`;
    
    dispatch(feedActions.commentPostRequested({ 
      postId, 
      content: replyContent.trim(),
      parentId: comment.id,
      tempId 
    }));
    
    setReplyContent("");
    setShowReplyInput(false);
    setShowReplies(true);
  }, [dispatch, postId, replyContent, comment.id]);

  const hasReplies = comment.replies && comment.replies.length > 0;
  const replyCount = comment.replies?.length || comment.replies_count || 0;

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      {/* Left column: Avatar + Thread line */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mr: 1.5, flexShrink: 0, alignSelf: 'stretch' }}>
        {/* Line from top (for reply connecting to parent) */}
        {depth > 0 && (
          <Box sx={{ width: 2, height: 12, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 1 }} />
        )}
        <Avatar 
          src={comment.author.avatar || undefined} 
          alt={comment.author.full_name} 
          sx={{ width: 32, height: 32 }} 
        />
        {/* Vertical thread line down (if has replies) */}
        {hasReplies && showReplies && (
          <Box sx={{ width: 2, flex: 1, backgroundColor: 'rgba(0,0,0,0.1)', mt: 0.5, borderRadius: 1 }} />
        )}
      </Box>
      
      {/* Right column: Comment content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Comment Bubble */}
        <Box sx={{ backgroundColor: "rgba(240,242,245,1)", borderRadius: 2, p: 1.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
              {comment.author.full_name}
            </Typography>
            
            {isCurrentUser && (
              <IconButton size="small" sx={{ p: 0.5, ml: 1 }}>
                <MoreHorizIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          
          <Typography variant="body2" sx={{ mt: 0.5, wordBreak: "break-word" }}>
            {comment.content}
          </Typography>
        </Box>

        {/* Comment Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 0.5, ml: 0.5 }}>
          <Button
            size="small"
            onClick={handleLike}
            sx={{ 
              minWidth: "auto", 
              p: 0.25,
              fontSize: "0.75rem",
              fontWeight: 600,
              color: isLiked ? "#1877f2" : "#65676b",
              textTransform: "none"
            }}
          >
            Like
          </Button>
          
          <Button
            size="small"
            onClick={() => setShowReplyInput(!showReplyInput)}
            disabled={comment.id.startsWith('temp-')}
            sx={{ 
              minWidth: "auto", 
              p: 0.25,
              fontSize: "0.75rem",
              fontWeight: 600,
              color: comment.id.startsWith('temp-') ? '#ccc' : '#65676b',
              textTransform: "none"
            }}
          >
            Reply
          </Button>
          
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
            {formatTime(comment.created_at)}
          </Typography>
          
          {localLikes > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ThumbUpIcon sx={{ fontSize: 14, color: "#1877f2" }} />
              <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "#65676b" }}>
                {localLikes}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Reply Input */}
        {showReplyInput && (
          <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
            <Avatar 
              src={currentUser?.avatar || undefined} 
              alt={currentUser?.full_name || "You"} 
              sx={{ width: 28, height: 28 }} 
            />
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder={`Reply to ${comment.author.full_name}...`}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 5,
                    backgroundColor: 'rgba(240,242,245,1)',
                    fontSize: '0.875rem'
                  }
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
                <Button size="small" onClick={() => setShowReplyInput(false)}>
                  Cancel
                </Button>
                <Button 
                  size="small" 
                  variant="contained"
                  disabled={!replyContent.trim()}
                  onClick={handleReplySubmit}
                >
                  Reply
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {/* Show/Hide Replies */}
        {hasReplies && !showReplies && (
          <Button
            size="small"
            onClick={() => setShowReplies(true)}
            sx={{ mt: 1, fontSize: "0.875rem", fontWeight: 600, color: "#1877f2" }}
            startIcon={<KeyboardArrowDownIcon />}
          >
            {replyCount} {replyCount === 1 ? "Reply" : "Replies"}
          </Button>
        )}

        {/* Nested Replies */}
        {hasReplies && showReplies && (
          <Box sx={{ mt: 1, display: 'flex' }}>
            {/* Thread line: vertical down + horizontal hook to child avatar */}
            <Box sx={{ width: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 1.5, flexShrink: 0 }}>
              {/* Vertical line down from parent avatar */}
            </Box>
            {/* Replies */}
            <Box sx={{ flex: 1 }}>
              {depth === 0 && (
                <Button
                  size="small"
                  onClick={() => setShowReplies(false)}
                  sx={{ mb: 1, fontSize: "0.875rem", fontWeight: 600, color: "#1877f2" }}
                  startIcon={<KeyboardArrowUpIcon />}
                >
                  Hide Replies
                </Button>
              )}
              {comment.replies!.map((reply) => (
                <Box key={reply.id} sx={{ mt: 1.5 }}>
                  <CommentItem comment={reply} postId={postId} depth={depth + 1} />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export function CommentTree({ postId, comments }: CommentTreeProps) {
  const [processedComments, setProcessedComments] = useState<Comment[]>(comments);
  
  useEffect(() => {
    mergeWithParentCache(postId, comments).then(result => {
      setProcessedComments(result);
    });
  }, [postId, comments]);
  
  const commentTree = buildCommentTree(processedComments);

  if (commentTree.length === 0) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
      {commentTree.map((comment) => (
        <Box key={comment.id}>
          <CommentItem comment={comment} postId={postId} depth={0} />
        </Box>
      ))}
    </Box>
  );
}

export default CommentTree;
