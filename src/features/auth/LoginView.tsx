"use client";

import { useMemo, useState } from "react";
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

import { BrandMark } from "@/components/ui/BrandMark";
import { routes } from "@/constants/routes";
import { useAppDispatch } from "@/hooks/storeHooks";
import { authActions } from "@/stores/reducers/authSlice";

export function LoginView() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [email, setEmail] = useState("student@university.edu");
  const [password, setPassword] = useState("password");

  const canSubmit = useMemo(() => email.trim().length > 3 && password.trim().length > 0, [email, password]);

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
              Sign in
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              University social network — clean UI now, GraphQL later.
            </Typography>

            <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="filled"
                size="medium"
                sx={{
                  "& .MuiFilledInput-root": {
                    borderRadius: 3,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="filled"
                size="medium"
                sx={{
                  "& .MuiFilledInput-root": {
                    borderRadius: 3,
                  },
                }}
              />
            </Box>

            <Button
              fullWidth
              size="large"
              variant="contained"
              sx={{ mt: 2.5, py: 1.25, fontSize: "1rem", fontWeight: 600 }}
              disabled={!canSubmit}
              onClick={() => {
                dispatch(authActions.loginRequested({ email: email.trim() }));
                router.replace(routes.feed);
              }}
            >
              Continue
            </Button>

            <Divider sx={{ my: 2.5, opacity: 0.7 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
              <Link href="#" underline="hover" color="text.secondary">
                Forgot password
              </Link>
              <Link href="#" underline="hover" color="text.secondary">
                Create an account
              </Link>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block", textAlign: "center" }}>
          By continuing, you agree to the campus community guidelines.
        </Typography>
      </Container>
    </Box>
  );
}
