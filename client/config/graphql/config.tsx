"use client";
"use strict";

import React, { useCallback } from "react";
import { ApolloLink, HttpLink, concat } from "@apollo/client";
import { ApolloProvider, InMemoryCache, ApolloClient } from "@apollo/client";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { SSRMultipartLink  } from "@apollo/experimental-nextjs-app-support";

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  const token = useSelector((state: RootState) => state.authToken.token);

  const makeClient = useCallback(() => {
    const uri = `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/graphql`;
    const httpLink = new HttpLink({ uri });

    const authLink = new ApolloLink((operation, forward) => {
      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      }));
      return forward(operation);
    });

    let link;

    if (Boolean(token)) {

      if (typeof window === "undefined") {

        link = ApolloLink.from([
          new SSRMultipartLink({
            stripDefer: true,
          }),
          authLink,
          httpLink,
        ]);
      } else {

        link = concat(authLink, httpLink);
      }
    } else {

      if (typeof window === "undefined") {

        link = ApolloLink.from([
          new SSRMultipartLink({
            stripDefer: true,
          }),
          httpLink,
        ]);
      } else {
  
        link = httpLink;
      }
    }

    return new ApolloClient({
      cache: new InMemoryCache(),
      link,
    });
  }, [token]);

  const client = makeClient();

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
