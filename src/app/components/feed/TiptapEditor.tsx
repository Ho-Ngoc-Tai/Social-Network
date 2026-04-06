"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import LinkIcon from "@mui/icons-material/Link";
import ImageIcon from "@mui/icons-material/Image";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string, html: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "What's on your mind?",
  onImageUpload,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
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

  if (!editor) {
    return null;
  }

  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && onImageUpload) {
        const url = await onImageUpload(file);
        editor.chain().focus().setImage({ src: url }).run();
      }
    };
    input.click();
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
      action: handleImageUpload,
      isActive: false,
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
}
