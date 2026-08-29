"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, HelpCircle, Inbox, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DatePickerSimple } from "@/components/ui/DatePickerSimple";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ContactsService } from "@/lib/contacts";
import { showToast } from "@/components/sonner/CustomToaster";
import { usePurchaseOrderBuilder } from "@/hooks/purchaseOrders/usePurchaseOrderBuilder";
import { useCreatePurchaseOrder, useUpdatePurchaseOrder } from "@/hooks/purchaseOrders/usePurchaseOrders";
import { useCatalogs } from "@/hooks/useCatalogs";
import { PurchaseOrderLineItemsTable } from "@/components/purchase-order/PurchaseOrderLineItemsTable";
import { PurchaseOrderGlobalAdjustments } from "@/components/purchase-order/PurchaseOrderGlobalAdjustments";
import { QuickCreateItemModal } from "@/components/invoice/new/QuickCreateItemModal";
import type { PurchaseOrder } from "@/types/purchaseOrder";

function toDateInput(dateStr?: string): Date {
  if (!dateStr) return new Date();
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
}

function toDateStr(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function NewPurchaseOrderForm({
  mode,
  purchaseOrderId,
  initialData,
}: {
  mode: "create" | "edit";
  purchaseOrderId?: number | string;
  initialData?: PurchaseOrder;
}) {
  const router = useRouter();
  const catalogData = useCatalogs();
  const builder = usePurchaseOrderBuilder();
  const createPurchaseOrder = useCreatePurchaseOrder();
  const updatePurchaseOrder = useUpdatePurchaseOrder();

  const [contacts, setContacts] = useState<any[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [contactId, setContactId] = useState<string>("");
  const [issueDate, setIssueDate] = useState<Date>(new Date());
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [loadingSave, setLoadingSave] = useState(false);
  const [isQuickCreateItemModalOpen, setIsQuickCreateItemModalOpen] = useState(false);
  const [quickCreateItemTargetRow, setQuickCreateItemTargetRow] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoadingContacts(true);
      try {
        const res = await ContactsService.list({ role: "customer" });
        let list: any[] = [];
        if (res && res.data) {
          if (Array.isArray(res.data)) list = res.data;
          else if ((res.data as any).data && Array.isArray((res.data as any).data)) list = (res.data as any).data;
          else if ((res.data as any).contacts && Array.isArray((res.data as any).contacts)) list = (res.data as any).contacts;
        }
        setContacts(list);
      } catch (err) {
        console.error("Error al cargar clientes:", err);
      } finally {
        setLoadingContacts(false);
      }
    };
    fetchContacts();
  }, []);

  const prefillAppliedRef = useRef(false);
  useEffect(() => {
    if (mode === "edit" && initialData && !prefillAppliedRef.current) {
      prefillAppliedRef.current = true;
      setContactId(initialData.contact_id ? String(initialData.contact_id) : "");
      setIssueDate(toDateInput(initialData.issue_date));
      setReference(initialData.reference || "");
      setNotes(initialData.notes || "");
      builder.setItems(
        ((initialData as any).lines || initialData.items || []).map((line: any) => {
          const discount = (line.allowance_charges || line.discounts || [])[0];
          const tax = (line.taxes || [])[0];
          return {
            id: crypto.randomUUID(),
            item_id: line.item_id ?? null,
            item: line.name || "",
            referencia: line.reference || "",
            description: line.description || "",
            cantidad: line.quantity ?? "",
            precio: line.unit_price ?? 0,
            discountValue: discount?.value ?? 0,
            discountType: discount?.value_type === "fixed" ? "fixed" : "percentage",
            taxObj: tax || null,
          };
        })
      );

      const globalAdjustments = ((initialData as any).allowance_charges || [])
        .filter((ac: any) => ac.scope === "global")
        .map((ac: any) => ({
          id: crypto.randomUUID(),
          type: ac.charge_indicator ? "charge" : "discount",
          valueType: ac.value_type === "fixed" ? "fixed" : "percentage",
          value: Number(ac.value) || 0,
          reason: ac.reason || "",
        }));
      if (globalAdjustments.length > 0) {
        builder.setGlobalAdjustments(globalAdjustments);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, initialData]);

  const contactOptions = contacts.map((c) => ({
    value: c.id.toString(),
    label: c.registration_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || c.identification_number,
  }));

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!contactId) {
      newErrors.contact_id = "El cliente es requerido";
      setErrors(newErrors);
      showToast("El cliente es requerido", "error");
      return false;
    }

    if (!reference.trim()) {
      newErrors.reference = "El número de orden del cliente es requerido";
      setErrors(newErrors);
      showToast("El número de orden del cliente es requerido", "error");
      return false;
    }

    if (!builder.items || builder.items.length === 0) {
      newErrors.items = "empty_items";
      setErrors(newErrors);
      showToast("Debe agregar al menos un ítem a la orden de compra", "error");
      return false;
    }

    const hasEmptyItems = builder.items.some((item: any) => !item.item_id);
    if (hasEmptyItems) {
      newErrors.items = "empty_items";
      setErrors(newErrors);
      showToast("Por favor selecciona un producto o servicio en todas las filas de ítems", "error");
      return false;
    }

    const hasInvalidQuantity = builder.items.some((item: any) => item.item_id && (!item.cantidad || item.cantidad <= 0));
    if (hasInvalidQuantity) {
      newErrors.items = "invalid_quantity";
      setErrors(newErrors);
      showToast("Por favor ingrese una cantidad mayor a 0 en los productos seleccionados.", "error");
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoadingSave(true);
    try {
      const payload: any = builder.buildPayload({
        type: "external",
        contact_id: contactId,
        reference,
        issue_date: toDateStr(issueDate),
        notes,
        // Sin esto, cada edición reenvía status:"open" por defecto y pisa el
        // estado real de la orden (ej. "closed") — se preserva el existente.
        status: initialData?.status,
      });

      if (mode === "create") {
        const created = await createPurchaseOrder.mutateAsync(payload);
        showToast("Orden de compra creada correctamente", "success");
        router.push(created?.id ? `/sales/purchase-orders/${created.id}` : "/sales/purchase-orders");
      } else if (purchaseOrderId) {
        // El backend no permite cambiar type/resolution_id/prefix/number al editar
        delete payload.type;
        await updatePurchaseOrder.mutateAsync({ id: purchaseOrderId, data: payload });
        showToast("Orden de compra actualizada correctamente", "success");
        router.push(`/sales/purchase-orders/${purchaseOrderId}`);
      }
    } catch (error: any) {
      const backendErrors = error.response?.data?.errors;
      if (backendErrors) {
        setErrors(backendErrors);
        showToast(error.response?.data?.message || "Se encontraron errores de validación", "error");
      } else {
        showToast(error.response?.data?.message || error.message || "Error al guardar la orden de compra", "error");
      }
      console.error(error);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="space-y-6">
          <div>
            <div className="flex items-center text-sm text-primary mb-2 font-medium">
              <Link href="/sales/purchase-orders" className="hover:underline">
                Órdenes de compra recibidas
              </Link>
              <ChevronRight className="w-4 h-4 mx-1 text-slate-400" />
              <span className="text-slate-500">{mode === "create" ? "Nueva orden de compra" : "Editar orden de compra"}</span>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-[#001D4A]">
                {mode === "create" ? "Nueva orden de compra recibida" : "Editar orden de compra recibida"}
              </h1>
            </div>
          </div>

          <div className="filter drop-shadow-sm">
          <div
            className="relative bg-white rounded-lg border border-border p-4 md:p-6 space-y-6 overflow-hidden"
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

            {/* HEADER — no lleva datos de la empresa: es un documento entregado por el cliente */}
            <div className="grid grid-cols-3 items-start mb-2">
              <div className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-lg p-4 text-center justify-self-start flex flex-col items-center justify-center gap-1.5 min-w-[160px] min-h-[100px]">
                <Inbox className="w-8 h-8 text-primary" />
                <span className="text-xs font-medium text-primary">Documento externo</span>
              </div>

              <div className="text-center pt-2">
                <h2 className="text-lg font-bold text-[#001D4A]">Orden de compra de tu cliente</h2>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                  Este documento fue entregado por tu cliente. Regístralo aquí para asociarlo luego a su factura de venta.
                </p>
              </div>

              <div className="justify-self-end text-right pr-6 md:pr-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  <Inbox className="w-3.5 h-3.5" />
                  EXTERNA
                </span>
                <p className="text-xs text-muted-foreground mt-2 max-w-[160px]">
                  Sin numeración interna — usa la referencia que digites abajo.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
                {/* Columna izquierda */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground w-40 text-right shrink-0">
                      Cliente <span className="text-primary">*</span>
                    </label>
                    <div className="flex-1 flex items-center gap-2">
                      <SearchableSelect
                        value={contactId}
                        onValueChange={setContactId}
                        options={contactOptions}
                        loading={loadingContacts}
                        placeholder="Seleccionar cliente"
                        searchPlaceholder="Buscar cliente..."
                        className={`flex-1 h-9 ${errors.contact_id ? "border-destructive" : ""}`}
                      />
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                            Selecciona el cliente para el cual se emite esta orden de compra.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground w-40 text-right shrink-0">
                      N° orden del cliente <span className="text-primary">*</span>
                    </label>
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        placeholder="Ej: PO-2026-00458"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        className={`flex-1 h-9 ${errors.reference ? "border-destructive" : ""}`}
                      />
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-zinc-800 text-white p-2 text-xs max-w-[220px]">
                            Número que le dio el cliente a su propia orden de compra. Se digita manualmente, no se autogenera.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>

                {/* Columna derecha */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground w-40 text-right shrink-0">
                      Fecha de emisión <span className="text-primary">*</span>
                    </label>
                    <div className="flex-1 flex items-center gap-2">
                      <DatePickerSimple value={issueDate} onChange={setIssueDate} className="flex-1 h-9" />
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-4 h-4 text-primary cursor-help hover:text-primary/70 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                            Fecha en que se emite esta orden de compra.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
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
                        Agrega información importante que tu cliente verá en el documento.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </label>
                <Textarea
                  placeholder="Notas u observaciones sobre esta orden de compra"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-20 bg-white border-gray-300 hover:border-primary focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Ítems</h3>
              <PurchaseOrderLineItemsTable builder={builder} taxes={catalogData.taxes} errors={errors} />
            </div>

            <PurchaseOrderGlobalAdjustments builder={builder} />

            <div className="flex justify-end">
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
          </div>
          </div>

          <div className="flex items-center justify-end gap-2 pb-8">
            <Button
              variant="outline"
              onClick={() => router.push("/sales/purchase-orders")}
              disabled={loadingSave}
              className="bg-white border-gray-300 hover:bg-gray-50 cursor-pointer"
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loadingSave} className="cursor-pointer">
              {loadingSave && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              {mode === "create" ? "Crear orden de compra" : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </div>

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
  );
}
