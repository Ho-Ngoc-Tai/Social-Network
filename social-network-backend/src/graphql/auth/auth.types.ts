import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  avatar?: string;

  @Field(() => String, { nullable: true })
  bio?: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;

  @Field(() => Number)
  followersCount: number;

  @Field(() => Number)
  followingCount: number;

  @Field(() => Number)
  postsCount: number;
}

@ObjectType()
export class AuthResponse {
  @Field(() => User)
  user: User;

  @Field(() => String)
  token: string;
}

@InputType()
export class LoginInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}

@InputType()
export class RegisterInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
