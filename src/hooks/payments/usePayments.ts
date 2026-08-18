import { useQuery } from "@tanstack/react-query";
import { PaymentListResponse } from "@/types/payments";
import { PaymentsService } from "@/lib/payments";

export function usePayments(options?: { params?: Record<string, any>; fetchKey?: number }) {
    const params = options?.params ?? {};
    const fetchKey = options?.fetchKey ?? 0;
    
    return useQuery<PaymentListResponse>({
        queryKey: ["payments", params, fetchKey],
        queryFn: async () => {
            const response = await PaymentsService.list(params);
            
            // Expected response format: { data: { payments: [...] } }
            // If the API implements pagination, it might return meta fields alongside payments.
            // For now, map the payments array and default pagination if missing.
            const paymentsData = response.data?.payments || [];
            
            return {
                data: paymentsData,
                current_page: response.data?.current_page || 1,
                per_page: response.data?.per_page || 20,
                total: response.data?.total || paymentsData.length,
                last_page: response.data?.last_page || 1,
            };
        },
    });
}
