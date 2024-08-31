"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, ApolloLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { auth } from "../firebase/config"; // Assuming you're using Firebase for authentication

export const Provider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<ApolloClient<any> | null>(null);

  useEffect(() => {
    const setupClient = async () => {
      // Function to get the token from Firebase
      const getToken = async (): Promise<string> => {
        const idToken = await auth.currentUser?.getIdToken();
        return idToken ?? "";
      };

      // Auth Link: Adds the token to the request headers
      const authLink = setContext(async (_, { headers }) => {
        const token = await getToken();
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
          },
        };
      });

      // HttpLink: Connects to your GraphQL endpoint
      const httpLink = new HttpLink({
        uri: "http://localhost:8080/graphql",
      });

      // Create Apollo Client with auth link
      const apolloClient = new ApolloClient({
        link: from([authLink, httpLink]),
        cache: new InMemoryCache(),
      });

      // Set the client in the state
      setClient(apolloClient);
    };

    setupClient();
  }, []);

  // Render the ApolloProvider only when the client is ready
  if (!client) return <div>Loading...</div>;

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
