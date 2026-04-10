"use client";

import { Container, Typography, Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { ChatView } from "../../features/chat/ChatView";
import { ChatWindow } from "../../features/chat/ChatWindow";
import { useAppSelector } from "../../hooks/storeHooks";

export default function ChatPage() {
  const selectedConversationId = useAppSelector((s) => s.chat.selectedConversationId);
  const router = useRouter();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconButton 
          onClick={() => router.back()}
          sx={{ 
            color: '#1A1F3C',
            '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.08)' }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Messages
        </Typography>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { md: "350px 1fr" }, gap: 3, height: 600 }}>
        <Box>
          <ChatView />
        </Box>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          {selectedConversationId ? (
            <ChatWindow conversationId={selectedConversationId} />
          ) : (
            <Box 
              sx={{ 
                height: "100%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                bgcolor: "grey.50",
                borderRadius: 2,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Select a conversation to start chatting
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}
