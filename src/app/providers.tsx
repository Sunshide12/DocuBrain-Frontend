'use client';

import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider, type Persister } from '@tanstack/react-query-persist-client';
import { get, set, del } from 'idb-keyval';
import { useState } from 'react';
import { SessionProvider } from '@/components/providers/SessionProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 24 * 60 * 60 * 1000, // 24 hours for offline support
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const persister: Persister = {
    persistClient: async (client) => {
      if (typeof window !== 'undefined') {
        await set('DOCUBRAIN_QUERY_CACHE', client);
      }
    },
    restoreClient: async () => {
      if (typeof window !== 'undefined') {
        return await get('DOCUBRAIN_QUERY_CACHE');
      }
      return undefined;
    },
    removeClient: async () => {
      if (typeof window !== 'undefined') {
        await del('DOCUBRAIN_QUERY_CACHE');
      }
    },
  };

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <SessionProvider>{children}</SessionProvider>
    </PersistQueryClientProvider>
  );
}
