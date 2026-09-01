import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BillsService } from "@/lib/bills";
import { showToast } from "@/components/sonner/CustomToaster";
import type {
    BillPayload,
    BillFindAllSuccess,
    BillDetailData,
    StoreBillPaymentPayload,
    StoreBillDebitNotePayload,
} from "@/types/bill";
import type { ApiResponse } from "@/types/api";

const BILLS_KEY = ["bills"] as const;
const BILL_KEY = (id: number | string) => ["bill", id] as const;

export function useBillsList(options?: { params?: Record<string, any>; enabled?: boolean; fetchKey?: number }) {
    const paramsKey = JSON.stringify(options?.params ?? {});
    const fetchKey = options?.fetchKey ?? 0;

    return useQuery<ApiResponse<BillFindAllSuccess>, Error, BillFindAllSuccess>({
        queryKey: [...BILLS_KEY, paramsKey, fetchKey],
        queryFn: async () => {
            const res = await BillsService.list(options?.params);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al obtener facturas de compra");
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

export function useBill(id: number | string, options?: { enabled?: boolean }) {
    return useQuery<ApiResponse<BillDetailData>, Error, BillDetailData>({
        queryKey: BILL_KEY(id),
        queryFn: async () => {
            const res = await BillsService.getById(id);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al obtener la factura de compra");
            }
            return res;
        },
        select: (res) => res.data,
        enabled: Boolean(id) && (options?.enabled ?? true),
        refetchOnMount: true,
    });
}

export function useCreateBill() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: BillPayload) => {
            const res = await BillsService.store(data);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al crear la factura de compra");
            }
            return res.data.bill;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BILLS_KEY });
            showToast("Factura de compra creada correctamente", "success");
        },
        onError: (err: any) => showToast(err?.message || "Error al crear la factura de compra", "error"),
    });
}

export function useSaveDraftBill() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: BillPayload) => {
            const res = await BillsService.saveDraft(data);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al guardar el borrador");
            }
            return res.data.bill;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: BILLS_KEY }),
    });
}

export function useUpdateBill() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: number | string; data: BillPayload }) => {
            const res = await BillsService.update(id, data);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al actualizar la factura de compra");
            }
            return res.data.bill;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: BILLS_KEY });
            queryClient.invalidateQueries({ queryKey: BILL_KEY(variables.id) });
            showToast("Factura de compra actualizada correctamente", "success");
        },
        onError: (err: any) => showToast(err?.message || "Error al actualizar la factura de compra", "error"),
    });
}

export function useCancelBill() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number | string) => {
            const res = await BillsService.cancel(id);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al anular la factura de compra");
            }
            return res.data.bill;
        },
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: BILLS_KEY });
            queryClient.invalidateQueries({ queryKey: BILL_KEY(id) });
        },
    });
}

export function useBillPayments(id: number | string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ["bill-payments", id],
        queryFn: async () => {
            const res: any = await BillsService.listPayments(id);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al obtener los pagos");
            }
            return res.data?.payments ?? [];
        },
        enabled: Boolean(id) && (options?.enabled ?? true),
    });
}

export function useCreateBillPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: number | string; data: StoreBillPaymentPayload }) => {
            const res: any = await BillsService.storePayment(id, data);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al registrar el pago");
            }
            return res.data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["bill-payments", variables.id] });
            queryClient.invalidateQueries({ queryKey: BILL_KEY(variables.id) });
            queryClient.invalidateQueries({ queryKey: BILLS_KEY });
        },
    });
}

export function useDeleteBillPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, paymentId }: { id: number | string; paymentId: number | string }) => {
            const res: any = await BillsService.deletePayment(id, paymentId);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al eliminar el pago");
            }
            return res;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["bill-payments", variables.id] });
            queryClient.invalidateQueries({ queryKey: BILL_KEY(variables.id) });
            queryClient.invalidateQueries({ queryKey: BILLS_KEY });
        },
    });
}

export function useCreateBillDebitNote() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: number | string; data: StoreBillDebitNotePayload }) => {
            const res: any = await BillsService.storeDebitNote(id, data);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al registrar la nota débito");
            }
            return res.data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: BILL_KEY(variables.id) });
            queryClient.invalidateQueries({ queryKey: BILLS_KEY });
        },
    });
}

export function useDeleteBillDebitNote() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, debitNoteId }: { id: number | string; debitNoteId: number | string }) => {
            const res: any = await BillsService.deleteDebitNote(id, debitNoteId);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al eliminar la nota débito");
            }
            return res;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: BILL_KEY(variables.id) });
            queryClient.invalidateQueries({ queryKey: BILLS_KEY });
        },
    });
}
