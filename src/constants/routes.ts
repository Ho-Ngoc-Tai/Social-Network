export const routes = {
  login: "/login",
  feed: "/feed",
  profile: (id: string) => `/profile/${id}`,
} as const;
