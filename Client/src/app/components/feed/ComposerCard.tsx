"use client";

import { useMemo, useState } from "react";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { feedActions } from "../../stores/reducers/feed/feedSlice";

export function ComposerCard() {
  const dispatch = useAppDispatch();
  const email = useAppSelector((s) => s.auth.email);

  const [content, setContent] = useState("");
  const remaining = useMemo(() => 280 - content.length, [content.length]);

  return (
    <Card
      sx={{
        borderRadius: 3,
        backgroundColor: "rgba(242, 243, 255, 0.6)",
        border: "none",
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ display: "flex", gap: 2, py: 3 }}>
        <Avatar
          alt={email ?? "User"}
          src="https://i.pravatar.cc/120?img=32"
          sx={{ width: 48, height: 48 }}
        />
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Share something with your campus…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant="standard"
            InputProps={{
              disableUnderline: true,
            }}
            sx={{
              "& .MuiInputBase-root": {
                typography: "body1",
                lineHeight: 1.6,
              },
            }}
          />
          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {remaining} characters left
            </Typography>
            <Button
              variant="contained"
              disabled={content.trim().length === 0}
              onClick={() => {
                dispatch(feedActions.createPostRequested({ content: content.trim() }));
                setContent("");
              }}
              sx={{ py: 1, px: 3, fontWeight: 650 }}
            >
              Post
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
