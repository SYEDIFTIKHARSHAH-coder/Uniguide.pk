// ============================================================
// FILE: frontend/src/config/queryClient.js
// PURPOSE: Configures TanStack React Query (data fetching manager).
//
// WHAT IS REACT QUERY?
//   Instead of writing fetch + useState + useEffect in every
//   component, React Query gives you hooks like:
//     const { data, isLoading, error } = useQuery(...)
//   It also caches responses, retries on failure, and re-fetches
//   data when it becomes "stale" (outdated).
//
// HOW IT'S USED IN UniGuid.pk:
//   - Fetching university lists (cached so switching pages is instant)
//   - Fetching scholarship data
//   - Fetching student applications
//   - Any GET request to our backend API
// ============================================================

import { QueryClient } from "@tanstack/react-query";

/**
 * Create a QueryClient with default configuration.
 *
 * staleTime: How long data is considered "fresh" (5 minutes).
 *   If a user navigates away and comes back within 5 minutes,
 *   the cached data is shown instantly without a new API call.
 *
 * gcTime: How long cached data stays in memory (10 minutes).
 *   After 10 minutes of not being used, the cache is garbage collected.
 *
 * retry: Number of times to retry a failed request (1 retry).
 *
 * refetchOnWindowFocus: When the user switches back to your tab,
 *   React Query will re-fetch data to keep it up to date.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutes
      gcTime: 10 * 60 * 1000,           // 10 minutes (previously called cacheTime)
      retry: 1,                          // Retry failed requests once
      refetchOnWindowFocus: false,       // Don't refetch when tab regains focus
      refetchOnReconnect: true,          // Refetch when internet reconnects
    },
    mutations: {
      retry: 0,                          // Don't retry failed mutations (POST, PUT, DELETE)
    },
  },
});

export default queryClient;
