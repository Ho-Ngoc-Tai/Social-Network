import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      name
      email
      avatar
      bio
      createdAt
      updatedAt
      followersCount
      followingCount
      postsCount
      token
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      id
      name
      email
      avatar
      bio
      createdAt
      updatedAt
      followersCount
      followingCount
      postsCount
      token
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
      message
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken {
    refreshToken {
      token
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      avatar
      bio
      createdAt
      updatedAt
      followersCount
      followingCount
      postsCount
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($name: String, $bio: String, $avatar: String) {
    updateProfile(name: $name, bio: $bio, avatar: $avatar) {
      id
      name
      email
      avatar
      bio
      createdAt
      updatedAt
      followersCount
      followingCount
      postsCount
    }
  }
`;
