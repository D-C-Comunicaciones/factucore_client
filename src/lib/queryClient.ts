import { QueryClient, QueryCache } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => {
            console.error("🔥 Global Query Error:", error);
        },
    }),
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 30,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
        },
        mutations: {
            onError: (error) => {
                console.error("🔥 Global Mutation Error:", error);
            },
        },
    },
});