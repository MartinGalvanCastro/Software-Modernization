import React, {type PropsWithChildren} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,            // retry twice on failure
      retryDelay: 1000,    // 1s between retries
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,        // don’t retry mutations by default
    }
  }
})

export const ReactQueryProvider: React.FC<PropsWithChildren> = ({children}) => {

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
  