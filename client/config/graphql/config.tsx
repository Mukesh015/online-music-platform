"use client"

import React, { createContext, useContext, ReactNode } from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';

// Step 2: Create ApolloClient
const createApolloClient = () => {
  return new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/graphql`,
    cache: new InMemoryCache(),
  });
};

const client = createApolloClient();

// Step 3: Create a context
const ApolloContext = createContext<ApolloClient<any> | null>(null);

// Step 4: Create a provider component
export const ApolloProvider = ({ children }: { children: ReactNode }) => {
  return <ApolloContext.Provider value={client}>{children}</ApolloContext.Provider>;
};

// Step 5: Create a hook to use the Apollo Client
export const useApolloClient = () => {
  const context = useContext(ApolloContext);
  if (!context) {
    throw new Error("useApolloClient must be used within an ApolloProvider");
  }
  return context;
};
