import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql',
  credentials: 'include',
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          feed: {
            merge(existing = [], incoming, { args }) {
              if (args?.cursor) {
                return [...existing, ...incoming];
              }
              return incoming;
            },
          },
          search: {
            merge(existing = { users: [], posts: [], hasMore: false }, incoming, { args }) {
              if (args?.cursor) {
                return {
                  users: [...existing.users, ...incoming.users],
                  posts: [...existing.posts, ...incoming.posts],
                  hasMore: incoming.hasMore,
                  nextCursor: incoming.nextCursor,
                };
              }
              return incoming;
            },
          },
        },
      },
      Post: {
        fields: {
          comments: {
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
