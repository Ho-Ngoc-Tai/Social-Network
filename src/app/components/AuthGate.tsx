"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { routes } from "../constants/routes";
import { useAppSelector, useAppDispatch } from "../hooks/storeHooks";
import { authActions } from "../stores/reducers/auth/authSlice";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const status = useAppSelector((s) => s.auth.status);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hydrate session on app load
    dispatch(authActions.sessionHydrationRequested());
  }, [dispatch]);

  useEffect(() => {
    if (status === "anonymous" && pathname !== routes.login) {
      router.replace(routes.login);
    } else if (status === "authenticated" && pathname === routes.login) {
      router.replace(routes.feed);
    }
  }, [router, pathname, status]);

  return <>{children}</>;
}
