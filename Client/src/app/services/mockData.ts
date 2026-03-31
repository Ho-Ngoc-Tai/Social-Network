import { Post } from "../types/post/post";
import { User } from "../types/user";

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function createMockPost(input: {
  content: string;
  authorName: string;
  authorId?: string;
  authorAvatarUrl?: string;
}): Post {
  return {
    id: uid("post"),
    content: input.content,
    createdAt: new Date().toISOString(),
    likesCount: Math.floor(Math.random() * 120),
    commentsCount: Math.floor(Math.random() * 12),
    author: {
      id: input.authorId ?? uid("user"),
      name: input.authorName,
      avatarUrl: input.authorAvatarUrl ?? "https://i.pravatar.cc/120?img=68",
      headline: "Computer Science • University",
    },
  };
}

export function getMockFeed(): Post[] {
  return [
    createMockPost({
      content:
        "Today we shipped the first iteration of the campus social network UI. Next step: connect GraphQL and add realtime notifications.",
      authorName: "Product Team",
      authorAvatarUrl: "https://i.pravatar.cc/120?img=15",
    }),
    createMockPost({
      content:
        "Question: What’s the cleanest way to model user→post→comment→like relationships in SurrealDB? Any patterns to recommend?",
      authorName: "Tai",
      authorAvatarUrl: "https://i.pravatar.cc/120?img=32",
    }),
    createMockPost({
      content:
        "Club meetup this Friday 6PM. We’ll demo the new feed, profile, and authentication flow prototypes.",
      authorName: "Uni Dev Club",
      authorAvatarUrl: "https://i.pravatar.cc/120?img=49",
    }),
  ];
}

export function getMockProfile(id: string): { user: User; posts: Post[] } {
  const user: User = {
    id,
    name: id === "1" ? "Tai" : `Student ${id}`,
    avatarUrl: "https://i.pravatar.cc/160?img=32",
    headline: "Computer Science • 3rd year",
    bio:
      "Building a university social network with Next.js, GraphQL, and SurrealDB. Interested in scalable frontend architecture.",
    stats: {
      posts: 42,
      followers: 1280,
      following: 96,
    },
  };

  const posts: Post[] = [
    createMockPost({
      content:
        "Pinned: Architecture rules — UI in components/, business in features/, data in apis/, orchestration in services/, state in stores/.",
      authorName: user.name,
      authorId: user.id,
      authorAvatarUrl: user.avatarUrl,
    }),
    createMockPost({
      content:
        "UI update: removing hard borders and using tonal layering feels way more premium (Stitch-inspired).",
      authorName: user.name,
      authorId: user.id,
      authorAvatarUrl: user.avatarUrl,
    }),
  ];

  return { user, posts };
}
