"use client";

import { Suspense } from "react";
import { Container, Typography, Box, IconButton, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { FriendsView } from "../../features/friends/FriendsView";

function FriendsContent() {
  const router = useRouter();
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
          Friends
        </Typography>
      </Box>
      <FriendsView />
    </Container>
  );
}

export default function FriendsPage() {
  return (
    <Suspense fallback={
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#667eea' }} />
      </Container>
    }>
      <FriendsContent />
    </Suspense>
  );
}
