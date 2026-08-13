import { useQuery } from "@tanstack/react-query";
import { PaymentsService } from "@/lib/payments";

export function usePayment(id: number | string) {
    return useQuery({
        queryKey: ["payment", id],
        queryFn: async () => {
            const response = await PaymentsService.getById(id);
            return response.data?.payment || null;
        },
        enabled: !!id,
    });
}
