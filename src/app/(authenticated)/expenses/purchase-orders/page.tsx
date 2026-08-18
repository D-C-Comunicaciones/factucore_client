"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PurchaseOrderTable } from "@/components/purchase-order/PurchaseOrderTable";
import { usePurchaseOrdersList } from "@/hooks/purchaseOrders/usePurchaseOrders";
import type { PurchaseOrderSummary } from "@/types/purchaseOrder";

export default function InternalPurchaseOrdersPage() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [fetchKey, setFetchKey] = React.useState(0);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  React.useEffect(() => {
    setPage(1);
  }, [search]);

  const params = React.useMemo(() => {
    const obj: Record<string, any> = {
      type: "internal",
      page,
      per_page: perPage,
    };
    if (search) obj.search = search;
    return obj;
  }, [search, page, perPage]);

  const paramsKey = JSON.stringify(params);
  const prevParamsKeyRef = React.useRef<string>("");

  React.useEffect(() => {
    if (prevParamsKeyRef.current !== paramsKey) {
      prevParamsKeyRef.current = paramsKey;
      setFetchKey((k) => k + 1);
    }
  }, [paramsKey]);

  const { data, isLoading, isFetching, isError, refetch } = usePurchaseOrdersList({
    params,
    enabled: true,
    fetchKey,
  });

  const handleRefreshTable = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const purchaseOrders: PurchaseOrderSummary[] = data?.purchase_orders ?? [];
  const pagination = data?.pagination ?? { current_page: 1, per_page: 10, total: 0, last_page: 1, from: 0, to: 0 };

  return (
    <div className="w-full min-h-screen">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-[#0F2843]">Órdenes de compra</h1>
              <p className="text-slate-500 text-sm mt-1">Registra y gestiona las órdenes de compra que le haces a tus proveedores.</p>
            </div>

            <Button size="sm" onClick={() => router.push("/expenses/purchase-orders/new")} className="cursor-pointer">
              <Plus className="w-3 h-3 mr-1" />
              Nueva orden de compra
            </Button>
          </div>
        </div>

        <div className="w-full">
          <PurchaseOrderTable
            purchaseOrders={purchaseOrders}
            loading={isLoading || isFetching || isRefreshing}
            refreshing={isRefreshing}
            onRefresh={handleRefreshTable}
            search={search}
            setSearch={setSearch}
            page={page}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
            pagination={pagination}
            isError={isError}
            variant="internal"
          />
        </div>
      </div>
    </div>
  );
}
