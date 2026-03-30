"use client";

import Link from "next/link";

import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import { routes } from "@/constants/routes";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { authActions } from "@/stores/reducers/authSlice";
import { BrandMark } from "@/components/ui/BrandMark";

export function TopNav() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.auth.status);
  const email = useAppSelector((s) => s.auth.email);

  return (
    <AppBar position="sticky" sx={{ backdropFilter: "blur(16px)", backgroundColor: "rgba(242, 243, 255, 0.85)" }}>
      <Toolbar disableGutters>
        <Container maxWidth="xl" sx={{ display: "flex", alignItems: "center", gap: 3, py: 1.5 }}>
          <Box sx={{ flex: "0 0 auto" }}>
            <Link href={routes.feed} style={{ display: "inline-flex" }}>
              <BrandMark condensed />
            </Link>
          </Box>

          <Box sx={{ flex: 1, maxWidth: 620 }}>
            <TextField
              fullWidth
              placeholder="Search people, posts, topics..."
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiFilledInput-root": {
                  borderRadius: 999,
                  backgroundColor: "rgba(255,255,255,0.72)",
                },
              }}
            />
          </Box>

          <Box sx={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 2 }}>
            {status === "authenticated" ? (
              <>
                <IconButton component={Link} href={routes.profile("1")} sx={{ p: 0.5 }}>
                  <Avatar
                    alt={email ?? "User"}
                    src="https://i.pravatar.cc/120?img=32"
                    sx={{ width: 36, height: 36 }}
                  />
                </IconButton>
                <Button
                  variant="text"
                  color="inherit"
                  onClick={() => dispatch(authActions.logoutRequested())}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button component={Link} href={routes.login} variant="contained" sx={{ py: 1, px: 2.5, fontWeight: 650 }}>
                Sign in
              </Button>
            )}
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
