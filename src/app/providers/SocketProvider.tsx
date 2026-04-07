"use client";

import { ReactNode } from "react";
import { useSocket } from "../hooks/useSocket";

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  // Initialize socket connection
  useSocket();
  
  return <>{children}</>;
}
