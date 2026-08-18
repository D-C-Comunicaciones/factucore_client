import { useQuery } from "@tanstack/react-query";
import { ContactsService } from "@/lib/contacts";
import type { ApiResponse } from "@/types/api";

const CONTACTS_KEY = ["contacts"] as const;

export function useContactsList(options?: { params?: Record<string, any>; enabled?: boolean; fetchKey?: number }) {
    const paramsKey = JSON.stringify(options?.params ?? {});
    const page = options?.params?.current_page ?? 1;
    const perPage = options?.params?.per_page ?? 10;
    const fetchKey = options?.fetchKey ?? 0;
    const enabled = options?.enabled ?? true;

    return useQuery<ApiResponse<any>, Error, any>({
        queryKey: ["contacts", paramsKey, page, perPage, fetchKey],

        queryFn: async () => {
            const res = await ContactsService.list(options?.params);

            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al obtener contactos");
            }

            return res;
        },

        select: (res) => res.data,

        enabled: enabled,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });
}

export function useContact(id: string | number) {
    return useQuery<ApiResponse<any>, Error, any>({
        queryKey: ["contact", id],
        queryFn: async () => {
            const res = await ContactsService.getById(id);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al obtener el contacto");
            }
            return res;
        },
        enabled: !!id,
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
}
