import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { TopNav } from "./TopNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <TopNav />
      <Container maxWidth="xl" sx={{ py: 3.5 }}>
        {children}
      </Container>
    </Box>
  );
}
