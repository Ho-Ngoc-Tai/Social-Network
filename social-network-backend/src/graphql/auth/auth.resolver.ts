import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthResponse, LoginInput, RegisterInput, User } from './auth.types';

@Resolver(() => AuthResponse)
export class AuthResolver {
  // Mock users data
  private users = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'test@example.com',
      password: '$2b$10$N9qo8uLOickgx2ZMRZoMy.MrqJqJ8j5Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z', // bcrypt hash of 'test123'
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
      password: '$2b$10$N9qo8uLOickgx2ZMRZoMy.MrqJqJ8j5Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z', // bcrypt hash of 'password123'
      avatar: '',
      bio: 'Xin chào mọi người!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      followersCount: 50,
      followingCount: 100,
      postsCount: 20,
    },
  ];

  @Mutation(() => AuthResponse)
  async login(@Args('input') loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;
    
    // Find user by email
    const user = this.users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }
    
    // For simplicity, we'll skip password verification in this demo
    // In production, you'd use bcrypt.compare
    
    // Generate mock token
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    
    return {
      user,
      token,
    };
  }

  @Mutation(() => AuthResponse)
  async register(@Args('input') registerInput: RegisterInput): Promise<AuthResponse> {
    const { name, email, password } = registerInput;
    
    // Check if user already exists
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('Email đã tồn tại');
    }
    
    // Create new user
    const newUser = {
      id: String(this.users.length + 1),
      name,
      email,
      password: '$2b$10$N9qo8uLOickgx2ZMRZoMy.MrqJqJ8j5Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z', // mock hash
      avatar: '',
      bio: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
    };
    
    this.users.push(newUser);
    
    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
    
    return {
      user: newUser,
      token,
    };
  }

  @Query(() => AuthResponse)
  async me(): Promise<AuthResponse> {
    // Mock authenticated user
    return {
      user: this.users[0],
      token: 'mock-jwt-token-1-current',
    };
  }
}
