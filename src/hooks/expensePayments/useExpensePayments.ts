import { useQuery } from "@tanstack/react-query";
import { ExpensePaymentsService } from "@/lib/expensePayments";

export function useExpensePaymentsList(params?: Record<string, any>) {
    return useQuery({
        queryKey: ["expense-payments", params],
        queryFn: async () => {
            const res: any = await ExpensePaymentsService.list(params);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al obtener los pagos");
            }
            return res.data?.payments ?? [];
        },
    });
}
