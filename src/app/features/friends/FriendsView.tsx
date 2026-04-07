"use client";

import { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { friendsActions } from "../../stores/reducers/friends/friendsSlice";
import { routes } from "../../constants/routes";

export function FriendsView() {
  const dispatch = useAppDispatch();
  const friends = useAppSelector((s) => s.friends.friends);
  const isLoading = useAppSelector((s) => s.friends.isLoading);
  const error = useAppSelector((s) => s.friends.error);

  useEffect(() => {
    dispatch(friendsActions.loadFriendsRequested());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: "center", minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography sx={{ color: "#5e5e5e" }}>Loading friends...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center", minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography sx={{ color: "#ba1a1a" }}>{error}</Typography>
      </Box>
    );
  }

  if (friends.length === 0) {
    return (
      <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              color: "#131b2e",
              letterSpacing: "-0.02em"
            }}
          >
            Friends (0)
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            sx={{
              bgcolor: "#131b2e",
              color: "#fff",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                bgcolor: "#004ced"
              }
            }}
          >
            Add Friend
          </Button>
        </Box>
        <Box sx={{ 
          p: 6, 
          textAlign: "center", 
          bgcolor: "#f8f9fa", 
          borderRadius: 3,
          border: "1px dashed rgba(0,0,0,0.12)"
        }}>
          <Typography sx={{ color: "#5e5e5e", fontSize: "1rem" }}>
            You don&apos;t have any friends yet.
          </Typography>
          <Typography sx={{ color: "#777777", fontSize: "0.875rem", mt: 1 }}>
            Click "Add Friend" to start connecting!
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700, 
            color: "#131b2e",
            letterSpacing: "-0.02em"
          }}
        >
          Friends ({friends.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          sx={{
            bgcolor: "#131b2e",
            color: "#fff",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              bgcolor: "#004ced"
            }
          }}
        >
          Add Friend
        </Button>
      </Box>

      {/* Friends List */}
      <Stack gap={2}>
        {friends.map((friend) => (
          <Card
            key={friend.id}
            component={Link}
            href={routes.profile(encodeURIComponent(friend.id))}
            sx={{
              textDecoration: "none",
              borderRadius: 3,
              bgcolor: "#ffffff",
              transition: "all 0.2s ease",
              boxShadow: "none",
              border: "1px solid rgba(0,0,0,0.06)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                borderColor: "rgba(0,0,0,0.12)"
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                <Avatar
                  src={friend.avatar || undefined}
                  alt={friend.full_name}
                  sx={{ 
                    width: 56, 
                    height: 56,
                    bgcolor: "#131b2e",
                    color: "#fff",
                    fontSize: "1.25rem",
                    fontWeight: 500
                  }}
                >
                  {friend.full_name?.charAt(0)?.toUpperCase() || "?"}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: "#131b2e",
                      fontSize: "1.0625rem",
                      mb: 0.3
                    }}
                  >
                    {friend.full_name}
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: "#5e5e5e",
                      fontSize: "0.875rem"
                    }}
                  >
                    @{friend.username}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
