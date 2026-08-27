import { formatCurrency } from "@/utils/format-currency";

interface DebitNoteDetailSummaryProps {
    debitNote: any;
}

export function DebitNoteDetailSummary({ debitNote }: DebitNoteDetailSummaryProps) {
    const total = Number(debitNote?.total || debitNote?.payable_amount || 0);
    const invoiceTotal = Number(debitNote?.invoice?.total || 0);

    // Aplicado = min(debit_note.total, invoice.total)
    const applied = Math.min(total, invoiceTotal || total);

    // Nuevo total de la factura = invoice.total + Aplicado
    const invoiceNewTotal = invoiceTotal + applied;

    const currencyId = debitNote?.currency_id || debitNote?.invoice?.type_currency_id || 35;
    const currencyCode = currencyId === 35 ? 'COP' : 'USD';

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-5 flex flex-col justify-center">
                <p className="text-[13px] font-medium text-slate-500 mb-1">Total nota débito</p>
                <p className="text-2xl font-semibold text-[#0F2843]">
                    {formatCurrency(total, currencyCode)}
                </p>
            </div>

            <div className="p-5 flex flex-col justify-center">
                <p className="text-[13px] font-medium text-slate-500 mb-1">Aplicado a la factura</p>
                <p className="text-2xl font-semibold text-[#0F2843]">
                    {formatCurrency(applied, currencyCode)}
                </p>
            </div>

            <div className="p-5 flex flex-col justify-center">
                <p className="text-[13px] font-medium text-slate-500 mb-1">Nuevo total de la factura</p>
                <p className="text-2xl font-semibold text-[#0F2843]">
                    {formatCurrency(invoiceNewTotal, currencyCode)}
                </p>
            </div>
        </div>
    );
}
