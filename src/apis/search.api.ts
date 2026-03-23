import { gql } from '@apollo/client';

export const SEARCH_QUERY = gql`
  query Search($query: String!, $type: SearchType, $limit: Int, $cursor: String) {
    search(query: $query, type: $type, limit: $limit, cursor: $cursor) {
      users {
        id
        name
        email
        avatar
        bio
        followersCount
        followingCount
        postsCount
      }
      posts {
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
      hasMore
      nextCursor
    }
  }
`;
