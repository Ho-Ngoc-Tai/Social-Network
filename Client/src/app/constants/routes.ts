export const routes = {
  login: "/login",
  register: "/register",
  feed: "/feed",
  profile: (id: string) => `/profile/${id}`,
} as const;
