"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { routes } from "@/constants/routes";
import { useAppSelector } from "@/hooks/storeHooks";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const status = useAppSelector((s) => s.auth.status);

  useEffect(() => {
    if (status === "anonymous" && pathname !== routes.login) {
      router.replace(routes.login);
    }
  }, [router, pathname, status]);

  return <>{children}</>;
}
