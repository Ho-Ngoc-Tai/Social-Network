"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Provider as ReduxProvider } from "react-redux";

import { store } from "../stores/store";
import { theme } from "./theme";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ReduxProvider store={store}>{children}</ReduxProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
