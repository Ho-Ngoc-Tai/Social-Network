"use client";

import { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { chatActions } from "../../stores/reducers/chat/chatSlice";
import { formatDistanceToNow } from "../../utils/date";

export function ChatView() {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector((s) => s.chat.conversations);
  const selectedConversationId = useAppSelector((s) => s.chat.selectedConversationId);
  const isLoading = useAppSelector((s) => s.chat.isLoading);
  const error = useAppSelector((s) => s.chat.error);

  useEffect(() => {
    dispatch(chatActions.loadConversationsRequested());
  }, [dispatch]);

  const handleSelectConversation = (conversationId: string, peerId: string) => {
    dispatch(chatActions.selectConversation({ conversationId }));
    dispatch(chatActions.loadMessagesRequested({ peerId }));
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography>Loading conversations...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (conversations.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">No conversations yet.</Typography>
      </Box>
    );
  }

  return (
    <Stack gap={1}>
      {conversations.map((conversation) => (
        <Card
          key={conversation.conversation_id}
          onClick={() => handleSelectConversation(conversation.conversation_id, conversation.peer_id)}
          sx={{
            cursor: "pointer",
            borderRadius: 2,
            transition: "all 0.2s",
            backgroundColor: selectedConversationId === conversation.conversation_id 
              ? "action.selected" 
              : "background.paper",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Badge
                badgeContent={conversation.unread_count}
                color="error"
                invisible={conversation.unread_count === 0}
              >
                <Avatar sx={{ width: 48, height: 48 }}>
                  {conversation.peer_id.charAt(5).toUpperCase()}
                </Avatar>
              </Badge>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: conversation.unread_count > 0 ? 600 : 500 }} noWrap>
                    {conversation.peer_id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(conversation.updated_at)}
                  </Typography>
                </Box>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  noWrap
                  sx={{ fontWeight: conversation.unread_count > 0 ? 500 : 400 }}
                >
                  {conversation.last_message}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
