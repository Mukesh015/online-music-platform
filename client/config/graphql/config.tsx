"use client";
"use strict"
import React from "react";
import { ApolloLink, HttpLink, concat } from "@apollo/client";
import { ApolloNextAppProvider, InMemoryCache, ApolloClient, SSRMultipartLink } from "@apollo/experimental-nextjs-app-support";
import { useAuthToken } from "@/providers/authTokenProvider";

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  const { token } = useAuthToken();

  // Define the makeClient function inside the component so it can access the token
  const makeClient = () => {
    // Create the HTTP link to your GraphQL server
    const httpLink = new HttpLink({
      uri: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/graphql`,
    });

    // Create a middleware link to inject the Authorization header with the token
    const authLink = new ApolloLink((operation, forward) => {
      if (token) {
        operation.setContext(({ headers = {} }) => ({
          headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
          },
        }));
      }
      return forward(operation);
    });

    // Build the complete link chain for SSR and client-side requests
    const link =
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            authLink, // Add authLink here
            httpLink,
          ])
        : concat(authLink, httpLink); // Combine authLink with httpLink on the client side

    // Create the Apollo client instance
    return new ApolloClient({
      cache: new InMemoryCache(),
      link,
    });
  };

  // Pass makeClient to ApolloNextAppProvider instead of the client directly
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
