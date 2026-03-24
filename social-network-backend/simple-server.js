const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { readFileSync } = require('fs');

// Mock data
const users = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'test@example.com',
    password: 'test123', // Plain text for demo
    avatar: '',
    bio: 'Tôi là người dùng test',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    followersCount: 10,
    followingCount: 25,
    postsCount: 5,
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
  },
];

// GraphQL schema
const typeDefs = `
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

  type AuthResponse {
    user: User!
    token: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  type Query {
    me: AuthResponse
    users: [User!]!
  }

  type Mutation {
    login(email: String!, password: String!): AuthResponse!
    register(name: String!, email: String!, password: String!): AuthResponse!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    me: () => ({
      user: users[0],
      token: 'mock-jwt-token-1-current',
    }),
    users: () => users,
  },
  Mutation: {
    login: (_, { email, password }) => {
      // Find user by email
      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error('Email hoặc mật khẩu không đúng');
      }
      
      // Simple password check (in production, use bcrypt)
      if (user.password !== password) {
        throw new Error('Email hoặc mật khẩu không đúng');
      }
      
      // Generate mock token
      const token = `mock-jwt-token-${user.id}-${Date.now()}`;
      
      return {
        user,
        token,
      };
    },
    
    register: (_, { name, email, password }) => {
      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        throw new Error('Email đã tồn tại');
      }
      
      // Create new user
      const newUser = {
        id: String(users.length + 1),
        name,
        email,
        password,
        avatar: '',
        bio: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
      };
      
      users.push(newUser);
      
      const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
      
      return {
        user: newUser,
        token,
      };
    },
  },
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  csrfPrevention: false,
});

// Start server
async function startServer() {
  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port: 3001 },
      context: async ({ req }) => {
        // Add any context logic here
        return {};
      },
    });
    
    console.log(`🚀 GraphQL Server ready at: ${url}`);
    console.log(`📊 GraphQL Playground: ${url}graphql`);
    console.log('');
    console.log('🔑 Test credentials:');
    console.log('  Email: test@example.com');
    console.log('  Password: test123');
    console.log('');
    console.log('  Email: user2@example.com');
    console.log('  Password: password123');
    console.log('');
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
