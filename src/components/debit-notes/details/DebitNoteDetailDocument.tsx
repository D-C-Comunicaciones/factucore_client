import QRCode from "react-qr-code";
import { formatCurrency } from "@/utils/format-currency";
import dayjs from "dayjs";
import { useRef, useState, useEffect } from "react";
import { DianStatusBadge } from "@/components/invoice/table/columns";
import { FactucoreLogo } from "@/components/brand/FactucoreLogo";
import { CompanyHeaderPdfStyle } from "@/components/shared/CompanyHeaderPdfStyle";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface DebitNoteDetailDocumentProps {
    debitNote: any;
    company?: any;
    dianStatus?: string;
}

export function DebitNoteDetailDocument({ debitNote, company, dianStatus }: DebitNoteDetailDocumentProps) {
    const dataBlockRef = useRef<HTMLDivElement>(null);
    const [qrSize, setQrSize] = useState(120);

    useEffect(() => {
        if (dataBlockRef.current) {
            const h = dataBlockRef.current.offsetHeight;
            if (h > 0) setQrSize(h);
        }
    });
    const customerName = debitNote?.customer_name || debitNote?.customer?.registration_name || debitNote?.customer?.name || "—";
    const customerDoc = debitNote?.customer?.identification_number || '';
    const customerDv = debitNote?.customer?.verification_digit;
    const customerDocLabel = customerDoc
        ? (customerDv != null && customerDv !== '' ? `${customerDoc}-${customerDv}` : `${customerDoc}`)
        : '';
    const lines: any[] = debitNote?.lines || [];

    // Helper: fecha puede venir como "22/07/2026" (ya formateada) o ISO
    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return "—";
        // Si ya viene en formato dd/mm/yyyy, la devolvemos tal cual
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
        // Si viene en ISO yyyy-mm-dd la parseamos
        return dayjs(dateStr).isValid() ? dayjs(dateStr).format("DD/MM/YYYY") : "—";
    };

    // Type name based on ID / nombre ya resuelto por el backend
    const getTypeName = (id: number) => {
        const types: Record<number, string> = {
            1: "Intereses",
            2: "Gastos por cobrar",
            3: "Cambio del valor",
            4: "Otros",
        };
        return types[id] || "Nota Débito";
    };

    const typeName = debitNote?.type_debit_note_name || getTypeName(debitNote?.type_debit_note_id);

    const currencyId = debitNote?.currency_id || debitNote?.invoice?.type_currency_id || 35;
    const currencyCode = currencyId === 35 ? 'COP' : 'USD';

    // Calculate totals and adjustments
    const finalSubtotal = Number(debitNote?.subtotal || 0);
    const finalTaxes = Number(debitNote?.tax_total || 0);
    const finalTotal = Number(debitNote?.total || debitNote?.payable_amount || 0);

    const allDiscounts = debitNote?.discounts || [];
    const allCharges = debitNote?.charges || [];

    const globalDiscounts = allDiscounts.filter((d: any) => String(d.charge_indicator) !== "true");

    // Sumamos los descuentos de línea recorriendo las lines, o usamos el fallback si es un formato antiguo
    const lineDiscountsTotal = lines.reduce((sum: number, line: any) => {
        const itemDiscounts = line.discounts || [];
        return sum + itemDiscounts.reduce((dSum: number, d: any) => dSum + Number(d.amount), 0);
    }, 0) || Number(debitNote?.discount_total || 0);

    const globalCharges = allCharges.filter((c: any) => c.scope === 'global' || !c.line_id);
    const globalDiscountsTotal = globalDiscounts.reduce((sum: number, d: any) => sum + Number(d.calculated_amount || d.amount || d.value || 0), 0);
    const globalChargesTotal = globalCharges.reduce((sum: number, c: any) => sum + Number(c.calculated_amount || c.amount || c.value || 0), 0);

    // Resuelve cada línea una sola vez para que la tabla (desktop) y las
    // tarjetas (móvil) lean exactamente los mismos valores.
    const resolvedLines = lines.map((line: any, idx: number) => {
        const qty = parseFloat(line.quantity) || 1;
        const price = parseFloat(line.price) || 0;
        const subtotal = parseFloat(line.subtotal) || price * qty;
        const lineTotal = parseFloat(line.total_line) || parseFloat(line.total) || subtotal;

        const discountAmount = line.discounts?.length
            ? line.discounts.reduce((sum: number, d: any) => sum + Number(d.amount || 0), 0)
            : Number(line.discount_amount || 0);

        let discountPercentDisplay = parseFloat(line.discount_percentage) || 0;
        if (line.discounts?.length > 0 && line.discounts[0].percent) {
            discountPercentDisplay = Number(line.discounts[0].percent);
        } else if (!discountPercentDisplay && discountAmount > 0 && subtotal > 0) {
            discountPercentDisplay = (discountAmount / subtotal) * 100;
        }

        const taxAmount = line.taxes?.length
            ? line.taxes.reduce((sum: number, t: any) => sum + Number(t.tax_amount || 0), 0)
            : Number(line.tax_amount || 0);

        const taxLabel = line.taxes && line.taxes.length > 0
            ? line.taxes.map((t: any) => `${t.name} ${Number(t.percent || t.rate || 0)}%`).join(', ')
            : 'IVA 0%';

        return {
            key: idx,
            description: line.description,
            qty: Math.round(qty),
            subtotal,
            lineTotal,
            discountAmount,
            discountPercentDisplay,
            taxAmount,
            taxLabel,
            hasTax: line.taxes?.length > 0 || taxAmount > 0,
        };
    });

    return (
        <div className="filter drop-shadow-sm">
            <div
                className="bg-white rounded-lg border border-slate-200 relative overflow-hidden"
                style={{ clipPath: 'polygon(0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 0 100%)' }}
            >
                {/* Folded Corner Effect (optional, matches invoice) */}
                <div className="absolute top-0 right-0 w-10 h-10 pointer-events-none" style={{ filter: 'drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.08))' }}>
                    <div className="w-full h-full bg-gradient-to-bl from-slate-200 via-slate-100 to-white border-l border-b border-slate-200/80" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }} />
                </div>

                <div className="p-5 sm:p-8 md:p-10 space-y-8">
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
                                No. <span className="font-semibold">{debitNote?.prefix || ''}{debitNote?.number || debitNote?.id}</span>
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
                                <Link href={`/contacts/${debitNote?.customer?.id || debitNote?.contact_id || ''}`} className="font-medium text-slate-800 cursor-pointer hover:bg-slate-100 px-2 py-1 rounded sm:-ml-2 -ml-2 transition-colors self-start">
                                    {customerName}
                                </Link>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-bold text-slate-700 sm:w-48 shrink-0">Cédula de ciudadanía:</span>
                                <span>{customerDocLabel || '—'}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-bold text-slate-700 sm:w-48 shrink-0">Teléfono:</span>
                                <span>{debitNote?.customer?.phone1 || debitNote?.customer?.phone || '—'}</span>
                            </div>
                        </div>
                        <div className="space-y-2 border-b border-slate-100 pb-2">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-bold text-slate-700 sm:w-48 shrink-0">Creación:</span>
                                <span>{formatDate(debitNote?.issue_date)}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-bold text-slate-700 sm:w-48 shrink-0">Tipo de nota débito:</span>
                                <span>{typeName}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-bold text-slate-700 sm:w-48 shrink-0">Factura asociada:</span>
                                <span>
                                    {debitNote?.invoice
                                        ? `${debitNote.invoice.prefix || ''}${debitNote.invoice.number} | Monto ${formatCurrency(Number(debitNote.invoice.total || 0), currencyCode)}`
                                        : debitNote?.invoice_id
                                            ? `${debitNote.invoice_id}`
                                            : "—"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Items — tarjetas en móvil */}
                    <div className="mb-10 md:hidden border border-gray-200 rounded-lg divide-y divide-gray-200 overflow-hidden">
                        {resolvedLines.length === 0 ? (
                            <div className="h-24 flex items-center justify-center text-center text-slate-400 text-sm">
                                No hay productos en esta nota débito
                            </div>
                        ) : (
                            resolvedLines.map((line) => (
                                <div key={line.key} className="p-4 bg-white">
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="text-slate-700 text-sm">{line.description}</span>
                                        <span className="text-sm font-medium text-slate-700 shrink-0">
                                            {formatCurrency(line.lineTotal, currencyCode)}
                                        </span>
                                    </div>
                                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                                        <div>
                                            <div className="text-slate-400">Subtotal</div>
                                            <div className="text-slate-700 font-medium">{formatCurrency(line.subtotal, currencyCode)}</div>
                                        </div>
                                        <div>
                                            <div className="text-slate-400">Cantidad</div>
                                            <div className="text-slate-700 font-medium">{line.qty}</div>
                                        </div>
                                        <div>
                                            <div className="text-slate-400">Descuento</div>
                                            <div className="text-slate-700 font-medium">
                                                {line.discountAmount > 0
                                                    ? `${line.discountPercentDisplay % 1 !== 0 ? line.discountPercentDisplay.toFixed(2) : line.discountPercentDisplay}%`
                                                    : '-'}
                                            </div>
                                        </div>
                                    </div>
                                    {line.hasTax && (
                                        <div className="mt-2 text-xs text-slate-500">
                                            {line.taxLabel} ({formatCurrency(line.taxAmount, currencyCode)})
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Tabla de Productos — sm y superior */}
                    <div className="overflow-x-auto relative mb-10 border-b border-gray-200 hidden md:block">
                        <Table className="[&_td]:border-b-0">
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead className="font-bold uppercase text-xs text-slate-900 border-l border-gray-200">ITEM</TableHead>
                                    <TableHead className="font-bold uppercase text-xs text-slate-900">Subtotal</TableHead>
                                    <TableHead className="font-bold uppercase text-xs text-slate-900 text-center">Descuento</TableHead>
                                    <TableHead className="font-bold uppercase text-xs text-slate-900 text-center">Impuesto</TableHead>
                                    <TableHead className="font-bold uppercase text-xs text-slate-900 text-center">Cantidad</TableHead>
                                    <TableHead className="font-bold uppercase text-xs text-slate-900 text-right border-r border-gray-200">Total línea</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {resolvedLines.map((line) => (
                                    <TableRow key={line.key} className="hover:bg-transparent border-0 border-b-0">
                                        <TableCell className="text-slate-700 border-l border-gray-200">{line.description}</TableCell>
                                        <TableCell className="text-slate-600">{formatCurrency(line.subtotal, currencyCode)}</TableCell>
                                        <TableCell className="text-slate-600 text-center">
                                            {line.discountAmount > 0 ? (
                                                <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                                                    <span>{line.discountPercentDisplay % 1 !== 0 ? line.discountPercentDisplay.toFixed(2) : line.discountPercentDisplay}%</span>
                                                    <span className="text-slate-500 text-xs">({formatCurrency(line.discountAmount, currencyCode)})</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-slate-600 text-center">
                                            {line.hasTax ? (
                                                <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                                                    <span>{line.taxLabel}</span>
                                                    <span className="text-slate-500 text-xs">({formatCurrency(line.taxAmount, currencyCode)})</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-slate-600 text-center">{line.qty}</TableCell>
                                        <TableCell className="text-slate-700 font-medium text-right border-r border-gray-200">
                                            {formatCurrency(line.lineTotal, currencyCode)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {resolvedLines.length === 0 && (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={6} className="h-24 text-center text-slate-400 border-l border-r border-gray-200">No hay productos en esta nota débito</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Totales */}
                    <div className="flex justify-end pt-4 border-t border-slate-100">
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
                                                                <span className="font-medium text-red-500 shrink-0">-{formatCurrency(d.calculated_amount || d.amount || d.value, currencyCode)}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {globalCharges.length > 0 && (
                                            <div>
                                                <h5 className="font-semibold text-slate-600 text-[11px] uppercase tracking-wider mb-1">Propinas / Cargos</h5>
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
                                                                <span className="font-medium text-slate-700 shrink-0">{formatCurrency(c.calculated_amount || c.amount || c.value, currencyCode)}</span>
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
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span>{formatCurrency(finalSubtotal, currencyCode)}</span>
                                </div>
                                {lineDiscountsTotal > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Descuentos en línea</span>
                                        <span className="text-red-500">-{formatCurrency(lineDiscountsTotal, currencyCode)}</span>
                                    </div>
                                )}
                                {globalDiscountsTotal > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Descuentos Globales</span>
                                        <span className="text-red-500">-{formatCurrency(globalDiscountsTotal, currencyCode)}</span>
                                    </div>
                                )}
                                {globalChargesTotal > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Propinas</span>
                                        <span>{formatCurrency(globalChargesTotal, currencyCode)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Impuestos en línea</span>
                                    <span>{formatCurrency(finalTaxes, currencyCode)}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-slate-800 pt-3 border-t border-slate-200">
                                    <span className="text-xl font-normal text-[#0F2843]">Total nota débito</span>
                                    <span className="text-2xl">{formatCurrency(finalTotal, currencyCode)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QR, Datos DIAN, Notas y Observaciones */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-8 justify-between">
                        {(() => {
                            const inv = debitNote?.invoice;
                            const qrData = debitNote?.qr || debitNote?.qr_url;
                            const tplData = inv?.invoice_snapshot?.template_data;
                            const supplierSnap = tplData?.supplier_snapshot;
                            const nitFac = supplierSnap?.identification_number || inv?.supplier_id || '';
                            const docAdq = debitNote?.customer?.identification_number || '';
                            const valFac = debitNote?.subtotal || '0.00';
                            // IVA = impuestos con code 01
                            const taxTotals: any[] = tplData?.taxTotals || [];
                            const ivaTotal = taxTotals
                                .filter((t: any) => t.tax_code === '01')
                                .reduce((s: number, t: any) => s + parseFloat(t.tax_amount || 0), 0);
                            // OtrosImpuestos = todo lo que no sea IVA (INC, ICA, etc.)
                            const otrosIm = taxTotals
                                .filter((t: any) => t.tax_code !== '01')
                                .reduce((s: number, t: any) => s + parseFloat(t.tax_amount || 0), 0);
                            const valTol = debitNote?.total || '0.00';
                            const numFac = `${debitNote?.invoice?.prefix || ''}${debitNote?.invoice?.number || ''}`;
                            const fecFac = debitNote?.invoice?.issue_date || '';
                            const horFac = debitNote?.invoice?.issue_time || '';

                            return (
                                <div className="flex flex-wrap items-start gap-4 flex-1">
                                    {qrData && (
                                        <div className="p-1 bg-white border border-slate-200 rounded-lg shrink-0 flex items-center justify-center">
                                            <QRCode
                                                value={qrData}
                                                size={qrSize}
                                                bgColor="#ffffff"
                                                fgColor="#000000"
                                                level="H"
                                            />
                                        </div>
                                    )}
                                    {(qrData || numFac) && (
                                        <div
                                            ref={dataBlockRef}
                                            className="text-xs text-slate-800 space-y-0.5 font-mono leading-5"
                                        >
                                            <p><span className="font-semibold">NumFac:</span> {numFac}</p>
                                            <p><span className="font-semibold">FecFac:</span> {fecFac}</p>
                                            <p><span className="font-semibold">HorFac:</span> {horFac}</p>
                                            <p><span className="font-semibold">NitFac:</span> {nitFac}</p>
                                            <p><span className="font-semibold">DocAdq:</span> {docAdq}</p>
                                            <p><span className="font-semibold">ValFac:</span> {parseFloat(String(valFac)).toFixed(2)}</p>
                                            <p><span className="font-semibold">ValIva:</span> {ivaTotal.toFixed(2)}</p>
                                            <p><span className="font-semibold">ValOtroIm:</span> {otrosIm.toFixed(2)}</p>
                                            <p><span className="font-semibold">ValTolFac:</span> {parseFloat(String(valTol)).toFixed(2)}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {/* Notas y Observaciones en la misma fila del QR */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="text-black font-bold mb-2 text-xs uppercase">Notas:</h3>
                                <div className="bg-gray-50 rounded-md p-3 text-xs text-black leading-relaxed min-h-[60px] border border-gray-200">
                                    {debitNote?.note || '—'}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-black font-bold mb-2 text-xs uppercase">Observaciones:</h3>
                                <div className="bg-gray-50 rounded-md p-3 text-xs text-black leading-relaxed min-h-[60px] border border-gray-200">
                                    {debitNote?.observation || '—'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Firmas */}
                    <div className="flex flex-col items-center md:items-start md:flex-row justify-between mt-16 text-sm text-slate-600 gap-12">
                        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-end">
                            <div className="w-64">
                                <div className="mb-2">
                                    <span
                                        className="text-slate-700"
                                        style={{
                                            fontFamily: '"Great Vibes", cursive',
                                            fontSize: '30px'
                                        }}
                                    >
                                        Administrador
                                    </span>
                                </div>
                                <div className="border-t border-slate-300 pt-2 text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                                    Elaborado por
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Extras */}
                    <div className="mt-10 pt-6 border-t border-slate-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">Lista de precios</span>
                                <span className="text-slate-700 font-medium">General</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">Bodega</span>
                                <span className="text-slate-700 font-medium">Principal</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
