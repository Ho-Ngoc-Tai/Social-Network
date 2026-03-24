'use client';

import React from 'react';
import { ApolloProvider as Provider } from '@apollo/client';
import { ClientProvider, useClient } from '@/components/client-switcher';

function ApolloProviderInner({ children }: { children: React.ReactNode }) {
  const { client } = useClient();
  return <Provider client={client}>{children}</Provider>;
}

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClientProvider>
      <ApolloProviderInner>
        {children}
      </ApolloProviderInner>
    </ClientProvider>
  );
}
