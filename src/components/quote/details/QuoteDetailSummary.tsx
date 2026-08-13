interface QuoteDetailSummaryProps {
    quote: any;
}

export function QuoteDetailSummary({ quote }: QuoteDetailSummaryProps) {
    const total = Number(quote.total || quote.payable_amount || 0);
    const totalDescuentos = Number(quote.discount_amount || quote.discount_total || 0);
    const totalImpuestos = Number(quote.tax_amount || quote.tax_total || 0);
    const subtotal = Number(quote.subtotal || quote.line_extension_amount || 0);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-wrap gap-8 items-center justify-between">
            <div>
                <div className="text-slate-500 mb-1">Subtotal</div>
                <div className="text-xl font-semibold">$ {subtotal.toLocaleString()}</div>
            </div>
            <div>
                <div className="text-slate-500 mb-1">Descuentos</div>
                <div className="text-xl font-semibold text-red-500">-$ {totalDescuentos.toLocaleString()}</div>
            </div>
            <div>
                <div className="text-slate-500 mb-1">Impuestos</div>
                <div className="text-xl font-semibold text-slate-700">$ {totalImpuestos.toLocaleString()}</div>
            </div>
            <div>
                <div className="text-slate-500 mb-1">Valor total</div>
                <div className="text-xl font-semibold text-primary">$ {total.toLocaleString()}</div>
            </div>
        </div>
    );
}
