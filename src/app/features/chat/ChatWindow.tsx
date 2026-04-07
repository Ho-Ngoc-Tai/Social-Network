"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import SendIcon from "@mui/icons-material/Send";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { chatActions } from "../../stores/reducers/chat/chatSlice";
import { formatDistanceToNow } from "../../utils/date";

interface ChatWindowProps {
  conversationId: string;
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const dispatch = useAppDispatch();
  const [input, setInput] = useState("");
  const messages = useAppSelector((s) => s.chat.messages);
  const isLoadingMessages = useAppSelector((s) => s.chat.isLoadingMessages);
  const conversations = useAppSelector((s) => s.chat.conversations);
  const authUserId = useAppSelector((s) => s.auth.user?.id);

  const conversation = conversations.find((c) => c.conversation_id === conversationId);
  const peerId = useMemo(() => conversation?.peer_id || "Unknown", [conversation?.peer_id]);

  useEffect(() => {
    if (peerId && peerId !== "Unknown") {
      dispatch(chatActions.loadMessagesRequested({ peerId }));
    }
  }, [dispatch, peerId]);

  const handleSend = useCallback(() => {
    if (!input.trim() || !peerId || peerId === "Unknown") return;
    
    dispatch(chatActions.sendMessageRequested({ 
      receiverId: peerId, 
      content: input.trim() 
    }));
    setInput("");
  }, [dispatch, input, peerId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoadingMessages) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "#faf8ff" }}>
        <CircularProgress sx={{ color: "#131b2e" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ height: "calc(100vh - 64px)", display: "flex", flexDirection: "column", bgcolor: "#faf8ff" }}>
      {/* Messages - Tonal layering */}
      <Box sx={{ 
        flex: 1, 
        overflowY: "auto", 
        p: 3, 
        bgcolor: "#f2f3ff",
        display: "flex",
        flexDirection: "column",
        gap: 2
      }}>
        {messages.length === 0 ? (
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            height: "100%",
            flexDirection: "column",
            gap: 2
          }}>
            <Typography 
              sx={{ 
                color: "#5e5e5e", 
                fontSize: "1rem",
                textAlign: "center"
              }}
            >
              Start chatting with {peerId === "Unknown" ? "your friend" : peerId}
            </Typography>
          </Box>
        ) : (
          messages.map((message, index) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              authUserId={authUserId}
              isLast={index === messages.length - 1}
            />
          ))
        )}
      </Box>

      {/* Input */}
      <Box sx={{ 
        p: 2, 
        bgcolor: "#ffffff",
        borderTop: "1px solid rgba(0,0,0,0.06)"
      }}>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", maxWidth: 900, mx: "auto" }}>
          <TextField
            fullWidth
            placeholder={`Message ${peerId === "Unknown" ? "" : peerId}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!peerId || peerId === "Unknown"}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#f8f9fa",
                borderRadius: 2,
                border: "none",
                fontSize: "0.9375rem",
                color: "#131b2e",
                "& fieldset": {
                  border: "none"
                },
                "&.Mui-focused": {
                  bgcolor: "#f0f1f3"
                }
              }
            }}
          />
          <IconButton 
            onClick={handleSend}
            disabled={!input.trim() || !peerId || peerId === "Unknown"}
            sx={{ 
              bgcolor: input.trim() ? "#131b2e" : "#e9ecef",
              color: input.trim() ? "#fff" : "#adb5bd",
              width: 40,
              height: 40,
              borderRadius: 2,
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: input.trim() ? "#004ced" : "#e9ecef"
              }
            }}
          >
            <SendIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

function MessageBubble({ 
  message, 
  authUserId
}: { 
  message: { id: string; sender: string; content: string; created_at: string }; 
  authUserId?: string;
  isLast?: boolean;
}) {
  const normalizeId = (id?: string) => id?.replace(/^user:/, "") || "";
  const normalizedSender = normalizeId(message.sender);
  const normalizedAuth = normalizeId(authUserId);
  const isMe = normalizedSender === normalizedAuth && !!authUserId;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isMe ? "flex-end" : "flex-start",
        width: "100%",
      }}
    >
      <Box
        sx={{
          maxWidth: "70%",
          display: "flex",
          flexDirection: "column",
          alignItems: isMe ? "flex-end" : "flex-start",
          gap: 0.5
        }}
      >
        {/* Message Bubble */}
        <Paper
          elevation={0}
          sx={{
            p: "12px 16px",
            bgcolor: isMe ? "#131b2e" : "#ffffff",
            color: isMe ? "#ffffff" : "#131b2e",
            borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            boxShadow: "none",
            wordBreak: "break-word",
          }}
        >
          <Typography 
            sx={{ 
              fontSize: "0.9375rem",
              lineHeight: 1.5,
              fontWeight: 400,
            }}
          >
            {message.content}
          </Typography>
        </Paper>

        {/* Timestamp */}
        <Typography 
          variant="caption"
          sx={{ 
            color: "#5e5e5e",
            fontSize: "0.75rem",
            px: 1,
          }}
        >
          {formatDistanceToNow(message.created_at)}
        </Typography>
      </Box>
    </Box>
  );
}
