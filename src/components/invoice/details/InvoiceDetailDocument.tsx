import { DianStatusBadge } from "@/components/invoice/table/columns";
import Link from "next/link";
import { CompanyHeaderPdfStyle } from "@/components/shared/CompanyHeaderPdfStyle";
import { FactucoreLogo } from "@/components/brand/FactucoreLogo";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface InvoiceDetailDocumentProps {
    bill: any;
    company: any;
    customer: any;
    items: any[];
    dianStatus: string;
}

export function InvoiceDetailDocument({
    bill,
    company,
    customer,
    items,
    dianStatus
}: InvoiceDetailDocumentProps) {
    const pendingAmount = bill.pending_to_collect !== undefined
        ? Number(bill.pending_to_collect)
        : (bill.pending_amount !== undefined
            ? Number(bill.pending_amount)
            : Number(bill.payable_amount || bill.total || 0));
    // La retención es dinero que el cliente nunca paga en efectivo/transferencia:
    // si lo que falta por cobrar coincide con lo retenido, la factura ya quedó
    // saldada aunque `pendingAmount` (por cobrar - cobrado) no sea exactamente 0.
    const withholdingsTotal = Number(bill.withholdings_total || 0);
    const isCobrada = bill.is_paid || (pendingAmount - withholdingsTotal) <= 0.01;
    const isAccepted = ["ACEPTADA", "PROCESADO CORRECTAMENTE", "APROBADA", "AUTORIZADA"].includes((dianStatus || '').toUpperCase());

    const getNestedValue = (obj: any, key: string) => obj?.[key] ?? obj?.legal_monetary_total?.[key] ?? 0;

    const finalSubtotal = Number(getNestedValue(bill, 'line_extension_amount') || bill.subtotal || 0);
    const finalDiscount = Number(getNestedValue(bill, 'discount_total') || bill.discount_amount || 0);
    const finalTaxes = Number(getNestedValue(bill, 'tax_total') || getNestedValue(bill, 'tax_totals') || bill.tax_amount || 0);
    const finalTotal = Number(getNestedValue(bill, 'payable_amount') || bill.total || 0);
    const finalWithholdings = Number(getNestedValue(bill, 'withholdings_total') || 0);

    const allDiscounts = bill.discounts || bill.invoice_snapshot?.template_data?.invoice?.discounts || [];
    const allCharges = bill.charges || bill.invoice_snapshot?.template_data?.invoice?.charges || [];

    const globalDiscounts = allDiscounts.filter((d: any) => String(d.charge_indicator) !== "true");

    // Sumamos los descuentos de línea recorriendo los items, o usamos el fallback si es un formato antiguo
    const lineDiscountsTotal = items.reduce((sum: number, item: any) => {
        const itemDiscounts = item.discounts || [];
        return sum + itemDiscounts.reduce((dSum: number, d: any) => dSum + Number(d.amount), 0);
    }, 0) + (bill.invoice_snapshot?.template_data?.invoice?.discounts || []).filter((d: any) => d.invoice_line_id && String(d.charge_indicator) !== "true").reduce((sum: number, d: any) => sum + Number(d.amount), 0);

    const globalCharges = allCharges.filter((c: any) => c.scope === 'global' || !c.line_id);
    const globalDiscountsTotal = globalDiscounts.reduce((sum: number, d: any) => sum + Number(d.amount), 0);
    const globalChargesTotal = globalCharges.reduce((sum: number, c: any) => sum + Number(c.calculated_amount || c.amount || c.value || 0), 0);

    const grossSubtotal = finalSubtotal + lineDiscountsTotal;

    const withholdingsList = bill.withholdings_totals || bill.withholdings || bill.invoice_withholdings || bill.invoice_snapshot?.template_data?.invoice?.withholdings || [];
    const groupedWithholdings = withholdingsList.reduce((acc: any, w: any) => {
        const name = w.name || w.withholding_rate?.name || w.tax?.name || w.type_tax?.name || w.tax_name || w.type?.name || 'Retención';
        const percent = Number(w.percent || w.percentage || w.tax_percent || w.withholding_rate?.rate || 0);
        const amount = Number(w.withholding_amount || w.amount || w.tax_amount || w.value || 0);
        const key = `${name}-${percent}`;

        if (!acc[key]) {
            acc[key] = { name, percent, amount: 0 };
        }
        acc[key].amount += amount;
        return acc;
    }, {});
    const withholdingsArray = Object.values(groupedWithholdings);

    // Resuelve cada línea una sola vez (soporta tanto item de BD como item del
    // snapshot XML) para que la tabla (desktop) y las tarjetas (móvil) lean
    // exactamente los mismos valores sin duplicar la lógica de fallback.
    const resolvedLines = items.map((item: any, idx: number) => {
        const itemName = item.name || item.item_name || item.item?.name || item.description;
        const itemId = item.item_id || item.id || item.item?.id;
        const itemRef = item.code_reference || item.item_code || item.standard_item_code || item.code;
        const itemPrice = item.price || item.price_amount;
        const itemQty = item.quantity;
        const itemTotal = item.total || item.total_line || item.line_extension_amount;
        const taxRate = item.tax_rate || (item.tax_totals?.[0]?.percent) || (item.taxes?.[0]?.percent) || 0;
        const lineTaxCode = item.tax_totals?.[0]?.tax_code || item.taxes?.[0]?.tax_code || '';
        const snapshotTaxTotals = bill.invoice_snapshot?.template_data?.taxTotals || [];
        const snapshotLineTaxes = bill.invoice_snapshot?.template_data?.lines?.find(
            (_: any, i: number) => i === idx
        )?.tax_totals || [];
        const taxName =
            item.tax_name ||
            item.tax_totals?.[0]?.tax_name || item.tax_totals?.[0]?.name ||
            item.taxes?.[0]?.name ||
            item.taxes?.[0]?.tax?.name ||
            snapshotLineTaxes.find((t: any) => t.tax_code === lineTaxCode)?.tax_name ||
            snapshotTaxTotals.find((t: any) => t.tax_code === lineTaxCode)?.tax_name ||
            '';
        const taxNameStr = taxName || 'IVA';

        const discountAmount = item.discounts?.length
            ? item.discounts.reduce((sum: number, d: any) => sum + Number(d.amount || 0), 0)
            : Number(item.discount_amount || 0);

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

        return {
            key: idx,
            itemName,
            itemId,
            itemRef,
            itemPrice: Number(itemPrice || 0),
            itemQty: Number(itemQty || 0),
            itemTotal: Number(itemTotal || 0),
            taxRate: Number(taxRate || 0),
            taxNameStr,
            taxAmount,
            discountAmount,
            discountPercent,
            description: item.description || '',
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
                {/* Status ribbon */}
                <div className={`absolute top-6 -left-12 w-48 text-center text-white text-[11px] uppercase tracking-wide font-bold py-1.5 transform -rotate-45 shadow-md ${!isAccepted ? 'bg-orange-500' : (isCobrada ? 'bg-green-500' : 'bg-red-500')}`}>
                    {!isAccepted ? 'NO FACTURADO' : (isCobrada ? 'COBRADA' : 'POR COBRAR')}
                </div>

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

                        {/* Factura No & DIAN (Derecha) */}
                        <div className="w-full md:w-1/3 flex flex-col items-center md:items-end md:pt-2">
                            <div className="text-slate-500 text-xl font-light text-primary">
                                No. <span className="font-semibold">{bill.prefix || ''}{bill.number || bill.id}</span>
                            </div>
                            <div className="mt-2 flex items-center justify-center md:justify-end gap-2 uppercase">
                                <span className="text-xs text-slate-400">Estado DIAN:</span>
                                <DianStatusBadge status={dianStatus || 'NO APROBADA'} />
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-slate-600">
                        <div className="space-y-2 border-b border-slate-100 pb-2">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-bold text-slate-700 sm:w-48 shrink-0">Cliente:</span>
                                <Link href={`/contacts/${customer?.id || bill?.contact_id || ''}`} className="font-medium text-slate-800 cursor-pointer hover:bg-slate-100 px-2 py-1 rounded sm:-ml-2 -ml-2 transition-colors self-start">
                                    {customer?.names || customer?.company || customer?.name || customer?.registration_name || ''}
                                </Link>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-bold text-slate-700 sm:w-48 shrink-0">
                                    {(() => {
                                        const orgCode = customer?.type_organization?.code || bill?.contact?.type_organization_id || customer?.type_organization_id;
                                        const isJuridica = String(orgCode) === "1";

                                        if (isJuridica) return "NIT";

                                        const docName = customer?.type_document_identification?.name || bill?.contact?.type_document_identification?.name;
                                        return docName || "Cédula de ciudadanía";
                                    })()}:
                                </span>
                                <span>
                                    {customer?.identification || customer?.company_id || customer?.identification_number || ''}
                                    {(() => {
                                        const dv = customer?.verification_digit ?? bill?.contact?.verification_digit;
                                        return dv != null ? `-${dv}` : '';
                                    })()}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-bold text-slate-700 sm:w-48 shrink-0">Teléfono:</span>
                                <span>{customer?.phone1 || customer?.phone || ''}</span>
                            </div>
                        </div>
                        <div className="space-y-2 border-b border-slate-100 pb-2">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-bold text-slate-700 sm:w-32 shrink-0">Creación:</span>
                                <span>{bill.created_at || ''}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-bold text-slate-700 sm:w-32 shrink-0">Vencimiento:</span>
                                <span>{bill.payment_due_date || bill.billing_reference?.payment_due_date || bill.created_at || ''}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-bold text-slate-700 sm:w-32 shrink-0">Plazo de pago:</span>
                                <span>{bill.payment_term?.name || 'De contado'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Items — tarjetas en móvil */}
                    <div className="mb-10 md:hidden border border-gray-200 rounded-lg divide-y divide-gray-200 overflow-hidden">
                        {resolvedLines.length === 0 ? (
                            <div className="h-24 flex items-center justify-center text-center text-slate-400 text-sm">
                                No hay productos en esta factura
                            </div>
                        ) : (
                            resolvedLines.map((line) => (
                                <div key={line.key} className="p-4 bg-white">
                                    <div className="flex items-start justify-between gap-3">
                                        {line.itemId ? (
                                            <Link href={`/items/${line.itemId}`} className="text-slate-800 font-medium text-sm">
                                                {line.itemName}
                                            </Link>
                                        ) : (
                                            <span className="text-slate-800 font-medium text-sm">{line.itemName}</span>
                                        )}
                                        <span className="text-sm font-semibold text-slate-900 shrink-0">
                                            $ {line.itemTotal.toLocaleString()}
                                        </span>
                                    </div>
                                    {line.itemRef && (
                                        <div className="text-xs text-slate-400 mt-0.5">Ref. {line.itemRef}</div>
                                    )}
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
                                            {line.taxNameStr} {line.taxRate}% (${line.taxAmount.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
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
                                    <TableHead className="text-slate-900 uppercase font-bold border-l border-gray-200">ITEM</TableHead>
                                    <TableHead className="text-slate-900 uppercase font-bold">REFERENCIA</TableHead>
                                    <TableHead className="text-slate-900 uppercase font-bold text-right">PRECIO</TableHead>
                                    <TableHead className="text-slate-900 uppercase font-bold text-right">DESCUENTO</TableHead>
                                    <TableHead className="text-slate-900 uppercase font-bold text-right">IMPUESTO</TableHead>
                                    <TableHead className="text-slate-900 uppercase font-bold">DESCRIPCIÓN</TableHead>
                                    <TableHead className="text-slate-900 uppercase font-bold text-center">CANTIDAD</TableHead>
                                    <TableHead className="text-slate-900 uppercase font-bold text-right border-r border-gray-200">TOTAL</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {resolvedLines.map((line) => (
                                    <TableRow key={line.key} className="hover:bg-transparent border-0 border-b-0">
                                        <TableCell className="border-l border-gray-200">
                                            {line.itemId ? (
                                                <Link href={`/items/${line.itemId}`} className="text-slate-800 font-medium cursor-pointer hover:bg-slate-200 px-2 py-1 rounded -ml-2 transition-colors inline-block">
                                                    {line.itemName}
                                                </Link>
                                            ) : (
                                                <span className="text-slate-800 font-medium">{line.itemName}</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{line.itemRef}</TableCell>
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
                                                    <span>{line.taxNameStr} {line.taxRate}%</span>
                                                    <span className="text-slate-500 text-xs">
                                                        (${line.taxAmount.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{line.description}</TableCell>
                                        <TableCell className="text-center">{line.itemQty}</TableCell>
                                        <TableCell className="text-right border-r border-gray-200">$ {line.itemTotal.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                                {resolvedLines.length === 0 && (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={8} className="h-24 text-center text-slate-400 border-l border-r border-gray-200">No hay productos en esta factura</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Signature, Adjustments and Subtotals */}
                    <div className="flex flex-col md:flex-row justify-between text-slate-600 border-t border-slate-100 pt-8 gap-8 md:gap-0">
                        <div className="w-full md:w-1/3 flex flex-col items-center justify-end pb-4">
                            <div className="mb-2">
                                <span
                                    className="text-slate-700"
                                    style={{
                                        fontFamily: '"Great Vibes", cursive',
                                        fontSize: '30px'
                                    }}
                                >
                                    {bill.user?.name || 'Administrador'}
                                </span>
                            </div>
                            <div className="w-3/4 border-t border-slate-300 text-center pt-2 text-[10px] uppercase text-slate-400">
                                ELABORADO POR
                            </div>
                        </div>

                        <div className="w-full md:w-1/3 space-y-6 text-right flex flex-col justify-end">
                            {(globalDiscounts.length > 0 || globalCharges.length > 0) && (
                                <div className="border border-slate-100 rounded-lg p-4 bg-slate-50 text-xs">
                                    <h4 className="font-bold text-slate-700 mb-2 border-b border-slate-200 pb-1 text-right">Ajustes Globales</h4>
                                    <div className="space-y-3 mt-2 text-left">
                                        {globalDiscounts.length > 0 && (
                                            <div>
                                                <h5 className="font-semibold text-slate-600 text-[11px] uppercase tracking-wider mb-1">Descuentos</h5>
                                                <div className="space-y-1">
                                                    {globalDiscounts.map((d: any, idx: number) => {
                                                        const isPercent = d.percent || d.percentage;
                                                        const typeStr = isPercent ? `Porcentual (${Number(isPercent)}%)` : 'Fijo';
                                                        return (
                                                            <div key={`d-${idx}`} className="flex justify-between gap-4 py-2 border-b border-slate-100 last:border-0 items-center">
                                                                <div className="flex flex-col space-y-0.5 text-slate-600">
                                                                    <span className="truncate" title={d.reason}><strong className="text-slate-500 font-semibold">Motivo:</strong> {d.reason || 'Sin motivo'}</span>
                                                                    <span><strong className="text-slate-500 font-semibold">Tipo:</strong> {typeStr}</span>
                                                                </div>
                                                                <span className="font-medium text-red-500 shrink-0">-$ {Number(d.amount).toLocaleString()}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {globalCharges.length > 0 && (
                                            <div>
                                                <h5 className="font-semibold text-slate-600 text-[11px] uppercase tracking-wider mb-1">Cargos</h5>
                                                <div className="space-y-1">
                                                    {globalCharges.map((c: any, idx: number) => {
                                                        const isPercent = c.charge_type === 'percentage' || c.percentage_value || c.percent;
                                                        const percentVal = c.percentage_value || c.percent;
                                                        const typeStr = isPercent ? `Porcentual (${Number(percentVal)}%)` : 'Fijo';
                                                        return (
                                                            <div key={`c-${idx}`} className="flex justify-between gap-4 py-2 border-b border-slate-100 last:border-0 items-center">
                                                                <div className="flex flex-col space-y-0.5 text-slate-600">
                                                                    <span className="truncate" title={c.reason}><strong className="text-slate-500 font-semibold">Motivo:</strong> {c.reason || 'Sin motivo'}</span>
                                                                    <span><strong className="text-slate-500 font-semibold">Tipo:</strong> {typeStr}</span>
                                                                </div>
                                                                <span className="font-medium text-slate-700 shrink-0">$ {Number(c.calculated_amount || c.amount || c.value).toLocaleString()}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

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
                                    <span className="text-slate-500">Impuestos en línea</span>
                                    <span>$ {finalTaxes.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-slate-800 pt-3 border-t border-slate-200">
                                    <span className="text-xl font-normal text-slate-600">Total</span>
                                    <span className="text-2xl">$ {finalTotal.toLocaleString()}</span>
                                </div>
                                {withholdingsArray.length > 0 ? (
                                    <>
                                        <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                                            {(withholdingsArray as any[]).map((w: any, idx: number) => (
                                                <div key={idx} className="flex justify-between">
                                                    <span className="text-slate-500">{w.name} {w.percent > 0 ? `${w.percent}%` : ''}</span>
                                                    <span className="text-red-500">-$ {w.amount.toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between font-bold text-slate-800 mt-2">
                                            <span className="text-lg font-normal text-slate-600">Neto a pagar</span>
                                            <span className="text-xl text-primary">$ {(finalTotal - finalWithholdings).toLocaleString()}</span>
                                        </div>
                                    </>
                                ) : finalWithholdings > 0 && (
                                    <>
                                        <div className="flex justify-between mt-2 pt-2 border-t border-slate-100">
                                            <span className="text-slate-500">Retenciones</span>
                                            <span className="text-red-500">-$ {finalWithholdings.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-slate-800 mt-2">
                                            <span className="text-lg font-normal text-slate-600">Neto a pagar</span>
                                            <span className="text-xl text-primary">$ {(finalTotal - finalWithholdings).toLocaleString()}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* Additional Info and Notes */}
                    <div className="flex flex-col md:flex-row justify-between mt-16 text-sm text-slate-600 gap-8 md:gap-12">
                        <div className="w-full md:w-1/2 space-y-10">
                            {/* Información adicional */}
                            <div>
                                <h3 className="font-bold text-slate-800 mb-4 text-base">Información adicional</h3>
                                <div className="space-y-3">
                                    <div className="flex flex-col sm:flex-row border-b border-slate-100 pb-2">
                                        <span className="sm:w-1/2 font-bold text-slate-700">Forma de pago</span>
                                        <span className="sm:w-1/2 font-medium">{bill.payment_form?.name || bill.payment_term?.name || 'Contado'}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row border-b border-slate-100 pb-2">
                                        <span className="sm:w-1/2 font-bold text-slate-700">Medio de pago</span>
                                        <span className="sm:w-1/2 font-medium">{bill.payment_method?.name || 'Transferencia débito'}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row border-b border-slate-100 pb-2">
                                        <span className="sm:w-1/2 font-bold text-slate-700">Tipo de factura</span>
                                        <span className="sm:w-1/2 font-medium">Factura de venta</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row border-b border-slate-100 pb-2">
                                        <span className="sm:w-1/2 font-bold text-slate-700">Tipo de operación</span>
                                        <span className="sm:w-1/2 font-medium">Estándar</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row border-b border-slate-100 pb-2">
                                        <span className="sm:w-1/2 font-bold text-slate-700">Orden de compra</span>
                                        <span className="sm:w-1/2 font-medium">{bill.order_reference?.id || bill.order_reference || ''}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Términos y condiciones */}
                            <div>
                                <h3 className="text-black font-bold mb-3 text-base">Términos y condiciones</h3>
                                <p className="text-xs text-black leading-relaxed text-justify">
                                    {bill.terms_and_conditions || 'Esta factura se asimila en todos sus efectos a una letra de cambio de conformidad con el Art. 774 del código de comercio. Autorizo que en caso de incumplimiento de esta obligación sea reportado a las centrales de riesgo, se cobraran intereses por mora.'}
                                </p>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 space-y-4">
                            <div>
                                <h3 className="text-black font-bold mb-2 text-xs uppercase">Notas:</h3>
                                <div className="bg-gray-50 rounded-md p-3 text-xs text-black leading-relaxed min-h-[60px] border border-gray-200">
                                    {bill.billing_reference?.notes || bill.notes || '—'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer notes */}
                    <div className="mt-10 pt-6 border-t border-slate-100 text-xs text-black text-center">
                        <p>Resolución DIAN: {bill.resolution?.resolution_text || bill.resolution_text || ''}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
