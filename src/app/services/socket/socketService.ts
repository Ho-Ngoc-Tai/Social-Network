import { env } from "@/app/config/env";
import { io, Socket } from "socket.io-client";

export type NotificationAction = "FRIEND_REQ" | "FRIEND_ACCEPT" | "like" | "comment" | "follow" | "mention" | "post";

export interface SocketNotification {
  id: string;
  action: NotificationAction;
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
  actor?: {
    id: string;
    full_name: string;
    avatar: string | null;
  };
  target?: {
    id: string;
    type: "post" | "comment" | "user";
  };
}

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: unknown) => void>> = new Map();

  connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(env.socketUrl, {
      transports: ["websocket", "polling"],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Debug connection events - register listeners when actually connected
    this.socket.on('connect', () => {
      console.log('[Socket] Connected successfully, socket id:', this.socket?.id);
      // Register all stored listeners with socket.io when connected
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach((callback) => {
          this.socket?.on(event, callback);
          console.log(`[Socket] Registered listener for: ${event}`);
        });
      });
      console.log('[Socket] All listeners registered from Map');
    });
    
    // Catch ALL events for debugging
    this.socket.onAny((eventName, ...args) => {
      console.log('[Socket] Received event:', eventName, args);
    });
    
    this.socket.on('connect_error', (err) => {
      console.log('[Socket] Connection error:', err.message);
    });
    
    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    console.log('[Socket] Connection initiated, listeners in Map:', Array.from(this.listeners.keys()));
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  on(event: string, callback: (data: unknown) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Actually register with socket.io if connected
    if (this.socket?.connected) {
      this.socket.on(event, callback);
      console.log(`[Socket] Registered listener for: ${event}`);
    }

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
      this.socket?.off(event, callback);
    };
  }

  off(event: string, callback: (data: unknown) => void): void {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: unknown): void {
    this.listeners.get(event)?.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`[Socket] Error in listener for ${event}:`, error);
      }
    });
  }
}

export const socketService = new SocketService();
