// lib/queryClient.ts

import {
    QueryCache,
    QueryClient,
} from "@tanstack/react-query";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

/* ====================================================================== */
/* CACHE CONFIG                                                           */
/* ====================================================================== */

const ONE_HOUR =
    1000 * 60 * 60;

const ONE_DAY =
    ONE_HOUR * 24;

/* ====================================================================== */
/* QUERY CLIENT                                                           */
/* ====================================================================== */

export const queryClient =
    new QueryClient({
        queryCache: new QueryCache({
            onError: (error) => {
                console.error(
                    "🔥 Global Query Error:",
                    error
                );
            },
        }),

        defaultOptions: {
            queries: {
                /* =============================================================== */
                /* CACHE                                                           */
                /* =============================================================== */

                staleTime: ONE_DAY,

                gcTime: ONE_DAY,

                /* =============================================================== */
                /* NETWORK                                                         */
                /* =============================================================== */

                retry: 1,

                refetchOnMount: false,

                refetchOnReconnect: false,

                refetchOnWindowFocus: false,

                refetchInterval: false,

                /* =============================================================== */
                /* UX                                                              */
                /* =============================================================== */

                networkMode: "online",
            },

            mutations: {
                retry: 0,

                networkMode: "online",

                onError: (error) => {
                    console.error(
                        "🔥 Global Mutation Error:",
                        error
                    );
                },
            },
        },
    });

/* ====================================================================== */
/* PERSISTENCE                                                            */
/* ====================================================================== */

export const localStoragePersister =
    typeof window !== "undefined"
        ? createSyncStoragePersister({
            storage:
                window.localStorage,
            key: "facturacion-cache",
        })
        : undefined;