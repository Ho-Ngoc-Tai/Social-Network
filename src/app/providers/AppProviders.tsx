"use client";

import { useEffect } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Provider as ReduxProvider } from "react-redux";

import { store } from "../stores/store";
import { authActions } from "../stores/reducers/auth/authSlice";
import { theme } from "./theme";
import { SocketProvider } from "./SocketProvider";

// Component to hydrate auth session on app start
function HydrateAuth() {
  useEffect(() => {
    store.dispatch(authActions.sessionHydrationRequested());
  }, []);
  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ReduxProvider store={store}>
          <HydrateAuth />
          <SocketProvider>{children}</SocketProvider>
        </ReduxProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
