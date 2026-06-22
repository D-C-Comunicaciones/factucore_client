interface InvoiceDetailSummaryProps {
    bill: any;
}

export function InvoiceDetailSummary({ bill }: InvoiceDetailSummaryProps) {
    const total = Number(bill.total || bill.payable_amount || 0);
    const pendingAmount = bill.pending_to_collect !== undefined
        ? Number(bill.pending_to_collect)
        : (bill.pending_amount !== undefined
            ? Number(bill.pending_amount)
            : Number(bill.payable_amount || bill.total || 0));
    const cobrado = bill.collected !== undefined
        ? Number(bill.collected)
        : Math.max(0, total - pendingAmount);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-wrap gap-8 items-center justify-between">
            <div>
                <div className="text-slate-500 mb-1">Valor total</div>
                <div className="text-xl font-semibold">$ {total.toLocaleString()}</div>
            </div>
            <div>
                <div className="text-slate-500 mb-1">Retenido</div>
                <div className="text-xl font-semibold text-red-500">$ 0</div>
            </div>
            <div>
                <div className="text-slate-500 mb-1">Cobrado</div>
                <div className="text-xl font-semibold text-green-600">$ {cobrado.toLocaleString()}</div>
            </div>
            <div>
                <div className="text-slate-500 mb-1">Por cobrar</div>
                <div className="text-xl font-semibold text-red-500">$ {pendingAmount.toLocaleString()}</div>
            </div>
        </div>
    );
}
