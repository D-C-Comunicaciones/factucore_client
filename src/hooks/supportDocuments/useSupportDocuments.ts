import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupportDocumentsService } from "@/lib/supportDocuments";
import type {
    SupportDocumentPayload,
    SupportDocumentFindAllSuccess,
    SupportDocumentDetailData,
    StoreSupportDocumentPaymentPayload,
} from "@/types/supportDocument";
import type { ApiResponse } from "@/types/api";

const SUPPORT_DOCUMENTS_KEY = ["support-documents"] as const;
const SUPPORT_DOCUMENT_KEY = (id: number | string) => ["support-document", id] as const;

export function useSupportDocumentsList(options?: {
    params?: Record<string, any>;
    enabled?: boolean;
    fetchKey?: number;
}) {
    const paramsKey = JSON.stringify(options?.params ?? {});
    const fetchKey = options?.fetchKey ?? 0;

    return useQuery<ApiResponse<SupportDocumentFindAllSuccess>, Error, SupportDocumentFindAllSuccess>({
        queryKey: [...SUPPORT_DOCUMENTS_KEY, paramsKey, fetchKey],
        queryFn: async () => {
            const res = await SupportDocumentsService.list(options?.params);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al obtener documentos soporte");
            }
            return res;
        },
        select: (res) => res.data,
        enabled: options?.enabled ?? true,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    });
}

export function useSupportDocument(id: number | string, options?: { enabled?: boolean }) {
    return useQuery<ApiResponse<SupportDocumentDetailData>, Error, SupportDocumentDetailData>({
        queryKey: SUPPORT_DOCUMENT_KEY(id),
        queryFn: async () => {
            const res = await SupportDocumentsService.getById(id);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al obtener el documento soporte");
            }
            return res;
        },
        select: (res) => res.data,
        enabled: Boolean(id) && (options?.enabled ?? true),
        refetchOnMount: true,
    });
}

export function useCreateSupportDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: SupportDocumentPayload) => {
            const res = await SupportDocumentsService.store(data);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al crear el documento soporte");
            }
            return res.data.support_document;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SUPPORT_DOCUMENTS_KEY });
        },
    });
}

export function useSaveDraftSupportDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: SupportDocumentPayload) => {
            const res = await SupportDocumentsService.saveDraft(data);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al guardar el borrador");
            }
            return res.data.support_document;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SUPPORT_DOCUMENTS_KEY });
        },
    });
}

export function useUpdateSupportDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: number | string; data: SupportDocumentPayload }) => {
            const res = await SupportDocumentsService.update(id, data);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al actualizar el documento soporte");
            }
            return res.data.support_document;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: SUPPORT_DOCUMENTS_KEY });
            queryClient.invalidateQueries({ queryKey: SUPPORT_DOCUMENT_KEY(variables.id) });
        },
    });
}

export function useCancelSupportDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number | string) => {
            const res = await SupportDocumentsService.cancel(id);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al anular el documento soporte");
            }
            return res.data.support_document;
        },
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: SUPPORT_DOCUMENTS_KEY });
            queryClient.invalidateQueries({ queryKey: SUPPORT_DOCUMENT_KEY(id) });
        },
    });
}

/** Creates (or re-sends) the document and submits it to DIAN's habilitación (test) environment. */
export function useSendTestSupportDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: SupportDocumentPayload) => {
            const res: any = await SupportDocumentsService.sendTest(data);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al enviar el documento soporte a la DIAN");
            }
            // The human-readable outcome ("Batch en proceso de validación", a DIAN rejection
            // reason, etc.) is promoted to the top-level envelope by ResponseMiddleware and
            // stripped out of `data` — merge it back in so callers can show it in a toast.
            return { ...res.data, message: res.message } as import("@/types/supportDocument").SupportDocumentSendTestResult;
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: SUPPORT_DOCUMENTS_KEY });
        },
    });
}

/** Sends an already-saved Support Document to DIAN's habilitación environment (no re-create). */
export function useSendExistingTestSupportDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number | string) => {
            const res: any = await SupportDocumentsService.sendExistingTest(id);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al enviar el documento soporte a la DIAN");
            }
            return { ...res.data, message: res.message } as import("@/types/supportDocument").SupportDocumentSendTestResult;
        },
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: SUPPORT_DOCUMENTS_KEY });
            queryClient.invalidateQueries({ queryKey: SUPPORT_DOCUMENT_KEY(id) });
        },
    });
}

export function useSupportDocumentPayments(id: number | string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ["support-document-payments", id],
        queryFn: async () => {
            const res: any = await SupportDocumentsService.listPayments(id);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al obtener los pagos");
            }
            return res.data?.payments ?? [];
        },
        enabled: Boolean(id) && (options?.enabled ?? true),
    });
}

export function useCreateSupportDocumentPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: number | string; data: StoreSupportDocumentPaymentPayload }) => {
            const res: any = await SupportDocumentsService.storePayment(id, data);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al registrar el pago");
            }
            return res.data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["support-document-payments", variables.id] });
            queryClient.invalidateQueries({ queryKey: SUPPORT_DOCUMENT_KEY(variables.id) });
            queryClient.invalidateQueries({ queryKey: SUPPORT_DOCUMENTS_KEY });
        },
    });
}

export function useDeleteSupportDocumentPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, paymentId }: { id: number | string; paymentId: number | string }) => {
            const res: any = await SupportDocumentsService.deletePayment(id, paymentId);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al eliminar el pago");
            }
            return res;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["support-document-payments", variables.id] });
            queryClient.invalidateQueries({ queryKey: SUPPORT_DOCUMENT_KEY(variables.id) });
            queryClient.invalidateQueries({ queryKey: SUPPORT_DOCUMENTS_KEY });
        },
    });
}
