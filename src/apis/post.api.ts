import { gql } from '@apollo/client';

export const GET_POSTS_QUERY = gql`
  query GetPosts($limit: Int, $cursor: String) {
    posts(limit: $limit, cursor: $cursor) {
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

export const GET_POST_QUERY = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      content
      author {
        id
        name
        avatar
        bio
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

export const CREATE_POST_MUTATION = gql`
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
      updatedAt
      likesCount
      commentsCount
      isLiked
      images
    }
  }
`;

export const UPDATE_POST_MUTATION = gql`
  mutation UpdatePost($id: ID!, $content: String, $images: [String!]) {
    updatePost(id: $id, content: $content, images: $images) {
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

export const DELETE_POST_MUTATION = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      success
      message
    }
  }
`;

export const LIKE_POST_MUTATION = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      isLiked
      likesCount
    }
  }
`;

export const UNLIKE_POST_MUTATION = gql`
  mutation UnlikePost($postId: ID!) {
    unlikePost(postId: $postId) {
      id
      isLiked
      likesCount
    }
  }
`;
