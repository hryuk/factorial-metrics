import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const httpLink = new HttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "https://factorial-metrics.hryuk.dev/graphql"
      : "http://localhost:3000/graphql",
});

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url:
            process.env.NODE_ENV === "production"
              ? "wss://factorial-metrics.hryuk.dev/graphql"
              : "ws://localhost:3000/graphql",
        })
      )
    : null;

const client = new ApolloClient({
  ssrMode: typeof window === "undefined",
  link:
    typeof window !== "undefined"
      ? split(
          ({ query }) => {
            const definition = getMainDefinition(query);

            return (
              definition.kind === "OperationDefinition" &&
              definition.operation === "subscription"
            );
          },

          wsLink,
          httpLink
        )
      : httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});

export default client;
