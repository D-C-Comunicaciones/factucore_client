import { QueryClient, QueryCache } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => {
            console.error("🔥 Global Query Error:", error);
        },
    }),
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 1000 * 60 * 2,
            gcTime: 1000 * 60 * 10,
        },
        mutations: {
            onError: (error) => {
                console.error("🔥 Global Mutation Error:", error);
            },
        },
    },
});