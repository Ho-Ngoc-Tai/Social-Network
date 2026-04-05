"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { routes } from "../../constants/routes";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { BrandMark } from "../../components/ui/BrandMark";
import { authActions } from "../../stores/reducers/auth/authSlice";

export function RegisterView() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isLoading = useAppSelector((s) => s.auth.isLoading);
  const error = useAppSelector((s) => s.auth.error);

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = useMemo(() => {
    return username.trim().length >= 3 && 
           fullName.trim().length >= 2 && 
           email.trim().length > 3 && 
           password.trim().length >= 6;
  }, [username, fullName, email, password]);

  const handleRegister = async () => {
    dispatch(authActions.registerRequested({ 
      username: username.trim(), 
      full_name: fullName.trim(), 
      email: email.trim(), 
      password: password.trim() 
    }));
  };

  // Listen for auth state changes
  const authStatus = useAppSelector((s) => s.auth.status);
  
  useEffect(() => {
    if (authStatus === "authenticated") {
      router.replace(routes.feed);
    }
  }, [authStatus, router]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse 1200px 600px at 20% 0%, rgba(0,82,255,0.08) 0%, rgba(0,82,255,0.00) 55%), radial-gradient(ellipse 1000px 700px at 100% 20%, rgba(0,56,182,0.06) 0%, rgba(0,56,182,0.00) 55%)",
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ mb: 3.5, textAlign: "center" }}>
          <BrandMark />
        </Box>

        <Card
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
            border: "1px solid rgba(198, 198, 198, 0.15)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: "-0.02em" }}>
              Create account
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Join the university social network — connect with classmates.
            </Typography>

            {error && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: "error.light", borderRadius: 2, color: "error.contrastText" }}>
                <Typography variant="body2">
                  {error}
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
                size="medium"
                disabled={isLoading}
                error={!!error && username.trim().length < 3}
                helperText={username.trim().length < 3 ? "Username must be at least 3 characters" : ""}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                variant="outlined"
                size="medium"
                disabled={isLoading}
                error={!!error && fullName.trim().length < 2}
                helperText={fullName.trim().length < 2 ? "Full name must be at least 2 characters" : ""}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                size="medium"
                disabled={isLoading}
                error={!!error && email.trim().length === 0}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                size="medium"
                disabled={isLoading}
                error={!!error && password.trim().length < 6}
                helperText={password.trim().length < 6 ? "Password must be at least 6 characters" : ""}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            <Button
              fullWidth
              size="large"
              variant="contained"
              sx={{ mt: 2.5, py: 1.25, fontSize: "1rem", fontWeight: 600 }}
              disabled={!canSubmit || isLoading}
              onClick={handleRegister}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>

            <Divider sx={{ my: 2.5, opacity: 0.7 }} />

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
              <Link href={routes.login} underline="hover" color="text.secondary">
                Already have an account? Sign in
              </Link>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block", textAlign: "center" }}>
          By creating an account, you agree to the campus community guidelines.
        </Typography>
      </Container>
    </Box>
  );
}
