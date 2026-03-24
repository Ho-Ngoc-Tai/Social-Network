import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// Mock data for testing
const mockUsers: any[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'test@example.com',
    password: 'test123', // For testing only
    avatar: '',
    bio: 'Tôi là người dùng test',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    followersCount: 10,
    followingCount: 25,
    postsCount: 5,
    token: 'mock-jwt-token-12345'
  },
  {
    id: '2',
    name: 'Trần Thị B',
    email: 'user2@example.com',
    password: 'password123',
    avatar: '',
    bio: 'Xin chào mọi người!',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    followersCount: 50,
    followingCount: 100,
    postsCount: 20,
    token: 'mock-jwt-token-67890'
  }
];

const mockPosts: any[] = [
  {
    id: '1',
    content: 'Đây là bài viết đầu tiên của tôi! 🎉',
    author: mockUsers[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likesCount: 5,
    commentsCount: 2,
    isLiked: false,
    image: null
  },
  {
    id: '2',
    content: 'Hôm nay trời đẹp quá! ☀️',
    author: mockUsers[1],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    likesCount: 12,
    commentsCount: 8,
    isLiked: true,
    image: null
  }
];

// Mock Apollo Client
const mockClient = new ApolloClient({
  cache: new InMemoryCache(),
  typeDefs: gql`
    type Query {
      me: User
      users: [User]
      feed(limit: Int, cursor: String): FeedResponse
      user(id: ID!): User
    }
    
    type Mutation {
      login(email: String!, password: String!): AuthResponse
      register(name: String!, email: String!, password: String!): AuthResponse
      logout: Boolean
      createPost(content: String!): Post
    }
    
    type User {
      id: ID!
      name: String!
      email: String!
      avatar: String
      bio: String
      createdAt: String!
      updatedAt: String!
      followersCount: Int!
      followingCount: Int!
      postsCount: Int!
    }
    
    type Post {
      id: ID!
      content: String!
      author: User!
      createdAt: String!
      updatedAt: String!
      likesCount: Int!
      commentsCount: Int!
      isLiked: Boolean!
      image: String
    }
    
    type AuthResponse {
      user: User
      token: String
    }
    
    type FeedResponse {
      items: [Post]
      hasMore: Boolean
    }
  `,
  resolvers: {
    Query: {
      me: () => mockUsers[0],
      users: () => mockUsers,
      feed: () => ({
        items: mockPosts,
        hasMore: false
      }),
      user: (_: any, { id }: { id: string }) => {
        return mockUsers.find(user => user.id === id) || null;
      }
    },
    Mutation: {
      login: (_: any, { email, password }: { email: string; password: string }) => {
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (!user) {
          throw new Error('Email hoặc mật khẩu không đúng');
        }
        
        return {
          user,
          token: user.token
        };
      },
      register: (_: any, { name, email, password }: { name: string; email: string; password: string }) => {
        const existingUser = mockUsers.find(u => u.email === email);
        if (existingUser) {
          throw new Error('Email đã tồn tại');
        }
        
        const newUser = {
          id: String(mockUsers.length + 1),
          name,
          email,
          avatar: '',
          bio: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          followersCount: 0,
          followingCount: 0,
          postsCount: 0,
          token: `mock-token-${Date.now()}`
        };
        
        mockUsers.push(newUser);
        
        return {
          user: newUser,
          token: newUser.token
        };
      },
      logout: () => true,
      createPost: (_: any, { content }: { content: string }) => {
        const newPost = {
          id: String(mockPosts.length + 1),
          content,
          author: mockUsers[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          likesCount: 0,
          commentsCount: 0,
          isLiked: false,
          image: null
        };
        
        mockPosts.unshift(newPost);
        return newPost;
      }
    }
  }
});

export const mockClientInstance = mockClient;

// Helper function to check mock connection
export const checkMockConnection = async () => {
  try {
    const result = await mockClient.query({
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
    return { success: true, data: result };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Mock connection failed'
    };
  }
};
