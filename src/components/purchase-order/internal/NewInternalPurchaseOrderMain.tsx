"use client";

import { useEffect, useState } from "react";
import { HelpCircle, Plus, RefreshCw } from "lucide-react";
import { FactucoreLogo } from "@/components/brand/FactucoreLogo";
import { CompanyHeaderPdfStyle } from "@/components/shared/CompanyHeaderPdfStyle";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DatePickerSimple } from "@/components/ui/DatePickerSimple";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ContactsService } from "@/lib/contacts";
import { AddContactModal } from "@/components/contact/new/AddContactModal";
import { PurchaseOrderLineItemsTable } from "@/components/purchase-order/PurchaseOrderLineItemsTable";
import { PurchaseOrderGlobalAdjustments } from "@/components/purchase-order/PurchaseOrderGlobalAdjustments";
import { QuickCreateItemModal } from "@/components/invoice/new/QuickCreateItemModal";
import type { Resolution } from "@/lib/resolutions";

export function NewInternalPurchaseOrderMain({
  catalogData,
  builder,
  activeResolution,
  resolutions,
  selectedResolutionId,
  setSelectedResolutionId,
  onRefetchResolutions,
  formState,
  setFormState,
  errors,
  editMode = false,
  initialIssueDate,
  initialDeliveryDate,
  existingNumberLabel,
}: {
  catalogData: any;
  builder: any;
  activeResolution?: Resolution | null;
  resolutions: Resolution[];
  selectedResolutionId: number | null;
  setSelectedResolutionId: (id: number) => void;
  onRefetchResolutions?: () => void;
  formState: any;
  setFormState: React.Dispatch<React.SetStateAction<any>>;
  errors?: Record<string, any>;
  editMode?: boolean;
  initialIssueDate?: Date;
  initialDeliveryDate?: Date;
  existingNumberLabel?: string;
}) {
  const [providers, setProviders] = useState<any[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [isAddProviderModalOpen, setIsAddProviderModalOpen] = useState(false);
  const [issueDate, setIssueDate] = useState<Date>(initialIssueDate || new Date());
  const [deliveryDate, setDeliveryDate] = useState<Date>(initialDeliveryDate || new Date());
  const [isQuickCreateItemModalOpen, setIsQuickCreateItemModalOpen] = useState(false);
  const [quickCreateItemTargetRow, setQuickCreateItemTargetRow] = useState<string | null>(null);

  const fetchProviders = async () => {
    setLoadingProviders(true);
    try {
      const res = await ContactsService.list({ role: "provider" });
      let list: any[] = [];
      if (res && res.data) {
        if (Array.isArray(res.data)) list = res.data;
        else if ((res.data as any).data && Array.isArray((res.data as any).data)) list = (res.data as any).data;
        else if ((res.data as any).contacts && Array.isArray((res.data as any).contacts)) list = (res.data as any).contacts;
      }
      setProviders(list);
    } catch (err) {
      console.error("Error al cargar proveedores:", err);
    } finally {
      setLoadingProviders(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    setFormState((prev: any) => ({
      ...prev,
      issue_date: issueDate.toISOString().split("T")[0],
      delivery_date: deliveryDate.toISOString().split("T")[0],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issueDate, deliveryDate]);

  const providerOptions = providers.map((c) => ({
    value: c.id.toString(),
    label: c.registration_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || c.identification_number,
  }));

  const selectedProvider = providers.find((c) => c.id.toString() === (formState.contact_id || "").toString());

  const hasItemsError = errors?.items === "empty_items" || errors?.items === "invalid_quantity";

  return (
    <div className="filter drop-shadow-sm">
      <div
        className="relative bg-white rounded-lg border border-border p-4 md:p-8 overflow-hidden"
        style={{ clipPath: "polygon(0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 0 100%)" }}
      >
        {/* Folded Corner Effect */}
        <div
          className="absolute top-0 right-0 w-10 h-10 pointer-events-none"
          style={{ filter: "drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.08))" }}
        >
          <div
            className="w-full h-full bg-gradient-to-bl from-slate-200 via-slate-100 to-white border-l border-b border-slate-200/80"
            style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
          />
        </div>

      {/* HEADER */}
      <div className="grid grid-cols-3 items-start mb-8">
        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center justify-self-start flex items-center justify-center min-w-[160px] min-h-[100px]">
          <FactucoreLogo variant="icon" className="max-h-[80px] w-auto" alt="Logo de la empresa" />
        </div>

        <div className="text-center pt-2">
          <CompanyHeaderPdfStyle />
        </div>

        <div className="text-right justify-self-end">
          <div className="inline-flex flex-col items-end gap-1">
            <div className="grid grid-cols-[160px_auto] gap-x-2 gap-y-1 items-center">
              <span className="text-sm text-muted-foreground whitespace-nowrap text-center col-start-1">
                {activeResolution?.name || (activeResolution?.is_main ? "Numeración Principal" : "Numeración")}
              </span>
              <div className="col-start-1 row-start-2">
                {editMode ? (
                  <span className="text-sm font-medium text-foreground">{activeResolution?.prefix || "—"}</span>
                ) : (
                  <SearchableSelect
                    value={selectedResolutionId?.toString() || ""}
                    onValueChange={(val) => setSelectedResolutionId(Number(val))}
                    options={resolutions?.map((res: any) => ({
                      value: res.id.toString(),
                      label: res.prefix || `Resolución ${res.id}`,
                    })) || []}
                    placeholder="Seleccionar"
                    className="w-full text-foreground"
                  />
                )}
              </div>
            </div>
            <div className="flex items-center justify-end w-full gap-2 mt-1">
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">No.</span>
                {editMode ? (
                  <span className="font-bold text-lg text-foreground">{existingNumberLabel || "—"}</span>
                ) : activeResolution ? (
                  <span className="font-bold text-lg text-foreground">
                    {activeResolution.prefix || ""}
                    {(activeResolution.current_number ?? activeResolution.from_number - 1) + 1}
                  </span>
                ) : (
                  <div className="h-6 w-24 bg-muted animate-pulse rounded-md" />
                )}
              </div>
              {!editMode && (
                <button
                  type="button"
                  className="p-1 rounded hover:bg-muted/40 transition"
                  onClick={() => onRefetchResolutions?.()}
                  title="Actualizar numeración"
                >
                  <RefreshCw className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PROVEEDOR Y FECHAS */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-sm font-medium text-foreground shrink-0 whitespace-nowrap">
                Proveedor <span className="text-primary">*</span>
              </label>
              <SearchableSelect
                value={formState.contact_id || ""}
                onValueChange={(val) => setFormState((prev: any) => ({ ...prev, contact_id: val }))}
                options={providerOptions}
                placeholder={loadingProviders ? "Cargando proveedores..." : "Seleccionar proveedor"}
                searchPlaceholder="Buscar proveedor..."
                className={`flex-1 h-9 ${errors?.contact_id ? "border-destructive" : ""}`}
              />
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                    Selecciona el proveedor de esta orden de compra.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <button
              type="button"
              onClick={() => setIsAddProviderModalOpen(true)}
              className="w-full text-primary hover:text-primary/80 text-sm font-medium flex justify-center items-center gap-1 transition-colors h-9 rounded-md hover:bg-muted cursor-pointer mt-1"
            >
              <Plus className="w-4 h-4" />
              Nuevo proveedor
            </button>
          </div>

          <div className="flex items-center gap-2 self-start">
            <label className="flex items-center gap-1 text-sm font-medium text-foreground shrink-0 whitespace-nowrap w-36">
              Fecha <span className="text-primary">*</span>
            </label>
            <DatePickerSimple value={issueDate} onChange={setIssueDate} className="flex-1 h-9" />
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors shrink-0" />
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                  Fecha de emisión de esta orden de compra.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-2 self-start">
            <label className="flex items-center gap-1 text-sm font-medium text-foreground shrink-0 whitespace-nowrap w-36">
              Fecha de entrega <span className="text-primary">*</span>
            </label>
            <DatePickerSimple value={deliveryDate} onChange={setDeliveryDate} className="flex-1 h-9" />
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors shrink-0" />
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                  Fecha estimada de entrega de la mercancía.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-sm font-medium text-muted-foreground shrink-0 whitespace-nowrap">
              Identificación
            </label>
            <div className="flex-1 h-9 px-3 flex items-center rounded-md border border-border bg-muted/20 text-sm text-foreground">
              {selectedProvider?.identification_number || "—"}
            </div>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors shrink-0" />
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-800 text-white p-2 text-xs max-w-[220px]">
                  Se completa automáticamente al seleccionar el proveedor.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-sm font-medium text-muted-foreground shrink-0 whitespace-nowrap">
              Teléfono
            </label>
            <div className="flex-1 h-9 px-3 flex items-center rounded-md border border-border bg-muted/20 text-sm text-foreground">
              {selectedProvider?.phone1 || "—"}
            </div>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors shrink-0" />
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-800 text-white p-2 text-xs max-w-[220px]">
                  Se completa automáticamente al seleccionar el proveedor.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* ITEMS */}
      <div className={`space-y-2 mb-6 ${hasItemsError ? "ring-1 ring-destructive rounded-lg" : ""}`}>
        <PurchaseOrderLineItemsTable builder={builder} taxes={catalogData.taxes} errors={errors} />
      </div>

      <div className="mb-8">
        <PurchaseOrderGlobalAdjustments builder={builder} />
      </div>

      {/* TOTALES */}
      <div className="flex justify-end mb-8">
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium text-foreground">$ {new Intl.NumberFormat("es-CO").format(builder.totals.subtotal)}</span>
          </div>
          {builder.totals.lineDiscountsAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Descuentos de línea</span>
              <span className="font-medium text-destructive">- $ {new Intl.NumberFormat("es-CO").format(builder.totals.lineDiscountsAmount)}</span>
            </div>
          )}
          {builder.totals.globalDiscountsAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Descuentos globales</span>
              <span className="font-medium text-destructive">- $ {new Intl.NumberFormat("es-CO").format(builder.totals.globalDiscountsAmount)}</span>
            </div>
          )}
          {builder.totals.globalChargesAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cargos globales</span>
              <span className="font-medium text-foreground">$ {new Intl.NumberFormat("es-CO").format(builder.totals.globalChargesAmount)}</span>
            </div>
          )}
          {builder.totals.taxesAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Impuestos</span>
              <span className="font-medium text-foreground">$ {new Intl.NumberFormat("es-CO").format(builder.totals.taxesAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base pt-2 border-t border-border">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-bold text-foreground">$ {new Intl.NumberFormat("es-CO").format(builder.totals.total)}</span>
          </div>
        </div>
      </div>

      {/* TÉRMINOS Y NOTAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-1 text-sm font-medium text-foreground mb-2">
            Términos y condiciones
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help hover:text-primary/70 transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[280px] bg-zinc-800 text-white p-3 text-xs leading-relaxed">
                  Define las condiciones que le informarás a tu proveedor sobre esta orden de compra.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <Textarea
            placeholder="Define las condiciones de esta orden de compra"
            value={formState.terms_and_conditions || ""}
            onChange={(e) => setFormState((prev: any) => ({ ...prev, terms_and_conditions: e.target.value }))}
            className="min-h-20 bg-white border-gray-300 hover:border-primary focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        <div>
          <label className="flex items-center gap-1 text-sm font-medium text-foreground mb-2">
            Notas
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help hover:text-primary/70 transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[280px] bg-zinc-800 text-white p-3 text-xs leading-relaxed">
                  Agrega información importante que tu proveedor verá en el documento.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <Textarea
            placeholder="Visible en la impresión del documento"
            value={formState.notes || ""}
            onChange={(e) => setFormState((prev: any) => ({ ...prev, notes: e.target.value }))}
            className="min-h-20 bg-white border-gray-300 hover:border-primary focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      <AddContactModal
        isOpen={isAddProviderModalOpen}
        onClose={() => setIsAddProviderModalOpen(false)}
        catalogData={catalogData}
        prefilledData={{ contactTypes: ["proveedor"] } as any}
        onCustomerCreated={(created: any) => {
          setIsAddProviderModalOpen(false);
          fetchProviders();
          if (created?.id) {
            setFormState((prev: any) => ({ ...prev, contact_id: String(created.id) }));
          }
        }}
      />

      {/* Botón oculto para abrir el modal de creación rápida desde la tabla de ítems */}
      <button
        id="open-quick-item-modal"
        className="hidden"
        onClick={(e) => {
          const targetRowId = e.currentTarget.getAttribute("data-target-row");
          setQuickCreateItemTargetRow(targetRowId);
          setIsQuickCreateItemModalOpen(true);
        }}
      />

      <QuickCreateItemModal
        open={isQuickCreateItemModalOpen}
        onClose={() => setIsQuickCreateItemModalOpen(false)}
        catalogs={catalogData}
        onCreated={(createdItem) => {
          if (createdItem && quickCreateItemTargetRow) {
            builder.updateItem(quickCreateItemTargetRow, "item_id", createdItem.id);
            builder.updateItem(quickCreateItemTargetRow, "item", createdItem.name);
            builder.updateItem(quickCreateItemTargetRow, "referencia", createdItem.reference || "");
            builder.updateItem(quickCreateItemTargetRow, "description", createdItem.description || "");
            const price = parseFloat(createdItem.base_price) || parseFloat(createdItem.total_price) || parseFloat(createdItem.price) || 0;
            builder.updateItem(quickCreateItemTargetRow, "precio", price);
            builder.updateItem(quickCreateItemTargetRow, "cantidad", 1);
          }
          setIsQuickCreateItemModalOpen(false);
        }}
      />
      </div>
    </div>
  );
}
