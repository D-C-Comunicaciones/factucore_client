import Link from "next/link";
import { CompanyHeaderPdfStyle } from "@/components/shared/CompanyHeaderPdfStyle";
import { FactucoreLogo } from "@/components/brand/FactucoreLogo";
import { StatusBadge } from "@/components/quote/table/columns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface QuoteDetailDocumentProps {
    quote: any;
    company: any;
    customer: any;
    items: any[];
}

export function QuoteDetailDocument({
    quote,
    company,
    customer,
    items
}: QuoteDetailDocumentProps) {
    const getNestedValue = (obj: any, key: string) => obj?.[key] ?? obj?.legal_monetary_total?.[key] ?? 0;

    const finalSubtotal = Number(getNestedValue(quote, 'line_extension_amount') || quote.subtotal || 0);
    const finalTotal = Number(getNestedValue(quote, 'payable_amount') || quote.total || 0);

    const allDiscounts = quote.global_discounts || quote.discounts || quote.allowance_charges?.filter((ac: any) => ac.charge_indicator === false) || [];
    const allCharges = quote.global_charges || quote.charges || quote.allowance_charges?.filter((ac: any) => ac.charge_indicator === true) || [];

    const globalDiscounts = allDiscounts.filter((d: any) => d.scope === 'global' || !d.line_id);
    const globalCharges = allCharges.filter((c: any) => c.scope === 'global' || !c.line_id);

    const lineDiscountsTotal = items.reduce((sum: number, item: any) => {
        const itemDiscounts = item.discounts || item.allowance_charges?.filter((ac: any) => ac.charge_indicator === false) || [];
        return sum + itemDiscounts.reduce((dSum: number, d: any) => dSum + Number(d.calculated_amount ?? d.amount ?? d.value ?? 0), 0);
    }, 0);

    const globalDiscountsTotal = globalDiscounts.reduce((sum: number, d: any) => sum + Number(d.calculated_amount ?? d.amount ?? d.value ?? 0), 0);
    const globalChargesTotal = globalCharges.reduce((sum: number, c: any) => sum + Number(c.calculated_amount || c.amount || c.value || 0), 0);

    const grossSubtotal = finalSubtotal + lineDiscountsTotal;

    const taxAmountTotal = items.reduce((sum: number, item: any) => {
        const itemTaxes = item.taxes || item.tax_totals || [];
        return sum + itemTaxes.reduce((tSum: number, t: any) => tSum + Number(t.tax_amount || 0), 0);
    }, 0);
    const finalTaxes = Number(getNestedValue(quote, 'tax_total') || getNestedValue(quote, 'tax_totals') || quote.tax_amount || taxAmountTotal);

    // Resuelve cada línea una sola vez para que la tabla (desktop) y las
    // tarjetas (móvil) lean exactamente los mismos valores.
    const resolvedLines = items.map((item: any, idx: number) => {
        const itemName = item.name || item.item_name || item.item?.name || item.description;
        const itemId = item.item_id || item.id || item.item?.id;
        const itemRef = item.code_reference || item.item_code || item.standard_item_code || item.code;
        const itemPrice = item.price || item.price_amount;
        const itemQty = item.quantity;
        const itemTotal = item.total || item.total_line || item.line_extension_amount;
        const taxRate = item.tax_rate || (item.tax_totals?.[0]?.percent) || (item.taxes?.[0]?.percent) || 0;

        const taxName =
            item.tax_name ||
            item.tax_totals?.[0]?.tax_name || item.tax_totals?.[0]?.name ||
            item.taxes?.[0]?.name ||
            item.taxes?.[0]?.tax?.name ||
            'IVA';

        const discountAmount = item.discounts?.length
            ? item.discounts.reduce((sum: number, d: any) => sum + Number(d.calculated_amount ?? d.amount ?? d.value ?? 0), 0)
            : item.allowance_charges?.filter((ac: any) => ac.charge_indicator === false)?.reduce((sum: number, ac: any) => sum + Number(ac.amount || ac.value || 0), 0)
            || Number(item.discount_amount || 0);

        const totalGross = Number(itemPrice || 0) * Number(itemQty || 1);
        let discountPercent = 0;
        if (item.discounts?.length > 0 && item.discounts[0].percent) {
            discountPercent = Number(item.discounts[0].percent);
        } else if (discountAmount > 0 && totalGross > 0) {
            discountPercent = (discountAmount / totalGross) * 100;
        }

        const taxAmount = item.taxes?.length
            ? item.taxes.reduce((sum: number, t: any) => sum + Number(t.tax_amount || 0), 0)
            : item.tax_totals?.length
                ? item.tax_totals.reduce((sum: number, t: any) => sum + Number(t.tax_amount || 0), 0)
                : Number(item.tax_amount || 0);

        const itemLabel = itemRef ? `${itemName} - ${itemRef}` : itemName;
        const taxLabel = taxName.includes('%') ? taxName : `${taxName} ${Number(taxRate)}%`;

        return {
            key: idx,
            itemId,
            itemLabel,
            description: item.description || '',
            itemQty: Number(itemQty || 0),
            itemPrice: Number(itemPrice || 0),
            itemTotal: Number(itemTotal || 0),
            taxRate: Number(taxRate || 0),
            taxAmount,
            taxLabel,
            discountAmount,
            discountPercent,
        };
    });

    return (
        <div className="filter drop-shadow-sm">
            <div
                className="bg-white rounded-lg border border-slate-200 relative overflow-hidden"
                style={{
                    clipPath: 'polygon(0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 0 100%)'
                }}
            >
                {/* Folded Corner Effect */}
                <div
                    className="absolute top-0 right-0 w-10 h-10 pointer-events-none"
                    style={{
                        filter: 'drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.08))'
                    }}
                >
                    <div
                        className="w-full h-full bg-gradient-to-bl from-slate-200 via-slate-100 to-white border-l border-b border-slate-200/80"
                        style={{
                            clipPath: 'polygon(0 0, 0 100%, 100% 100%)'
                        }}
                    />
                </div>

                <div className="p-5 sm:p-8 md:p-10">
                    {/* Doc Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 mb-10 border-b pb-8 border-slate-100 text-center md:text-left">
                        {/* Logo */}
                        <div className="w-full md:w-1/3 md:pl-8 flex justify-center md:justify-start">
                            <div className="w-64 h-24 relative flex items-center justify-center md:justify-start">
                                <FactucoreLogo
                                    variant="icon"
                                    alt="Logo de empresa"
                                    className="w-full h-full object-contain md:object-left"
                                />
                            </div>
                        </div>

                        {/* Empresa (Centro) */}
                        <div className="w-full md:w-1/3 md:pt-2 flex flex-col justify-center items-center md:items-stretch">
                            <CompanyHeaderPdfStyle companyProp={company} />
                        </div>

                        {/* Cotización No & Estado (Derecha) */}
                        <div className="w-full md:w-1/3 flex flex-col items-center md:items-end md:pt-2">
                            <div className="text-slate-500 text-xl font-light text-primary">
                                Cotización No. <span className="font-semibold">{quote.prefix || ''}{quote.number || quote.id}</span>
                            </div>
                            <div className="mt-2 flex items-center justify-center md:justify-end gap-2 uppercase">
                                <span className="text-xs text-slate-400">Estado:</span>
                                <StatusBadge status={quote.quotation_status || quote.status} />
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-10 text-slate-600">
                        <h3 className="font-bold text-slate-800 mb-4">Información de la cotización</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <div className="font-bold text-slate-700 mb-1">Cliente</div>
                                <Link href={`/contacts/${customer?.id || quote?.contact_id || ''}`} className="font-medium text-slate-800 underline cursor-pointer hover:bg-slate-100 px-2 py-1 rounded -ml-2 transition-colors inline-block w-fit">
                                    {customer?.names || customer?.company || customer?.name || customer?.registration_name || ''}
                                </Link>
                            </div>
                            <div>
                                <div className="font-bold text-slate-700 mb-1">Identificación</div>
                                <span>
                                    {customer?.identification || customer?.company_id || customer?.identification_number || ''}
                                    {(() => {
                                        const dv = customer?.verification_digit ?? quote?.contact?.verification_digit;
                                        return dv != null ? `-${dv}` : '';
                                    })()}
                                </span>
                            </div>
                            <div>
                                <div className="font-bold text-slate-700 mb-1">Fecha de creación</div>
                                <span>{quote.created_at || ''}</span>
                            </div>
                            <div>
                                <div className="font-bold text-slate-700 mb-1">Fecha de vencimiento</div>
                                <span>{quote.payment_due_date || quote.expiration_date || quote.created_at || ''}</span>
                            </div>
                        </div>
                    </div>

                    {/* Items — tarjetas en móvil */}
                    <h3 className="font-bold text-slate-800 mb-4">Productos y servicios</h3>
                    <div className="mb-10 md:hidden border border-gray-200 rounded-lg divide-y divide-gray-200 overflow-hidden">
                        {resolvedLines.length === 0 ? (
                            <div className="h-24 flex items-center justify-center text-center text-slate-400 text-sm">
                                No hay productos en esta cotización
                            </div>
                        ) : (
                            resolvedLines.map((line) => (
                                <div key={line.key} className="p-4 bg-white">
                                    <div className="flex items-start justify-between gap-3">
                                        {line.itemId ? (
                                            <Link href={`/items/${line.itemId}`} className="text-slate-800 font-medium text-sm">
                                                {line.itemLabel}
                                            </Link>
                                        ) : (
                                            <span className="text-slate-800 font-medium text-sm">{line.itemLabel}</span>
                                        )}
                                        <span className="text-sm font-semibold text-slate-900 shrink-0">
                                            $ {line.itemTotal.toLocaleString()}
                                        </span>
                                    </div>
                                    {line.description && (
                                        <div className="text-xs text-slate-500 mt-1">{line.description}</div>
                                    )}
                                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                                        <div>
                                            <div className="text-slate-400">Precio</div>
                                            <div className="text-slate-700 font-medium">$ {line.itemPrice.toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-slate-400">Cantidad</div>
                                            <div className="text-slate-700 font-medium">{line.itemQty}</div>
                                        </div>
                                        <div>
                                            <div className="text-slate-400">Descuento</div>
                                            <div className="text-slate-700 font-medium">
                                                {line.discountAmount > 0
                                                    ? `${line.discountPercent % 1 !== 0 ? line.discountPercent.toFixed(2) : line.discountPercent}%`
                                                    : '-'}
                                            </div>
                                        </div>
                                    </div>
                                    {(line.taxRate > 0 || line.taxAmount > 0) && (
                                        <div className="mt-2 text-xs text-slate-500">
                                            {line.taxLabel} (${line.taxAmount.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Items Table — sm y superior */}
                    <div className="mb-10 relative overflow-x-auto border-b border-gray-200 hidden md:block">
                        <Table className="[&_td]:border-b-0">
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead className="text-slate-900 uppercase font-bold border-l border-gray-200">PRODUCTO O SERVICIOS</TableHead>
                                    <TableHead className="text-slate-900 uppercase font-bold text-center">CANTIDAD</TableHead>
                                    <TableHead className="text-slate-900 uppercase font-bold text-right">PRECIO</TableHead>
                                    <TableHead className="text-slate-900 uppercase font-bold text-right">DESCUENTO</TableHead>
                                    <TableHead className="text-slate-900 uppercase font-bold text-right">IMPUESTO</TableHead>
                                    <TableHead className="text-slate-900 uppercase font-bold text-right border-r border-gray-200">SUBTOTAL</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {resolvedLines.map((line) => (
                                    <TableRow key={line.key} className="hover:bg-transparent border-0 border-b-0">
                                        <TableCell className="border-l border-gray-200">
                                            <div className="flex flex-col pl-2">
                                                {line.itemId ? (
                                                    <Link href={`/items/${line.itemId}`} className="text-slate-800 font-medium cursor-pointer hover:bg-slate-200 px-2 py-1 -ml-2 rounded transition-colors inline-block w-fit">
                                                        {line.itemLabel}
                                                    </Link>
                                                ) : (
                                                    <span className="text-slate-800 font-medium">{line.itemLabel}</span>
                                                )}
                                                {line.description && (
                                                    <span className="text-slate-500 text-xs">{line.description}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">{line.itemQty}</TableCell>
                                        <TableCell className="text-right">$ {line.itemPrice.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            {line.discountAmount > 0 ? (
                                                <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                                                    <span>{line.discountPercent % 1 !== 0 ? line.discountPercent.toFixed(2) : line.discountPercent}%</span>
                                                    <span className="text-slate-500 text-xs">
                                                        (${line.discountAmount.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {line.taxRate > 0 || line.taxAmount > 0 ? (
                                                <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                                                    <span>{line.taxLabel}</span>
                                                    <span className="text-slate-500 text-xs">
                                                        (${line.taxAmount.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right border-r border-gray-200">$ {line.itemTotal.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                                {resolvedLines.length === 0 && (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={6} className="h-24 text-center text-slate-400 border-l border-r border-gray-200">No hay productos en esta cotización</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Adjustments and Subtotals */}
                    <div className="flex justify-end text-slate-600 border-t border-slate-100 pt-8">
                        <div className="w-full sm:w-1/2 md:w-1/3 space-y-6 text-right flex flex-col justify-end">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span>$ {grossSubtotal.toLocaleString()}</span>
                                </div>
                                {lineDiscountsTotal > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Descuentos en línea</span>
                                        <span className="text-red-500">-$ {lineDiscountsTotal.toLocaleString()}</span>
                                    </div>
                                )}
                                {globalDiscountsTotal > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Descuentos Globales</span>
                                        <span className="text-red-500">-$ {globalDiscountsTotal.toLocaleString()}</span>
                                    </div>
                                )}
                                {globalChargesTotal > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Cargos Globales</span>
                                        <span>$ {globalChargesTotal.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Impuestos</span>
                                    <span>$ {finalTaxes.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-slate-800 pt-3 border-t border-slate-200">
                                    <span className="text-xl font-normal text-slate-600">Total</span>
                                    <span className="text-2xl">$ {finalTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info and Notes */}
                    <div className="flex flex-col md:flex-row justify-between mt-16 text-sm text-slate-600 gap-8 md:gap-12">
                        <div className="w-full md:w-1/2 space-y-10">
                            {/* Elaborado por */}
                            <div className="flex flex-col items-center">
                                <div className="mb-2">
                                    <span
                                        className="text-slate-700"
                                        style={{
                                            fontFamily: '"Great Vibes", cursive',
                                            fontSize: '30px'
                                        }}
                                    >
                                        {quote.user?.name || 'Administrador'}
                                    </span>
                                </div>
                                <div className="w-3/4 border-t border-slate-300 text-center pt-2 text-[10px] uppercase text-slate-400">
                                    ELABORADO POR
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 space-y-4">
                            <div>
                                <h3 className="text-black font-bold mb-2 text-xs uppercase">Notas:</h3>
                                <div className="bg-gray-50 rounded-md p-3 text-xs text-black leading-relaxed min-h-[60px] border border-gray-200 whitespace-pre-wrap">
                                    {quote.notes || quote.observation || '—'}
                                </div>
                            </div>

                            {/* Términos y condiciones */}
                            <div>
                                <h3 className="text-black font-bold mb-2 text-xs uppercase">Términos y condiciones:</h3>
                                <div className="bg-gray-50 rounded-md p-3 text-xs text-black leading-relaxed min-h-[60px] border border-gray-200 whitespace-pre-wrap">
                                    {quote.terms_and_conditions || '—'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
