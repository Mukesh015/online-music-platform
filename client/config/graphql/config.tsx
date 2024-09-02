"use client";
"use strict";
import React from "react";
import { ApolloLink, HttpLink, concat } from "@apollo/client";
import { ApolloNextAppProvider, InMemoryCache, ApolloClient, SSRMultipartLink } from "@apollo/experimental-nextjs-app-support";
import { useSelector } from 'react-redux';
import { RootState } from "@/lib/store";

export function ApolloWrapper({ children }: React.PropsWithChildren) {

  // Make sure token is available before rendering
  const token = useSelector((state: RootState) => state.authToken.token);
  if (!token) {
    // Handle token not available (e.g., redirect to login)
    return null;
  }

  const makeClient = () => {
    const httpLink = new HttpLink({
      uri: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/graphql`,
    });

    const authLink = new ApolloLink((operation, forward) => {
      // console.log("Token available: ", token); // This will now always log the token

      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          Authorization: `Bearer ${token} `, // Ensure there's a space after "Bearer"
        },
      }));

      return forward(operation);
    });

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