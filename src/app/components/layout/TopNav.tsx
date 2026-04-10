"use client";

import Link from "next/link";

import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { authActions } from "../../stores/reducers/auth/authSlice";
import { BrandMark } from "../ui/BrandMark";
import { NotificationBell } from "../notification/NotificationBell";
import { routes } from "@/app/constants/routes";


export function TopNav() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.auth.status);
  const email = useAppSelector((s) => s.auth.email);
  const user = useAppSelector((s) => s.auth.user);
  const userId = user?.id;

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backdropFilter: "blur(20px)", 
        backgroundColor: "rgba(250, 248, 255, 0.92)",
        borderBottom: "1px solid rgba(198, 198, 198, 0.12)",
        boxShadow: "none",
      }}
    >
      <Toolbar disableGutters sx={{ minHeight: 72 }}>
        <Container maxWidth="xl" sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box sx={{ flex: "0 0 auto" }}>
            <Link href={routes.feed} style={{ display: "inline-flex" }}>
              <BrandMark condensed />
            </Link>
          </Box>

          <Box sx={{ flex: 1, maxWidth: 520 }}>
            <TextField
              fullWidth
              placeholder="Search people, posts..."
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" sx={{ color: '#5e5e5e' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiFilledInput-root": {
                  borderRadius: 999,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(0, 76, 237, 0.1)",
                  py: 1,
                  px: 2,
                  transition: "all 200ms ease",
                  "&:hover": {
                    backgroundColor: "#ffffff",
                    borderColor: "rgba(0, 76, 237, 0.2)",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "#ffffff",
                    borderColor: "#004ced",
                    boxShadow: "0 0 0 3px rgba(0, 76, 237, 0.15)",
                  },
                  "&:before, &:after": {
                    display: "none",
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 1.5 }}>
            {status === "anonymous" && (
              <Button 
                component={Link} 
                href={routes.login} 
                variant="contained" 
                sx={{ 
                  py: 1, 
                  px: 3, 
                  fontWeight: 650,
                  borderRadius: 3,
                }}
              >
                Sign in
              </Button>
            )}
          </Box>

          {status === "authenticated" && (
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 0.5,
              ml: 'auto',
            }}>
              {/* Notifications */}
              <NotificationBell />

              {/* Friends */}
              <Tooltip title="Friends">
                <IconButton
                  component={Link}
                  href={routes.friends}
                  sx={{ 
                    p: 1,
                    color: '#5e5e5e',
                    borderRadius: 3,
                    transition: 'all 200ms ease',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 76, 237, 0.08)',
                      color: '#004ced',
                    },
                  }}
                >
                  <PeopleAltRoundedIcon fontSize="medium" />
                </IconButton>
              </Tooltip>

              {/* Chat */}
              <Tooltip title="Messages">
                <IconButton
                  component={Link}
                  href={routes.chat}
                  sx={{ 
                    p: 1,
                    color: '#5e5e5e',
                    borderRadius: 3,
                    transition: 'all 200ms ease',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 76, 237, 0.08)',
                      color: '#004ced',
                    },
                  }}
                >
                  <Badge 
                    badgeContent={1} 
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#004ced',
                        fontSize: '0.65rem',
                        minWidth: 18,
                        height: 18,
                      }
                    }}
                  >
                    <ChatRoundedIcon fontSize="medium" />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* User Avatar */}
              <Tooltip title="Profile">
                <IconButton 
                  component={Link} 
                  href={userId ? routes.profile(encodeURIComponent(userId)) : '#'} 
                  sx={{ 
                    p: 0.5,
                    ml: 0.5,
                  }}
                >
                  <Avatar
                    alt={email ?? "User"}
                    src={user?.avatar || "https://i.pravatar.cc/120?img=32"}
                    sx={{ 
                      width: 40, 
                      height: 40,
                      border: '2px solid #ffffff',
                      boxShadow: '0 2px 8px rgba(0, 76, 237, 0.15)',
                      transition: 'all 200ms ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 12px rgba(0, 76, 237, 0.25)',
                      }
                    }}
                  />
                </IconButton>
              </Tooltip>

              {/* Logout */}
              <Tooltip title="Logout">
                <IconButton
                  onClick={() => dispatch(authActions.logoutRequested())}
                  sx={{ 
                    p: 1,
                    color: '#5e5e5e',
                    borderRadius: 3,
                    transition: 'all 200ms ease',
                    '&:hover': {
                      backgroundColor: 'rgba(233, 30, 99, 0.08)',
                      color: '#e91e63',
                    },
                  }}
                >
                  <LogoutOutlinedIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Container>
      </Toolbar>
    </AppBar>
  );
}
