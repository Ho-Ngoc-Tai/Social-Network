import { gql } from '@apollo/client';

export const GET_COMMENTS_QUERY = gql`
  query GetComments($postId: ID!, $limit: Int, $cursor: String) {
    comments(postId: $postId, limit: $limit, cursor: $cursor) {
      id
      content
      author {
        id
        name
        avatar
      }
      post {
        id
      }
      createdAt
      updatedAt
      likesCount
      isLiked
      replies {
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
        isLiked
      }
    }
  }
`;

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($content: String!, $postId: ID!, $parentCommentId: ID) {
    createComment(content: $content, postId: $postId, parentCommentId: $parentCommentId) {
      id
      content
      author {
        id
        name
        avatar
      }
      post {
        id
      }
      createdAt
      updatedAt
      likesCount
      isLiked
    }
  }
`;

export const UPDATE_COMMENT_MUTATION = gql`
  mutation UpdateComment($id: ID!, $content: String!) {
    updateComment(id: $id, content: $content) {
      id
      content
      author {
        id
        name
        avatar
      }
      post {
        id
      }
      createdAt
      updatedAt
      likesCount
      isLiked
    }
  }
`;

export const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id) {
      success
      message
    }
  }
`;

export const LIKE_COMMENT_MUTATION = gql`
  mutation LikeComment($commentId: ID!) {
    likeComment(commentId: $commentId) {
      id
      isLiked
      likesCount
    }
  }
`;

export const UNLIKE_COMMENT_MUTATION = gql`
  mutation UnlikeComment($commentId: ID!) {
    unlikeComment(commentId: $commentId) {
      id
      isLiked
      likesCount
    }
  }
`;
