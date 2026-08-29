import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupportDocumentsService } from "@/lib/supportDocuments";
import type { SupportDocument } from "@/types/supportDocument";

export function useSupportDocumentsList({
    params = {},
    enabled = true,
    fetchKey = 0
}: {
    params?: Record<string, any>;
    enabled?: boolean;
    fetchKey?: number;
}) {
    return useQuery({
        queryKey: ["support-documents", params, fetchKey],
        queryFn: async () => {
            const res: any = await SupportDocumentsService.list(params);
            return res?.data || res;
        },
        enabled
    });
}

export function useSupportDocument(id: number | string, enabled = true) {
    return useQuery({
        queryKey: ["support-document", id],
        queryFn: async () => {
            const res: any = await SupportDocumentsService.getById(id);
            return res?.data || res;
        },
        enabled: Boolean(id) && enabled
    });
}

export function useCreateSupportDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<SupportDocument>) => {
            const res: any = await SupportDocumentsService.store(data);
            return res?.data || res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["support-documents"] });
        }
    });
}

export function useUpdateSupportDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: number | string; data: Partial<SupportDocument> }) => {
            const res: any = await SupportDocumentsService.update(id, data);
            return res?.data || res;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["support-documents"] });
            queryClient.invalidateQueries({ queryKey: ["support-document", variables.id] });
        }
    });
}

export function useDeleteSupportDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number | string) => {
            const res: any = await SupportDocumentsService.delete(id);
            return res?.data || res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["support-documents"] });
        }
    });
}
