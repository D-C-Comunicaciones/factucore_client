// import { useEffect, useMemo, useState } from "react";
// import {
//     useQuery,
//     UseQueryOptions,
//     QueryKey,
// } from "@tanstack/react-query";
// import { envs } from "@/config/env";
// import axios from "axios";

// // ✅ Limpia params vacíos + normaliza valores
// function serializeParams<T extends Record<string, any>>(params: T): Partial<T> {
//     return Object.fromEntries(
//         Object.entries(params || {}).filter(([_, v]) => {
//             if (v === undefined || v === null || v === "") return false;

//             // opcional: normalizar Date
//             if (v instanceof Date) return true;

//             return true;
//         })
//     ) as Partial<T>;
// }

// // ✅ Construye URL dinámica
// function buildUrl(endpoint: string, params: Record<string, any>) {
//     const filtered = serializeParams(params);

//     const normalized = Object.entries(filtered).reduce(
//         (acc, [k, v]) => {
//             if (v instanceof Date) {
//                 // Ajusta formato según tu backend (ej: DD/MM/YYYY)
//                 acc[k] = v.toISOString();
//             } else {
//                 acc[k] = String(v);
//             }
//             return acc;
//         },
//         {} as Record<string, string>
//     );

//     const search = new URLSearchParams(normalized).toString();

//     return `${envs.apiUrl}${endpoint}${search ? `?${search}` : ""}`;
// }

// interface UseDebouncedQueryProps<
//     TParams extends Record<string, any>,
//     TResponse
// > {
//     endpoint: string;
//     params: TParams;
//     enabled?: boolean;
//     delay?: number;
//     queryOptions?: Omit<
//         UseQueryOptions<TResponse, Error, TResponse, QueryKey>,
//         "queryKey" | "queryFn"
//     >;
// }

// export function useDebouncedQuery<
//     TParams extends Record<string, any>,
//     TResponse = unknown
// >({
//     endpoint,
//     params,
//     enabled = true,
//     delay = 400,
//     queryOptions,
// }: UseDebouncedQueryProps<TParams, TResponse>) {
//     const [debouncedParams, setDebouncedParams] = useState(params);

//     // ✅ Debounce limpio
//     useEffect(() => {
//         const handler = setTimeout(() => {
//             setDebouncedParams(params);
//         }, delay);

//         return () => clearTimeout(handler);
//     }, [params, delay]);

//     // ✅ clave estable para cache
//     const stableParams = useMemo(
//         () => JSON.stringify(debouncedParams),
//         [debouncedParams]
//     );

//     // ✅ URL memoizada
//     const url = useMemo(
//         () => buildUrl(endpoint, debouncedParams),
//         [endpoint, stableParams]
//     );

//     const query = useQuery<TResponse>({
//         queryKey: [endpoint, stableParams],

//         queryFn: async ({ signal }) => {
//             try {
//                 const response = await axios.get(url, {
//                     withCredentials: true,
//                     signal,
//                 });
//                 return response.data;
//             } catch (err: any) {
//                 // Si es error de axios con response
//                 if (err?.response) {
//                     throw new Error(`Error HTTP: ${err.response.status}`);
//                 }
//                 throw err;
//             }
//         },

//         enabled,

//         // ✅ reemplazo moderno de keepPreviousData
//         placeholderData: (prev) => prev,

//         // 🔥 opcionales útiles (puedes ajustar)
//         staleTime: 1000 * 30, // 30s cache
//         refetchOnWindowFocus: false,

//         ...queryOptions,
//     });

//     return {
//         ...query,

//         // 👇 extras útiles para debugging / extensibilidad
//         url,
//         params: debouncedParams,
//     };
// }