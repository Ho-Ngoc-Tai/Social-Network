import { Container, Typography } from "@mui/material";
import { FriendsView } from "../../features/friends/FriendsView";

export default function FriendsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Friends
      </Typography>
      <FriendsView />
    </Container>
  );
}
