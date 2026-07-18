import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Info, PenLine, ChevronLeft, ChevronRight, AlertTriangle, Loader2, AlertCircle } from "lucide-react";
import { InvoicesService } from "@/lib/invoices";
import { InvoiceSummary } from "@/types/invoice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { showToast } from "@/components/sonner/CustomToaster";
import { WithholdingsModal, WithholdingEntry } from "./WithholdingsModal";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";

function parseDateSafe(dateStr: string | null) {
  if (!dateStr) return null;
  const isoStr = dateStr.replace(' ', 'T');
  let d = new Date(isoStr);
  if (!isNaN(d.getTime())) return d;
  
  const parts = dateStr.split(/[-/]/);
  if (parts.length >= 3 && parts[0].length <= 2) {
    d = new Date(`${parts[2].substring(0,4)}-${parts[1]}-${parts[0]}T00:00:00`);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

interface PaymentInvoicesListProps {
  contactId: string | null;
  formState: any;
  setFormState: React.Dispatch<React.SetStateAction<any>>;
  formErrors?: Record<string, boolean>;
}

export function PaymentInvoicesList({ contactId, formState, setFormState, formErrors }: PaymentInvoicesListProps) {
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Use local state if formState isn't provided, otherwise use formState
  const [localReceivedAmounts, setLocalReceivedAmounts] = useState<Record<number, string>>({});
  const [localWithholdings, setLocalWithholdings] = useState<Record<number, WithholdingEntry[]>>({});
  
  const receivedAmounts = formState?.receivedAmounts || localReceivedAmounts;
  const withholdings = formState?.withholdings || localWithholdings;

  const updateReceivedAmounts = (updater: any) => {
    if (setFormState) {
      setFormState((prev: any) => ({
        ...prev,
        receivedAmounts: typeof updater === 'function' ? updater(prev.receivedAmounts || {}) : updater
      }));
    } else {
      setLocalReceivedAmounts(updater);
    }
  };

  const updateWithholdings = (updater: any) => {
    if (setFormState) {
      setFormState((prev: any) => ({
        ...prev,
        withholdings: typeof updater === 'function' ? updater(prev.withholdings || {}) : updater
      }));
    } else {
      setLocalWithholdings(updater);
    }
  };

  const [focusedInvoice, setFocusedInvoice] = useState<number | null>(null);
  const [editingWithholdingsFor, setEditingWithholdingsFor] = useState<number | null>(null);

  const getInvoiceWithholdingsTotal = (invoiceId: number) => {
    if (!withholdings[invoiceId]) return 0;
    return withholdings[invoiceId].reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0);
  };

  const getEffectivePendingAmount = (inv: any) => {
    const pending = Number(inv.pending_amount || 0);
    const withh = getInvoiceWithholdingsTotal(inv.id);
    return Math.max(0, pending - withh);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, invoiceId: number, maxAmount: number) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) {
      updateReceivedAmounts((prev: any) => ({ ...prev, [invoiceId]: '' }));
      return;
    }
    
    let numValue = parseInt(rawValue, 10);
    if (numValue > maxAmount) {
      showToast("El monto excede el saldo pendiente menos retenciones.", "warning", "Advertencia");
      numValue = maxAmount;
    }
    
    updateReceivedAmounts((prev: any) => ({
      ...prev,
      [invoiceId]: numValue.toLocaleString('es-CO')
    }));
  };

  const renderDueDate = (dateStr: string | null) => {
    const d = parseDateSafe(dateStr);
    if (!d) return '-';
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const isExpired = d < today;
    
    return (
      <span className={cn(isExpired && "text-red-500 font-medium")}>
        {d.toLocaleDateString('es-ES', { timeZone: 'UTC' })}
      </span>
    );
  };

  useEffect(() => {
    if (!contactId) {
      setInvoices([]);
      return;
    }

    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const res = await InvoicesService.list({ customer_id: contactId });
        let fetchedInvoices: InvoiceSummary[] = [];
        if (res?.data?.invoices) {
          fetchedInvoices = res.data.invoices;
        } else if ((res as any)?.invoices) {
          fetchedInvoices = (res as any).invoices;
        } else if ((res as any)?.data?.data) { 
          fetchedInvoices = (res as any).data.data;
        } else if (Array.isArray(res)) {
          fetchedInvoices = res;
        }
        
        const invoicesWithPendingAmount = fetchedInvoices.filter(inv => {
          const pending = Number(inv.pending_amount) || 0;
          return pending > 0;
        });
        
        setInvoices(invoicesWithPendingAmount);
      } catch (err) {
        console.error("Error fetching invoices for contact", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [contactId]);

  if (!contactId) {
    return (
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-center gap-3">
        <Info className="w-5 h-5 text-indigo-500" />
        <span className="text-sm text-indigo-900">
          Selecciona un cliente para traer sus facturas por cobrar.
        </span>
      </div>
    );
  }

  if (!loading && invoices.length === 0) {
    return (
      <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-lg p-4 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-[#B45309]" />
        <span className="text-sm text-slate-700">
          El cliente seleccionado no tiene facturas pendientes de cobro.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-foreground">Facturas por cobrar</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Agrega el monto recibido a las facturas relacionadas con este ingreso.
        </p>
      </div>

      <div className="border border-border rounded-lg bg-white overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="font-medium text-muted-foreground w-[15%] relative after:absolute after:right-0 after:top-1/4 after:bottom-1/4 after:w-px after:bg-border">Número</TableHead>
              <TableHead className="font-medium text-muted-foreground w-[15%] relative after:absolute after:right-0 after:top-1/4 after:bottom-1/4 after:w-px after:bg-border">Vencimiento</TableHead>
              <TableHead className="font-medium text-muted-foreground w-[15%] text-center relative after:absolute after:right-0 after:top-1/4 after:bottom-1/4 after:w-px after:bg-border">Total</TableHead>
              <TableHead className="font-medium text-muted-foreground w-[20%] text-center relative after:absolute after:right-0 after:top-1/4 after:bottom-1/4 after:w-px after:bg-border">Retenciones</TableHead>
              <TableHead className="font-medium text-muted-foreground w-[15%] text-center relative after:absolute after:right-0 after:top-1/4 after:bottom-1/4 after:w-px after:bg-border">Por cobrar</TableHead>
              <TableHead className="font-medium text-muted-foreground w-[20%] text-center">Monto recibido</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-slate-500">Cargando facturas pendientes de cobro.</span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv, index) => (
                <TableRow key={inv.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium">
                    <Link 
                      href={`/invoices/${inv.id}`} 
                      target="_blank" 
                      className="text-muted-foreground hover:bg-slate-100 hover:text-slate-900 px-2 py-1 rounded -ml-2 transition-colors cursor-pointer inline-block"
                    >
                      {inv.number}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {renderDueDate(inv.payment_due_date)}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    $ {inv.total ? parseFloat(inv.total).toLocaleString('es-CO') : '0'}
                  </TableCell>
                  <TableCell className="bg-slate-50/30">
                    <div className="flex items-center justify-center">
                      <div className="group flex items-center w-full max-w-[120px] rounded-md border border-gray-300 bg-slate-50 hover:border-primary focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-colors">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <input 
                            type="text" 
                            className="w-full h-9 pl-7 pr-2 text-sm bg-transparent outline-none cursor-default"
                            readOnly
                            value={withholdings[inv.id] ? withholdings[inv.id].reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0).toLocaleString('es-CO') : '0'}
                          />
                        </div>
                        <button 
                          onClick={() => setEditingWithholdingsFor(inv.id)}
                          className="h-9 px-2 border-l border-gray-300 group-hover:border-primary group-focus-within:border-primary text-muted-foreground hover:text-foreground hover:bg-gray-100 cursor-pointer flex items-center justify-center transition-colors"
                        >
                          <PenLine className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    $ {getEffectivePendingAmount(inv).toLocaleString('es-CO')}
                  </TableCell>
                  <TableCell className="relative">
                    <div className="flex items-center justify-center relative">
                      <Popover open={focusedInvoice === inv.id && !formErrors?.amounts}>
                        <PopoverAnchor asChild>
                          <div className="relative w-full max-w-[120px]">
                            <span className={cn("absolute left-3 top-1/2 -translate-y-1/2", formErrors?.amounts ? "text-[#ef4444]" : "text-muted-foreground")}>$</span>
                            <input 
                              type="text" 
                              className={cn(
                                "w-full h-9 pl-7 text-sm rounded-md border bg-white transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                                formErrors?.amounts ? "border-[#ef4444] text-[#ef4444] pr-8" : "border-gray-300 pr-3",
                                focusedInvoice === inv.id ? "border-primary ring-1 ring-primary" : ""
                              )}
                              value={receivedAmounts[inv.id] || ''}
                              onChange={(e) => handleAmountChange(e, inv.id, getEffectivePendingAmount(inv))}
                              onFocus={() => {
                                setFocusedInvoice(inv.id);
                                const max = getEffectivePendingAmount(inv);
                                updateReceivedAmounts((prev: any) => ({
                                  ...prev,
                                  [inv.id]: max.toLocaleString('es-CO')
                                }));
                              }}
                              onBlur={() => setFocusedInvoice(null)}
                            />
                            {formErrors?.amounts && (
                              <AlertCircle className="w-4 h-4 text-[#ef4444] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            )}
                            {formErrors?.amounts && index === 0 && (
                              <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-[#1C2433] text-white p-3 rounded-md shadow-lg z-50 text-[13px] font-medium leading-tight whitespace-nowrap min-w-[320px] text-center after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-[#1C2433]">
                                Debes asignar un monto a al menos una factura o nota<br/>débito para crear el pago
                              </div>
                            )}
                          </div>
                        </PopoverAnchor>
                        <PopoverContent 
                          side="bottom"
                          sideOffset={4}
                          className="w-[120px] p-2 bg-white border border-border rounded-md shadow-lg text-center cursor-pointer hover:bg-slate-50 transition-colors z-50"
                          onOpenAutoFocus={(e) => e.preventDefault()}
                          onCloseAutoFocus={(e) => e.preventDefault()}
                          onPointerDown={(e) => {
                            e.preventDefault();
                            const max = getEffectivePendingAmount(inv);
                            updateReceivedAmounts((prev: any) => ({
                              ...prev,
                              [inv.id]: max.toLocaleString('es-CO')
                            }));
                            setFocusedInvoice(null);
                          }}
                        >
                          <div className="font-bold text-slate-800 text-[15px]">${getEffectivePendingAmount(inv).toLocaleString('es-CO')}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5 leading-tight">Restante por pagar</div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {!loading && invoices.length > 0 && (
          <div className="p-3 border-t border-border flex items-center justify-end gap-2 text-sm text-muted-foreground">
            1-{invoices.length} de {invoices.length}
            <div className="flex gap-1 ml-4">
              <button disabled className="p-1 opacity-50 cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
              <button disabled className="p-1 opacity-50 cursor-not-allowed"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      <WithholdingsModal
        isOpen={editingWithholdingsFor !== null}
        onClose={() => setEditingWithholdingsFor(null)}
        invoice={invoices.find(inv => inv.id === editingWithholdingsFor) || null}
        initialWithholdings={editingWithholdingsFor ? (withholdings[editingWithholdingsFor] || []) : []}
        onSave={(newWithholdings) => {
          if (editingWithholdingsFor) {
            updateWithholdings((prev: any) => ({
              ...prev,
              [editingWithholdingsFor]: newWithholdings
            }));
            
            const inv = invoices.find(i => i.id === editingWithholdingsFor);
            if (inv) {
              const newWithhTotal = newWithholdings.reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0);
              const newMax = Math.max(0, Number(inv.pending_amount || 0) - newWithhTotal);
              updateReceivedAmounts((prev: any) => {
                if (prev[inv.id]) {
                  return { ...prev, [inv.id]: newMax.toLocaleString('es-CO') };
                }
                return prev;
              });
            }
          }
        }}
      />
    </div>
  );
}
