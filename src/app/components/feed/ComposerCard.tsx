"use client";

import { useMemo, useState, useEffect, useRef } from "react";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { feedActions } from "../../stores/reducers/feed/feedSlice";
import { TiptapEditor } from "./TiptapEditor";

interface SelectedImage {
  file: File;
  previewUrl: string;
  uploadedUrl?: string;
}

export function ComposerCard() {
  const dispatch = useAppDispatch();
  const email = useAppSelector((s) => s.auth.email);
  const authStatus = useAppSelector((s) => s.auth.status);
  const { createLoading, createError, uploadedImageUrl, createSuccess } = useAppSelector((s) => s.feed);
  const editorRef = useRef<{ clearImages: () => void } | null>(null);
  const pendingUploadsRef = useRef<Map<string, string>>(new Map()); // file name -> uploaded URL

  const [content, setContent] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const remaining = useMemo(() => 2500 - content.length, [content.length]);

  // Reset form when post succeeds
  useEffect(() => {
    if (createSuccess) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setContent("");
        setHtmlContent("");
        setSelectedImages([]);
        pendingUploadsRef.current.clear();
        editorRef.current?.clearImages?.();
        dispatch(feedActions.resetCreateState());
      }, 0);
    }
  }, [createSuccess, dispatch]);

  // Update uploaded URL when upload succeeds
  useEffect(() => {
    if (uploadedImageUrl && selectedImages.length > 0) {
      setTimeout(() => {
        // Find the first image without uploadedUrl and assign the new URL
        setSelectedImages(prev => {
          const hasMissingUpload = prev.some(img => !img.uploadedUrl);
          if (!hasMissingUpload) return prev;
          
          // Find first image without uploadedUrl
          const firstMissingIndex = prev.findIndex(img => !img.uploadedUrl);
          if (firstMissingIndex === -1) return prev;
          
          return prev.map((img, idx) => 
            idx === firstMissingIndex ? { ...img, uploadedUrl: uploadedImageUrl } : img
          );
        });
      }, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedImageUrl]);

  const handleEditorChange = (text: string, html: string) => {
    setContent(text);
    setHtmlContent(html);
  };

  const handleImagesSelected = (images: SelectedImage[]) => {
    // Find new images that need upload
    const currentFiles = new Set(selectedImages.map(img => img.file.name));
    const newImages = images.filter(img => !currentFiles.has(img.file.name));
    
    setSelectedImages(images);
    
    // Upload each new image
    newImages.forEach((img) => {
      dispatch(feedActions.uploadImageRequested({ file: img.file }));
    });
  };

  const allImagesUploaded = selectedImages.length > 0 && selectedImages.every(img => img.uploadedUrl);

  const handleCreatePost = () => {
    if (content.trim().length === 0 && selectedImages.length === 0) return;
    
    // Wait for all images to upload before posting
    if (selectedImages.length > 0 && !allImagesUploaded) {
      // Show alert or just return - images still uploading
      console.log('Waiting for images to upload...');
      return;
    }

    // Use uploaded URLs
    const imageUrls = selectedImages.map(img => img.uploadedUrl).filter(Boolean) as string[];

    dispatch(feedActions.createPostRequested({
      content: htmlContent || content.trim(),
      image: imageUrls[0], // First image as main image
      files: imageUrls.length > 1 ? imageUrls.slice(1) : undefined,
    }));
  };

  // If not authenticated, show login prompt
  if (authStatus !== "authenticated") {
    return (
      <Card
        sx={{
          borderRadius: 3,
          backgroundColor: "rgba(242, 243, 255, 0.6)",
          border: "none",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ py: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Please login to create posts
          </Typography>
        </CardContent>
      </Card>
    );
  }

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
          <TiptapEditor
            content=""
            onChange={handleEditorChange}
            placeholder="Share something with your campus…"
            onImagesSelected={handleImagesSelected}
            maxImages={6}
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
            <Typography variant="body2" color={remaining < 0 ? "error" : "text.secondary"}>
              {remaining < 0 ? `${Math.abs(remaining)} over limit` : `${remaining} characters left`}
            </Typography>
            <Button
              variant="contained"
              disabled={(content.trim().length === 0 && selectedImages.length === 0) || remaining < 0 || createLoading || (selectedImages.length > 0 && !allImagesUploaded)}
              onClick={handleCreatePost}
              sx={{ py: 1, px: 3, fontWeight: 650 }}
            >
              {createLoading ? "Posting..." : selectedImages.length > 0 && !allImagesUploaded ? "Uploading..." : "Post"}
            </Button>
          </Box>
          {createError && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="error">
                {createError}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
