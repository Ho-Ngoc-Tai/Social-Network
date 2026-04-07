export const routes = {
  login: "/login",
  register: "/register",
  feed: "/feed",
  friends: "/friends",
  chat: "/chat",
  profile: (id: string) => `/profile/${id}`,
} as const;
