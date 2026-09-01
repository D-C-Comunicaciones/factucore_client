interface SupportDocumentDetailSummaryProps {
    doc: any;
}

export function SupportDocumentDetailSummary({ doc }: SupportDocumentDetailSummaryProps) {
    const total = Number(doc.payable_amount || 0);
    const withheld = Number(doc.withholding_total || 0);
    const paid = Number(doc.paid_amount || 0);
    const balance = Number(doc.balance ?? Math.max(0, total - paid));

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-wrap gap-8 items-center justify-between">
            <div>
                <div className="text-slate-500 mb-1">Valor total</div>
                <div className="text-xl font-semibold">$ {total.toLocaleString()}</div>
            </div>
            <div>
                <div className="text-slate-500 mb-1">Retenido</div>
                <div className="text-xl font-semibold text-red-500">$ {withheld.toLocaleString()}</div>
            </div>
            <div>
                <div className="text-slate-500 mb-1">Pagado</div>
                <div className="text-xl font-semibold text-green-600">$ {paid.toLocaleString()}</div>
            </div>
            <div>
                <div className="text-slate-500 mb-1">Por pagar</div>
                <div className="text-xl font-semibold text-red-500">$ {balance.toLocaleString()}</div>
            </div>
        </div>
    );
}
