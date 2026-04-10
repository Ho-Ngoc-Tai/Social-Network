import { createTheme } from "@mui/material/styles";

// "The Kinetic Editorial" Design System - VIBRANT Variant
// High-energy colors with electric accents

const surface = {
  background: "#F8F9FF",
  surface: "#FFFFFF",
  surfaceBright: "#FFFFFF",
  surfaceDim: "#E8EBFF",
  surfaceContainer: "#F0F2FF",
  surfaceContainerLow: "#F5F7FF",
  surfaceContainerHigh: "#E5E8FF",
  surfaceContainerHighest: "#D8DDFF",
  surfaceLowest: "#FFFFFF",
  surfaceVariant: "#E0E5FF",
} as const;

const ink = {
  onBackground: "#1A1F3C",
  onSurface: "#1A1F3C",
  onSurfaceVariant: "#4A5568",
  outline: "#718096",
  outlineVariant: "#CBD5E0",
} as const;

// VIBRANT Primary - Electric Purple/Blue Gradient Base
const primary = {
  main: "#6366F1",         // Indigo 500
  fixed: "#8B5CF6",       // Violet 500
  fixedDim: "#4F46E5",    // Indigo 600
  container: "#4338CA",   // Indigo 700
  onContainer: "#FFFFFF",
} as const;

// VIBRANT Secondary - Teal/Cyan
const secondary = {
  main: "#06B6D4",        // Cyan 500
  fixed: "#22D3EE",       // Cyan 400
  fixedDim: "#0891B2",    // Cyan 600
  container: "#67E8F9",   // Cyan 300
  onContainer: "#164E63",
} as const;

// VIBRANT Tertiary - Pink/Magenta
const tertiary = {
  main: "#EC4899",        // Pink 500
  fixed: "#F472B6",       // Pink 400
  fixedDim: "#DB2777",    // Pink 600
  container: "#FBCFE8",   // Pink 200
  onContainer: "#831843",
} as const;

// VIBRANT Error - Coral/Red
const error = {
  main: "#EF4444",        // Red 500
  container: "#FECACA",   // Red 200
  onContainer: "#991B1B",
} as const;

export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    background: {
      default: surface.background,
      paper: surface.surfaceLowest,
    },
    primary: {
      main: primary.main,
      light: primary.fixed,
      dark: primary.fixedDim,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: secondary.main,
      light: secondary.fixed,
      dark: secondary.fixedDim,
      contrastText: "#FFFFFF",
    },
    error: {
      main: error.main,
      light: error.container,
      dark: "#DC2626",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: ink.onBackground,
      secondary: ink.onSurfaceVariant,
      disabled: "#A0AEC0",
    },
    divider: "rgba(113, 128, 150, 0.15)",
    action: {
      active: primary.main,
      hover: "rgba(99, 102, 241, 0.08)",
      selected: "rgba(99, 102, 241, 0.12)",
      disabledBackground: "rgba(160, 174, 192, 0.12)",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily:
      "var(--font-inter), Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    // Display styles - Kinetic Editorial headline treatment
    h1: { 
      fontWeight: 700, 
      letterSpacing: "-0.02em",
      lineHeight: 1.2,
    },
    h2: { 
      fontWeight: 700, 
      letterSpacing: "-0.02em",
      lineHeight: 1.25,
    },
    h3: { 
      fontWeight: 700, 
      letterSpacing: "-0.02em",
      lineHeight: 1.3,
    },
    h4: { 
      fontWeight: 700, 
      letterSpacing: "-0.01em",
      lineHeight: 1.35,
    },
    h5: { 
      fontWeight: 650,
      letterSpacing: "-0.01em",
      lineHeight: 1.4,
    },
    h6: { 
      fontWeight: 650,
      letterSpacing: "-0.005em",
      lineHeight: 1.4,
    },
    subtitle1: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    subtitle2: {
      fontWeight: 600,
      letterSpacing: "-0.005em",
    },
    body1: { 
      lineHeight: 1.6,
      letterSpacing: "0",
    },
    body2: { 
      lineHeight: 1.55,
      letterSpacing: "0",
    },
    button: {
      fontWeight: 650,
      letterSpacing: "0.01em",
    },
    caption: {
      fontWeight: 500,
      letterSpacing: "0.01em",
    },
    overline: {
      fontWeight: 600,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    },
  },
  spacing: 8,
  components: {
    // Global reset
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: surface.background,
          color: ink.onBackground,
        },
      },
    },
    // Paper - No elevation by default ("No-Line" rule)
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    // Cards - Tonal layering for depth
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: surface.surfaceLowest,
          border: "none",
          boxShadow: "none",
          borderRadius: 12,
          transition: "background-color 200ms ease, transform 200ms ease",
          "&:hover": {
            backgroundColor: surface.surfaceBright,
          },
        },
      },
    },
    // Buttons - Electric Blue gradient for CTAs
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 650,
          borderRadius: 6,
          padding: "10px 24px",
          transition: "all 200ms ease",
        },
        containedPrimary: {
          background: `linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #4F46E5 100%)`,
          color: "#FFFFFF",
          boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
          "&:hover": {
            background: `linear-gradient(135deg, #A78BFA 0%, #818CF8 50%, #6366F1 100%)`,
            boxShadow: "0 6px 20px rgba(99, 102, 241, 0.45)",
            transform: "translateY(-2px)",
          },
        },
        containedSecondary: {
          backgroundColor: surface.surfaceContainerHigh,
          color: ink.onSurface,
          "&:hover": {
            backgroundColor: surface.surfaceContainerHighest,
          },
        },
        outlined: {
          borderColor: ink.outlineVariant,
          "&:hover": {
            backgroundColor: surface.surfaceContainerLow,
          },
        },
        text: {
          color: primary.main,
          "&:hover": {
            backgroundColor: "rgba(99, 102, 241, 0.12)",
          },
        },
      },
    },
    // Text Fields - Ghost border on focus
    MuiTextField: {
      defaultProps: {
        variant: "filled",
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: surface.surfaceContainerLow,
          borderRadius: 12,
          border: "1px solid transparent",
          transition: "all 200ms ease",
          "&:hover": {
            backgroundColor: surface.surfaceContainer,
          },
          "&.Mui-focused": {
            backgroundColor: surface.surfaceContainerLow,
            borderColor: primary.main,
            boxShadow: `0 0 0 3px rgba(99, 102, 241, 0.2)`,
          },
          "&:before, &:after": {
            display: "none",
          },
        },
      },
    },
    // App Bar - Glassmorphism effect with VIBRANT tint
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: "transparent",
      },
      styleOverrides: {
        root: {
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(248, 249, 255, 0.92)",
          borderBottom: "1px solid rgba(99, 102, 241, 0.08)",
        },
      },
    },
    // Avatar - Clean styling
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: surface.surfaceContainerHigh,
          color: primary.main,
        },
      },
    },
    // IconButton - VIBRANT hover
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 200ms ease",
          "&:hover": {
            backgroundColor: "rgba(99, 102, 241, 0.12)",
            color: primary.main,
          },
        },
      },
    },
    // Chips - Full radius with VIBRANT accent
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          backgroundColor: surface.surfaceContainerHigh,
          color: ink.onSurfaceVariant,
          fontWeight: 600,
          "&.MuiChip-colorPrimary": {
            background: `linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)`,
            color: "#FFFFFF",
          },
          "&.MuiChip-colorSecondary": {
            background: `linear-gradient(135deg, #22D3EE 0%, #06B6D4 100%)`,
            color: "#FFFFFF",
          },
        },
      },
    },
    // Dividers - Ghost borders
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(198, 198, 198, 0.15)",
        },
      },
    },
    // Tooltip - Subtle shadow
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: ink.onBackground,
          borderRadius: 8,
          padding: "8px 12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        },
      },
    },
    // Badge - Electric Blue accent
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: primary.main,
          color: "#FFFFFF",
          fontWeight: 600,
        },
      },
    },
    // List Items - Clean separators via spacing
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&:hover": {
            backgroundColor: surface.surfaceContainerLow,
          },
        },
      },
    },
    // Menu - Elevated surface
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: surface.surfaceLowest,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          borderRadius: 12,
        },
      },
    },
    // Dialog - High elevation with blur backdrop
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: surface.surfaceLowest,
          borderRadius: 16,
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.15)",
        },
      },
    },
    // Snackbar - Electric accent
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: ink.onBackground,
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        },
      },
    },
  },
});

// Export design tokens for use in components
export const designTokens = {
  surface,
  ink,
  primary,
  secondary,
  tertiary,
  error,
};
