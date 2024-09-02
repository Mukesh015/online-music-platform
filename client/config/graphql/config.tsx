"use client";
"use strict";
import React from "react";
import { ApolloLink, HttpLink, concat } from "@apollo/client";
import { ApolloNextAppProvider, InMemoryCache, ApolloClient, SSRMultipartLink } from "@apollo/experimental-nextjs-app-support";
import { useSelector } from 'react-redux';
import { RootState } from "@/lib/store";

export function ApolloWrapper({ children }: React.PropsWithChildren) {

  const token = useSelector((state: RootState) => state.authToken.token);

  const makeClient = () => {
    // Create the HTTP link to your GraphQL server
    const httpLink = new HttpLink({
      uri: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/graphql`,
    });

    // Create a middleware link to inject the Authorization header with the token
    const authLink = new ApolloLink((operation, forward) => {
      console.log("Token available: ", token);

      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : "fuckingIdiot",
        },
      }));

      return forward(operation);
    });

    // Combine the authLink with the httpLink
    const link =
      typeof window === "undefined"
        ? ApolloLink.from([
          new SSRMultipartLink({
            stripDefer: true,
          }),
          authLink,
          httpLink,
        ])
        : concat(authLink, httpLink);

    // Create the Apollo client instance
    return new ApolloClient({
      cache: new InMemoryCache(),
      link,
    });
  };

  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
