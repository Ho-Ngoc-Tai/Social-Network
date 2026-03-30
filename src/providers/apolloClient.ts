import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

const uri =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "http://localhost:3000/graphql";

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri }),
  cache: new InMemoryCache(),
});
