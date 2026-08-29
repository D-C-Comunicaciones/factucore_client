"use client";

import * as React from "react";
import { PurchaseOrderTable } from "@/components/purchase-order/PurchaseOrderTable";
import { usePurchaseOrdersList } from "@/hooks/purchaseOrders/usePurchaseOrders";
import { PurchaseOrderPageHeader } from "@/components/purchase-order/PurchaseOrderPageHeader";
import type { PurchaseOrderSummary } from "@/types/purchaseOrder";

export default function PurchaseOrdersPage() {
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
      type: "external",
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
        <PurchaseOrderPageHeader />

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
          />
        </div>
      </div>
    </div>
  );
}
