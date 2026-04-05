import { gql } from "@apollo/client";

export const GET_FEED_QUERY = gql`
  query GetFeed($cursor: String) {
    feed(cursor: $cursor) {
      items {
        id
        content
        createdAt
        author {
          id
          name
          avatar
        }
        likes
        commentsCount
      }
      nextCursor
    }
  }
`;

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($content: String!) {
    createPost(content: $content) {
      id
      content
      createdAt
    }
  }
`;
