import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      data {
        accessToken
        user {
          id
          username
          full_name
          email
          status
        }
      }
      message
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $full_name: String!, $email: String!, $password: String!) {
    register(username: $username, full_name: $full_name, email: $email, password: $password) {
      data {
        accessToken
        user {
          id
          username
          full_name
          email
          status
        }
      }
      message
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      data {
        id
        username
        full_name
        email
        status
      }
    }
  }
`;
