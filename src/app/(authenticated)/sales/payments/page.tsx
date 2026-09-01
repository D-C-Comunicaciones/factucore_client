"use client";

import * as React from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ColumnFiltersState } from "@tanstack/react-table";
import { PaymentTable } from "@/components/payments/PaymentTable";
import { usePayments } from "@/hooks/payments/usePayments";
import { showToast } from "@/components/sonner/CustomToaster";

export default function PaymentsPage() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [fetchKey, setFetchKey] = React.useState(0);

  // Reset pagination to page 1 when search or filters change
  React.useEffect(() => {
    setPage(1);
  }, [search, columnFilters]);

  const buildApiFilters = React.useCallback(() => {
    const apiParams: Record<string, any> = {};

    columnFilters.forEach((f) => {
      if (f.value === "" || f.value === undefined || f.value === null) return;
      
      if (f.id === "payment_status") {
        const statusMap: Record<string, number> = {
          "Conciliado": 1,
          "No conciliado": 2,
          "Anulado": 3,
        };
        apiParams["payment_status_id"] = statusMap[f.value as string] ?? f.value;
        return;
      }

      apiParams[f.id] = f.value;
    });

    return apiParams;
  }, [columnFilters]);

  const params = React.useMemo(() => {
    return {
      ...(search ? { search } : {}),
      page,
      per_page: perPage,
      ...buildApiFilters(),
    };
  }, [search, page, perPage, buildApiFilters]);

  const paramsKey = JSON.stringify(params);
  const prevParamsKeyRef = React.useRef<string>("");

  React.useEffect(() => {
    if (prevParamsKeyRef.current !== paramsKey) {
      prevParamsKeyRef.current = paramsKey;
      setFetchKey((k) => k + 1);
    }
  }, [paramsKey]);

  const { data, isLoading, isRefetching, refetch } = usePayments({
    params,
    fetchKey,
  });

  const payments = data?.data || [];
  const pagination = data ? {
    current_page: data.current_page,
    per_page: data.per_page,
    total: data.total,
    last_page: data.last_page,
    from: (data.current_page - 1) * data.per_page + 1,
    to: Math.min(data.current_page * data.per_page, data.total),
  } : {
    current_page: 1,
    per_page: 20,
    total: 0,
    last_page: 1,
    from: 0,
    to: 0,
  };

  /* ---------- Handlers ---------- */
  const handleRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const handleView = React.useCallback((id: number) => {
    router.push(`/sales/payments/${id}`);
  }, [router]);

  const handleEdit = React.useCallback((id: number) => {
    router.push(`/sales/payments/${id}/edit`);
  }, [router]);

  const handleDelete = React.useCallback((id: number) => {
    showToast(`El pago con ID ${id} ha sido eliminado. (Simulación)`, "success");
    handleRefresh();
  }, [handleRefresh]);

  const handleNewPayment = React.useCallback(() => {
    router.push("/sales/payments/new");
  }, [router]);

  return (
    <div className="w-full min-h-screen text-foreground">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">

        {/* HEADER */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
            
            <h1 className="page-title mb-0">
              Pagos recibidos
            </h1>

            <div className="flex items-center gap-2">
              {/* Nuevo pago */}
              <Button
                className="btn-base bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground ml-1 cursor-pointer"
                onClick={handleNewPayment}
              >
                <Plus className="w-4 h-4 mr-1" />
                Nuevo pago recibido
              </Button>
            </div>
          </div>

          <p className="page-subtitle mb-0">
            Registra y organiza todos los pagos que recibes en tu empresa. <a href="#" className="text-primary hover:underline">Saber más</a>
          </p>
        </div>

        {/* TABLE */}
        <div className="w-full mt-6">
          <PaymentTable
            payments={payments}
            loading={isLoading || isRefetching}
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            search={search}
            setSearch={setSearch}
            page={page}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
            pagination={pagination}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        </div>

      </div>
    </div>
  );
}
