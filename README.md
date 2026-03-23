# Social Network Frontend

A modern social network platform built with Next.js 16, TypeScript, GraphQL, and Redux.

## Tech Stack

- **Frontend Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit + Redux Saga
- **Data Fetching**: GraphQL (Apollo Client)
- **UI Libraries**: Material UI + Shadcn UI
- **Styling**: Tailwind CSS
- **Backend Integration**: NestJS + GraphQL + SurrealDB

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (pages)/           # Main application pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css        # Global styles
├── apis/                  # GraphQL queries and mutations
│   ├── auth.api.ts        # Authentication API
│   ├── post.api.ts        # Post API
│   ├── comment.api.ts     # Comment API
│   ├── user.api.ts        # User API
│   ├── feed.api.ts        # Feed API
│   ├── notification.api.ts # Notification API
│   └── search.api.ts      # Search API
├── components/            # Reusable UI components
├── features/             # Business modules
│   ├── auth/             # Authentication feature
│   ├── post/             # Post feature
│   ├── comment/          # Comment feature
│   ├── feed/             # Feed feature
│   └── profile/          # Profile feature
├── hooks/                # Custom React hooks
├── commons/              # Shared utilities
├── constants/            # Global constants
├── providers/            # React providers
│   ├── apollo-provider.tsx
│   └── redux-provider.tsx
├── routes/               # Route configuration
├── services/             # Business logic layer
├── stores/               # Redux state management
│   ├── reducers/         # Redux Toolkit slices
│   │   ├── auth-slice.ts
│   │   ├── posts-slice.ts
│   │   ├── feed-slice.ts
│   │   ├── profile-slice.ts
│   │   ├── notifications-slice.ts
│   │   └── ui-slice.ts
│   ├── sagas/            # Redux Saga async logic
│   └── index.ts          # Store configuration
├── types/                # TypeScript interfaces
│   └── index.ts
└── libs/                 # External library configurations
    └── apollo-client.ts
```

## Architecture Rules

### 1. Components Layer
- `components/` only contains reusable UI components
- No business logic here

### 2. Feature Layer
- `features/` contains domain modules (auth, post, comment, feed, profile)
- Each feature is self-contained with its own components, hooks, and logic

### 3. API Layer
- `apis/` contains all GraphQL queries and mutations
- Components must NEVER call GraphQL directly

### 4. Services Layer
- `services/` contains complex business logic or orchestration between APIs

### 5. State Layer
- Use Redux Toolkit for state management
- Use Redux Saga for async side effects

### 6. Types Layer
- All shared TypeScript interfaces go inside `types/`

## Features

- ✅ Authentication (Login, Register, Logout)
- ✅ User Profiles
- ✅ Create Posts
- ✅ Feed Timeline with Infinite Scroll
- ✅ Comment System
- ✅ Like System
- ✅ Notifications
- ✅ Search Functionality
- ✅ Graph-like Relationships

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

3. Configure your GraphQL endpoint in `.env.local`:
```
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3001/graphql
```

### Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
npm start
```

## GraphQL Integration

All data fetching uses GraphQL with the following pattern:

### Queries
```typescript
// Example: Get Feed
query GetFeed($limit: Int, $cursor: String) {
  feed(limit: $limit, cursor: $cursor) {
    items {
      post {
        id
        content
        author {
          id
          name
          avatar
        }
        createdAt
        likesCount
        commentsCount
        isLiked
      }
    }
    hasMore
    nextCursor
  }
}
```

### Mutations
```typescript
// Example: Create Post
mutation CreatePost($content: String!, $images: [String!]) {
  createPost(content: $content, images: $images) {
    id
    content
    author {
      id
      name
      avatar
    }
    createdAt
    likesCount
    commentsCount
    isLiked
  }
}
```

## Performance Optimizations

- ✅ useMemo and useCallback for expensive computations
- ✅ Lazy loading for components
- ✅ Pagination for large datasets
- ✅ Infinite scroll for feed
- ✅ Apollo Client caching

## Contributing

1. Follow the established architecture rules
2. Use TypeScript strictly
3. Write functional React components only
4. Separate UI, state, and API logic
5. Keep components small and reusable
6. Follow feature-based architecture

## License

MIT
