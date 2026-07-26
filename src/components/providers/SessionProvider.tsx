'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, usePathname } from 'next/navigation';
import { graphqlClient } from '@/lib/graphql';
import { useAuthStore } from '@/stores/auth';
import { gql } from 'graphql-request';

const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
    }
  }
`;

const PUBLIC_ROUTES = ['/login', '/register', '/'];

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const setUser = useAuthStore((state) => state.setUser);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  const { data, error, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: () => graphqlClient.request(ME_QUERY),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnMount: false, // Don't refetch if cache is fresh
    refetchOnWindowFocus: false,
    enabled: !isPublicRoute, // Only fetch on protected routes
  });

  useEffect(() => {
    if (data?.me) {
      setUser(data.me);
    }
  }, [data, setUser]);

  useEffect(() => {
    if (error && !isPublicRoute) {
      // Session expired or invalid → logout
      setUser(null);
      router.push(`/login?redirect=${pathname}`);
    }
  }, [error, isPublicRoute, pathname, router, setUser]);

  // Show loading only on protected routes while fetching initial session
  if (isLoading && !isPublicRoute) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
