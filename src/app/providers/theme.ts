import { createTheme } from "@mui/material/styles";

const surface = {
  background: "#FAF8FF",
  surface: "#FAF8FF",
  surfaceLow: "#F2F3FF",
  surfaceContainer: "#EAEDFF",
  surfaceContainerHigh: "#E2E7FF",
  surfaceLowest: "#FFFFFF",
} as const;

const ink = {
  onBackground: "#131B2E",
  onSurfaceVariant: "#474747",
  outlineVariant: "#C6C6C6",
} as const;

const accent = {
  blue: "#0052FF",
  blueDim: "#0038B6",
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
      main: accent.blue,
    },
    text: {
      primary: ink.onBackground,
      secondary: "#5E5E5E",
    },
    divider: "rgba(198, 198, 198, 0.15)",
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily:
      "var(--font-inter), Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, letterSpacing: "-0.02em" },
    h4: { fontWeight: 700, letterSpacing: "-0.01em" },
    h5: { fontWeight: 650 },
    h6: { fontWeight: 650 },
    body1: { lineHeight: 1.55 },
    body2: { lineHeight: 1.55 },
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: surface.background,
        },
      },
    },
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
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: surface.surfaceLowest,
          border: "none",
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 650,
          borderRadius: 12,
        },
        containedPrimary: {
          backgroundImage: `linear-gradient(135deg, ${accent.blue} 0%, ${accent.blueDim} 100%)`,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "filled",
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: surface.surfaceLow,
          borderRadius: 12,
          border: "1px solid transparent",
          "&:hover": {
            backgroundColor: surface.surfaceContainer,
          },
          "&.Mui-focused": {
            backgroundColor: surface.surfaceLow,
            borderColor: "rgba(0, 82, 255, 0.35)",
          },
          "&:before, &:after": {
            display: "none",
          },
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: "transparent",
      },
      styleOverrides: {
        root: {
          backdropFilter: "blur(16px)",
          backgroundColor: "rgba(242, 243, 255, 0.85)",
          borderBottom: "1px solid rgba(198, 198, 198, 0.12)",
        },
      },
    },
  },
});
