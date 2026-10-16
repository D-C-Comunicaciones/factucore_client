"use client";

import { useQuery } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { queryClient, localStoragePersister } from "@/lib/queryClient";
import { ReactNode } from "react";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { apiClient } from "@/lib/api-client";
import { AuthService } from "@/lib/auth";

// Este componente valida la sesión al inicio
function AuthBootstrap({ children }: { children: ReactNode }) {
    const { isLoading, isError } = useQuery({
        queryKey: QUERY_KEYS.auth.me(),
        queryFn: () => apiClient.get("/me"), // Llama al endpoint de sesión
        enabled: AuthService.isAuthenticated(), // Only call when a token exists
        retry: false, // Fallar rápido
    });

    if (isLoading) {
        // Un skeleton global o pantalla de carga limpia
        return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Cargando...</div>;
    }

    if (isError && typeof window !== "undefined" && window.location.pathname !== "/login") {
        // Esperamos redirección por el interceptor
        return null;
    }

    return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
    if (!localStoragePersister) {
        // Fallback SSR para que no rompa la hidratación inicial
        return <>{children}</>;
    }

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister: localStoragePersister,
                // Subir este valor descarta el caché de catálogos persistido en localStorage de
                // todos los usuarios — hacerlo cada vez que cambie la forma de los datos de un
                // catálogo (como el account_number agregado a bank-accounts), no solo aquí.
                buster: "2026-09-03-bank-account-number",
                dehydrateOptions: {
                    // Solo guardamos datos de catálogos en localstorage
                    shouldDehydrateQuery: (query) => {
                        return query.queryKey[0] === 'catalogs' && query.state.status === 'success';
                    },
                },
            }}
        >
            <AuthBootstrap>
                {children}
            </AuthBootstrap>
        </PersistQueryClientProvider>
    );
}
