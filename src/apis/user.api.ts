import { gql } from '@apollo/client';

export const GET_USER_QUERY = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
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

export const SEARCH_USERS_QUERY = gql`
  query SearchUsers($query: String!, $limit: Int, $cursor: String) {
    searchUsers(query: $query, limit: $limit, cursor: $cursor) {
      id
      name
      email
      avatar
      bio
      followersCount
      followingCount
      postsCount
    }
  }
`;

export const FOLLOW_USER_MUTATION = gql`
  mutation FollowUser($userId: ID!) {
    followUser(userId: $userId) {
      id
      name
      email
      avatar
      bio
      followersCount
      followingCount
      postsCount
    }
  }
`;

export const UNFOLLOW_USER_MUTATION = gql`
  mutation UnfollowUser($userId: ID!) {
    unfollowUser(userId: $userId) {
      id
      name
      email
      avatar
      bio
      followersCount
      followingCount
      postsCount
    }
  }
`;

export const GET_FOLLOWERS_QUERY = gql`
  query GetFollowers($userId: ID!, $limit: Int, $cursor: String) {
    followers(userId: $userId, limit: $limit, cursor: $cursor) {
      id
      name
      email
      avatar
      bio
      followersCount
      followingCount
      postsCount
    }
  }
`;

export const GET_FOLLOWING_QUERY = gql`
  query GetFollowing($userId: ID!, $limit: Int, $cursor: String) {
    following(userId: $userId, limit: $limit, cursor: $cursor) {
      id
      name
      email
      avatar
      bio
      followersCount
      followingCount
      postsCount
    }
  }
`;

export const GET_USER_POSTS_QUERY = gql`
  query GetUserPosts($userId: ID!, $limit: Int, $cursor: String) {
    userPosts(userId: $userId, limit: $limit, cursor: $cursor) {
      id
      content
      author {
        id
        name
        avatar
      }
      createdAt
      updatedAt
      likesCount
      commentsCount
      isLiked
      images
    }
  }
`;
