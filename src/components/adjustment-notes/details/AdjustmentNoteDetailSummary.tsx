interface AdjustmentNoteDetailSummaryProps {
    note: any;
}

export function AdjustmentNoteDetailSummary({ note }: AdjustmentNoteDetailSummaryProps) {
    const subtotal = Number(note?.subtotal || 0);
    const taxTotal = Number(note?.tax_total || 0);
    const total = Number(note?.payable_amount || note?.total || 0);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-wrap gap-8 items-center justify-between">
            <div>
                <div className="text-slate-500 mb-1">Subtotal</div>
                <div className="text-xl font-semibold">$ {subtotal.toLocaleString()}</div>
            </div>
            <div>
                <div className="text-slate-500 mb-1">Impuestos</div>
                <div className="text-xl font-semibold text-slate-700">$ {taxTotal.toLocaleString()}</div>
            </div>
            <div>
                <div className="text-slate-500 mb-1">Total nota de ajuste</div>
                <div className="text-xl font-semibold text-primary">$ {total.toLocaleString()}</div>
            </div>
        </div>
    );
}
