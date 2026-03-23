import { gql } from '@apollo/client';

export const GET_FEED_QUERY = gql`
  query GetFeed($limit: Int, $cursor: String) {
    feed(limit: $limit, cursor: $cursor) {
      items {
        post {
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
        timestamp
      }
      hasMore
      nextCursor
    }
  }
`;

export const GET_TRENDING_POSTS_QUERY = gql`
  query GetTrendingPosts($limit: Int, $cursor: String) {
    trendingPosts(limit: $limit, cursor: $cursor) {
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
