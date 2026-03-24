import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql',
  headers: {
    'Content-Type': 'application/json',
  },
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        feed: {
          keyArgs: ['limit', 'cursor'],
          merge(existing: any, incoming: any, { args }: any) {
            if (!existing) {
              return incoming;
            }
            if (!incoming) {
              return existing;
            }
            const merged = {
              ...existing,
              ...incoming,
              items: [...(existing.items || []), ...(incoming.items || [])],
            };
            return merged;
          },
        },
        posts: {
          keyArgs: ['limit', 'cursor'],
          merge(existing: any, incoming: any, { args }: any) {
            if (!existing) {
              return incoming;
            }
            if (!incoming) {
              return existing;
            }
            const merged = {
              ...existing,
              ...incoming,
              items: [...(existing.items || []), ...(incoming.items || [])],
            };
            return merged;
          },
        },
        comments: {
          keyArgs: ['postId', 'limit', 'cursor'],
          merge(existing: any, incoming: any, { args }: any) {
            if (!existing) {
              return incoming;
            }
            if (!incoming) {
              return existing;
            }
            const merged = {
              ...existing,
              ...incoming,
              items: [...(existing.items || []), ...(incoming.items || [])],
            };
            return merged;
          },
        },
      },
    },
  },
});

export const client = new ApolloClient({
  link: httpLink,
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Helper function to check GraphQL connection
export const checkGraphQLConnection = async () => {
  try {
    // Test with a simple introspection query
    const result = await client.query({
      query: gql`
        query CheckConnection {
          __schema {
            types {
              name
            }
          }
        }
      `,
    });
    console.log('GraphQL Connection Test:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('GraphQL Connection Error:', error);
    
    // More detailed error analysis
    let errorMessage = error.message || 'Failed to connect to GraphQL server';
    
    if (error.networkError) {
      errorMessage = `Network Error: ${error.networkError.message || error.networkError}`;
    }
    
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      errorMessage = `GraphQL Errors: ${error.graphQLErrors.map((e: any) => e.message).join(', ')}`;
    }
    
    if (error.message?.includes('fetch')) {
      errorMessage = `Fetch Error: Cannot reach ${process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql'}`;
    }
    
    return { 
      success: false, 
      error: errorMessage,
      networkError: error.networkError,
      graphQLErrors: error.graphQLErrors,
      originalError: error
    };
  }
};
