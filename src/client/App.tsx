import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createWSClient, wsLink } from '@trpc/client/links/wsLink';
import { SnackbarProvider } from 'notistack';
import { useState } from 'react';
import superjson from 'superjson';

import { type AppRouter } from '../server/router.js';

import Router from './router.js';
import theme from './theme';
import { trpc } from './utils/trpc.js';
/**
 *
 * @param context
 */
function getEndingLink() {
  if (typeof window === 'undefined') {
    return httpBatchLink({
      url: `/trpc`,
      headers() {
        return {};
      },
    });
  }
  const client = createWSClient({
    url: 'ws://127.0.0.1:7456/trpc',
  });
  return wsLink<AppRouter>({
    client,
  });
}
/**
 *
 */
export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,

      links: [getEndingLink()],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <Router />
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
