"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { ResolutionTable } from "@/components/resolution/ResolutionTable";
import { useResolutions } from "@/hooks/useResolutions";
import { useCatalogs } from "@/hooks/useCatalogs";
import { ColumnFiltersState } from "@tanstack/react-table";
import { showToast } from "@/components/sonner/CustomToaster";
import { useDebounce } from "@/hooks/useDebounce";

export default function ResolutionsPage() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [docTypeFilter, setDocTypeFilter] = React.useState<string>("all");

  const debouncedSearch = useDebounce(search, 600);

  // Extraer valores de los filtros de las columnas
  const isMainFilter = columnFilters.find((f) => f.id === "is_main")?.value as string | undefined;
  const isElectronicFilter = columnFilters.find((f) => f.id === "is_electronic")?.value as string | undefined;
  const isActiveFilter = columnFilters.find((f) => f.id === "is_active")?.value as string | undefined;

  const { resolutions, pagination, refetch, isLoading: isResolutionsLoading, toggleResolutionStatus, deleteResolution } = useResolutions({
    page,
    per_page: perPage,
    type_resolution: docTypeFilter,
    search: debouncedSearch || undefined,
    is_main: isMainFilter,
    is_electronic: isElectronicFilter,
    is_active: isActiveFilter,
  });

  const { typeResolutions, isLoading: isCatalogsLoading } = useCatalogs();

  const isLoading = isResolutionsLoading || isCatalogsLoading;

  const handleEdit = (id: number) => {
    router.push(`/resolutions/edit/${id}`);
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      await toggleResolutionStatus(id);
      showToast("Estado actualizado correctamente", "success");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Error al actualizar estado", "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteResolution(id);
      showToast("Numeración eliminada correctamente", "success");
    } catch (err: any) {
      if (err.response?.status === 422) {
        showToast("No se puede eliminar la numeración porque ya tiene documentos asociados.", "error");
      } else {
        showToast(err.response?.data?.message || "Error al eliminar numeración", "error");
      }
    }
  };

  const currentPagination = pagination || {
    current_page: page,
    per_page: perPage,
    total: resolutions.length,
    last_page: Math.ceil(resolutions.length / perPage) || 1,
    from: (page - 1) * perPage + 1,
    to: Math.min(page * perPage, resolutions.length),
  };

  return (
    <div className="w-full min-h-screen text-foreground">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">

        {/* HEADER */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
            <h1 className="page-title mb-0">Numeraciones de documentos</h1>
            <Button
              className="btn-base bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              onClick={() => router.push('/resolutions/new')}
            >
              <Plus className="w-4 h-4 mr-1" />
              Nueva numeración
            </Button>
          </div>
          <p className="page-subtitle mb-0 text-sm text-gray-500">
            Administra las numeraciones de los documentos que generas en tu negocio.{" "}
            <a href="#" className="text-primary hover:underline">
              Saber más
            </a>
          </p>
        </div>

        {/* DOC TYPE FILTER */}
        <div className="mb-6 w-full max-w-xs">
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Tipo de documento
          </label>
          <SearchableSelect
            value={docTypeFilter}
            onValueChange={setDocTypeFilter}
            options={[
              { value: "all", label: "Todos" },
              ...typeResolutions.map((type) => ({
                value: String(type.id),
                label: type.name
              }))
            ]}
            placeholder="Seleccionar"
          />
        </div>

        {/* TABLE */}
        <div className="w-full">
          <ResolutionTable
            resolutions={resolutions}
            loading={isLoading}
            search={search}
            setSearch={setSearch}
            page={page}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
            pagination={currentPagination}
            onEdit={handleEdit}
            onToggleActive={handleToggleActive}
            onDelete={handleDelete}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            onRefresh={() => refetch()}
          />
        </div>
      </div>
    </div>
  );
}
