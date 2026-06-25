import { useQuery } from "@tanstack/react-query";
import { PaymentListResponse, Payment } from "@/types/payments";

const MOCK_PAYMENTS: Payment[] = [
  // Uncomment below to test populated state
  // {
  //   id: 1,
  //   number: "001",
  //   client: "Cliente Ejemplo A",
  //   created_at: "2026-06-20",
  //   bank_account: "Caja general",
  //   payment_status: "Conciliado",
  //   amount: 150000
  // },
  // {
  //   id: 2,
  //   number: "002",
  //   client: "Cliente Ejemplo B",
  //   created_at: "2026-06-21",
  //   bank_account: "Banco 1",
  //   payment_status: "No conciliado",
  //   amount: 320000
  // }
];

export function usePayments(params: Record<string, any> = {}) {
    return useQuery<PaymentListResponse>({
        queryKey: ["payments", params],
        queryFn: async () => {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 500));

            let filteredData = [...MOCK_PAYMENTS];

            // Apply search
            if (params.search) {
                const search = params.search.toLowerCase();
                filteredData = filteredData.filter(
                    (p) =>
                        p.number.toLowerCase().includes(search) ||
                        p.client.toLowerCase().includes(search)
                );
            }

            // Apply filters
            if (params.payment_status) {
                filteredData = filteredData.filter((p) => p.payment_status === params.payment_status);
            }

            if (params.bank_account) {
                filteredData = filteredData.filter((p) => p.bank_account === params.bank_account);
            }

            const page = params.page || 1;
            const perPage = params.per_page || 20;

            const total = filteredData.length;
            const lastPage = Math.ceil(total / perPage);
            const start = (page - 1) * perPage;
            const end = start + perPage;

            const paginatedData = filteredData.slice(start, end);

            return {
                data: paginatedData,
                current_page: page,
                per_page: perPage,
                total: total,
                last_page: lastPage,
            };
        },
    });
}
