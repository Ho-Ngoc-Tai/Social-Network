import { gql } from "@apollo/client";

export const GET_PROFILE_QUERY = gql`
  query GetProfile($id: ID!) {
    user(id: $id) {
      id
      name
      avatar
      bio
    }
  }
`;
