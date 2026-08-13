"use client";

import React, { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CostCenterTable } from "@/components/cost-centers/CostCenterTable";
import { NewCostCenterModal } from "@/components/cost-centers/NewCostCenterModal";
import { ConfigCostCentersModal } from "@/components/cost-centers/ConfigCostCentersModal";
import { costCentersApi } from "@/lib/costCenters";
import { showToast } from "@/components/sonner/CustomToaster";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnFiltersState } from "@tanstack/react-table";

export default function CostCentersPage() {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const queryClient = useQueryClient();

  // Extract the code filter value from columnFilters
  const codeFilter = columnFilters.find(f => f.id === "code");
  const codeFilterValue = typeof codeFilter?.value === "string" ? codeFilter.value : "";

  // Fetch Cost Centers with server-side pagination
  const { data: costCentersResp, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['costCenters', page, perPage, search, codeFilterValue],
    queryFn: async () => {
      const response = await costCentersApi.getCostCenters({
        page,
        per_page: perPage,
        search: search || undefined,
        code: codeFilterValue || undefined,
      });
      return response;
    }
  });

  // Config query
  const { data: configResp } = useQuery({
    queryKey: ['costCentersConfig'],
    queryFn: async () => {
      try {
        const response = await costCentersApi.getSettings();
        return response.data || [];
      } catch (e) {
        return [];
      }
    },
    retry: false
  });

  const responseData = costCentersResp?.data;
  const costCenters = Array.isArray(responseData?.['cost-centers']) 
    ? responseData['cost-centers'] 
    : (Array.isArray(responseData?.data) ? responseData.data : (Array.isArray(responseData) ? responseData : []));
  const config = configResp || [];

  // Server pagination
  const pagination = {
    current_page: responseData?.current_page || page,
    per_page: responseData?.per_page || perPage,
    total: responseData?.total || costCenters.length,
    last_page: responseData?.last_page || 1,
    from: responseData?.from || (costCenters.length > 0 ? 1 : 0),
    to: responseData?.to || costCenters.length,
  };

  const [costCenterToEdit, setCostCenterToEdit] = useState<any | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefreshTable = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => costCentersApi.createCostCenter(data),
    onSuccess: () => {
      showToast("Centro de costo creado con éxito", "success");
      queryClient.invalidateQueries({ queryKey: ['costCenters'] });
    },
    onError: () => showToast("Error al crear el centro de costo", "error")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => costCentersApi.updateCostCenter(id, data),
    onSuccess: () => {
      showToast("Centro de costo actualizado con éxito", "success");
      queryClient.invalidateQueries({ queryKey: ['costCenters'] });
    },
    onError: () => showToast("Error al actualizar el centro de costo", "error")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => costCentersApi.deleteCostCenter(id),
    onSuccess: () => {
      showToast("Centro de costo eliminado con éxito", "success");
      queryClient.invalidateQueries({ queryKey: ['costCenters'] });
    },
    onError: () => showToast("Error al eliminar el centro de costo", "error")
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => costCentersApi.toggleStatus(id),
    onSuccess: () => {
      showToast("Estado actualizado con éxito", "success");
      queryClient.invalidateQueries({ queryKey: ['costCenters'] });
    },
    onError: () => showToast("Error al actualizar el estado", "error")
  });

  const saveConfigMutation = useMutation({
    mutationFn: (data: any) => costCentersApi.updateSettings(data),
    onSuccess: () => {
      showToast("Configuración guardada con éxito", "success");
      setIsConfigModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['costCentersConfig'] });
    },
    onError: () => showToast("Error al guardar la configuración", "error")
  });

  const handleSaveModal = async (data: any, createNew?: boolean) => {
    try {
      if (data.id) {
        await updateMutation.mutateAsync({ id: data.id, data });
        setIsNewModalOpen(false);
      } else {
        await createMutation.mutateAsync(data);
        if (!createNew) {
          setIsNewModalOpen(false);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este centro de costo?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleStatus = (id: number) => {
    toggleMutation.mutate(id);
  };

  const handleEdit = (costCenter: any) => {
    setCostCenterToEdit(costCenter);
    setIsNewModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto py-4 px-4 sm:px-6 md:px-8">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Centros de costos</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Crea centros de costo para distribuir los ingresos y gastos según las 
            áreas, proyectos o cualquier división de tu negocio. <a href="#" className="text-primary hover:underline">Ver más</a>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-primary hover:bg-primary/5 hover:text-primary cursor-pointer h-9 px-3 gap-1">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Ayuda</span>
          </Button>
          <Button 
            variant="outline" 
            className="bg-white border-border text-foreground hover:bg-muted cursor-pointer h-9 px-4 shadow-none font-medium"
            onClick={() => setIsConfigModalOpen(true)}
          >
            Configuración
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer h-9 px-4 font-medium"
            onClick={() => setIsNewModalOpen(true)}
          >
            + Nuevo centro de costo
          </Button>
        </div>
      </div>

      {/* Table */}
      <CostCenterTable
        costCenters={costCenters}
        loading={isLoading || isFetching || isRefreshing}
        refreshing={isRefreshing}
        onRefresh={handleRefreshTable}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        search={search}
        setSearch={setSearch}
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
        pagination={pagination}
        isError={isError}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onNew={() => setIsNewModalOpen(true)}
      />

      {/* Modals */}
      <NewCostCenterModal 
        open={isNewModalOpen}
        onOpenChange={(val) => {
          setIsNewModalOpen(val);
          if (!val) setCostCenterToEdit(null);
        }}
        onSave={handleSaveModal}
        onCancel={() => {
          setIsNewModalOpen(false);
          setCostCenterToEdit(null);
        }}
        costCenterToEdit={costCenterToEdit}
      />

      <ConfigCostCentersModal 
        open={isConfigModalOpen}
        onOpenChange={setIsConfigModalOpen}
        costCenters={costCenters}
        initialConfig={config}
        onSave={(data) => saveConfigMutation.mutate(data)}
        onCancel={() => setIsConfigModalOpen(false)}
      />
    </div>
  );
}
