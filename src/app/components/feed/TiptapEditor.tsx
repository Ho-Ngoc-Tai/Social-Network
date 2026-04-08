"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import NextImage from "next/image";
import { useState, useRef, ChangeEvent, forwardRef, useImperativeHandle } from "react";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import LinkIcon from "@mui/icons-material/Link";
import ImageIcon from "@mui/icons-material/Image";

interface SelectedImage {
  file: File;
  previewUrl: string;
}

export interface TiptapEditorRef {
  clearImages: () => void;
}

interface TiptapEditorProps {
  content: string;
  onChange: (content: string, html: string) => void;
  placeholder?: string;
  onImagesSelected?: (images: SelectedImage[]) => void;
  maxImages?: number;
}

export const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(function TiptapEditor({
  content,
  onChange,
  placeholder = "What's on your mind?",
  onImagesSelected,
  maxImages = 6,
}: TiptapEditorProps,
  ref: React.Ref<TiptapEditorRef>
) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      onChange(text, html);
    },
  });

  const [showImageGrid, setShowImageGrid] = useState(false);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Expose clearImages method to parent
  useImperativeHandle(ref, () => ({
    clearImages: () => {
      setSelectedImages([]);
      setShowImageGrid(false);
      onImagesSelected?.([]);
    },
  }));

  if (!editor) {
    return null;
  }

  const handleImageButtonClick = () => {
    setShowImageGrid(!showImageGrid);
  };

  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedImages.length < maxImages) {
      const previewUrl = URL.createObjectURL(file);
      const newImages = [...selectedImages, { file, previewUrl }];
      setSelectedImages(newImages);
      onImagesSelected?.(newImages);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    onImagesSelected?.(newImages);
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const toolbarButtons = [
    {
      icon: FormatBoldIcon,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      title: "Bold",
    },
    {
      icon: FormatItalicIcon,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      title: "Italic",
    },
    {
      icon: FormatListBulletedIcon,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      title: "Bullet List",
    },
    {
      icon: FormatListNumberedIcon,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      title: "Numbered List",
    },
    {
      icon: LinkIcon,
      action: setLink,
      isActive: editor.isActive("link"),
      title: "Link",
    },
    {
      icon: ImageIcon,
      action: handleImageButtonClick,
      isActive: showImageGrid,
      title: "Image",
    },
  ];

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "rgba(0,0,0,0.12)",
        borderRadius: 2,
        backgroundColor: "white",
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 1,
          py: 0.5,
          borderBottom: "1px solid",
          borderColor: "rgba(0,0,0,0.08)",
          backgroundColor: "rgba(248,249,250,1)",
        }}
      >
        {toolbarButtons.map((button, index) => (
          <IconButton
            key={index}
            size="small"
            onClick={button.action}
            title={button.title}
            sx={{
              color: button.isActive ? "primary.main" : "text.secondary",
              backgroundColor: button.isActive ? "rgba(25,118,210,0.08)" : "transparent",
              "&:hover": {
                backgroundColor: button.isActive ? "rgba(25,118,210,0.12)" : "rgba(0,0,0,0.04)",
              },
            }}
          >
            <button.icon fontSize="small" />
          </IconButton>
        ))}
      </Box>

      {/* Image Grid Selector */}
      {showImageGrid && (
        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "rgba(0,0,0,0.08)" }}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1,
              maxWidth: 320,
            }}
          >
            {/* Selected Images */}
            {selectedImages.map((img, index) => (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'rgba(0,0,0,0.12)',
                }}
              >
                <NextImage
                  src={img.previewUrl}
                  alt={`Selected ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveImage(index)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    p: 0.5,
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            {/* Add Button */}
            {selectedImages.length < maxImages && (
              <Button
                onClick={handleAddImageClick}
                sx={{
                  aspectRatio: '1',
                  border: '2px dashed',
                  borderColor: 'rgba(0,0,0,0.2)',
                  borderRadius: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    bgcolor: 'rgba(25,118,210,0.04)',
                  },
                }}
              >
                <AddIcon />
              </Button>
            )}
          </Box>
        </Box>
      )}

      {/* Editor Content */}
      <Box
        sx={{
          p: 2,
          minHeight: 120,
          maxHeight: 400,
          overflow: "auto",
          "& .ProseMirror": {
            outline: "none",
            "& p": {
              margin: 0,
              lineHeight: 1.6,
            },
            "& p.is-editor-empty:first-child::before": {
              content: "attr(data-placeholder)",
              float: "left",
              color: "rgba(0,0,0,0.38)",
              pointerEvents: "none",
              height: 0,
            },
            "& h1, & h2, & h3": {
              margin: "16px 0 8px",
              fontWeight: 600,
            },
            "& ul, & ol": {
              margin: "8px 0",
              paddingLeft: 24,
            },
            "& li": {
              margin: "4px 0",
            },
            "& img": {
              maxWidth: "100%",
              borderRadius: 8,
              margin: "8px 0",
            },
            "& a": {
              color: "primary.main",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
});
