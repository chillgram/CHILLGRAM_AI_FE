import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // 개발단계: 0~1
      refetchOnWindowFocus: false,
    },
  },
});
