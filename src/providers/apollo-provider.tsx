'use client';

import React from 'react';
import { ApolloProvider as Provider } from '@apollo/client';
import { client } from '../libs/apollo-client';

interface ApolloProviderProps {
  children: React.ReactNode;
}

export const ApolloProvider: React.FC<ApolloProviderProps> = ({ children }) => {
  return <Provider client={client}>{children}</Provider>;
};
