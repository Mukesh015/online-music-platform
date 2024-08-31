"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, ApolloLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useAuthToken } from "@/providers/authTokenProvider"


export const Provider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<ApolloClient<any> | null>(null);
  const { token } = useAuthToken();

  useEffect(() => {
    const setupClient = async () => {
      const authLink = setContext(async (_, { headers }) => {
        console.log(token)
        return {
          headers: {
            ...headers,
            'authorization': `Bearer ${token}`,
          },
        };
      });

      const httpLink = new HttpLink({
        uri: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}`,
      });

      const apolloClient = new ApolloClient({
        link: from([authLink, httpLink]),
        cache: new InMemoryCache(),
      });

      setClient(apolloClient);
    };
    if (token) {
      setupClient();
    }
  }, [token]);

  if (!client) return <div>Loading...</div>;

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
