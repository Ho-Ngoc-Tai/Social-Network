"use client";

import { Container, Typography, Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { FriendsView } from "../../features/friends/FriendsView";

export default function FriendsPage() {
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
