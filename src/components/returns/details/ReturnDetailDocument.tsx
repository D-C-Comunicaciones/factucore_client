import QRCode from "react-qr-code";
import { formatCurrency } from "@/utils/format-currency";
import dayjs from "dayjs";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

interface ReturnDetailDocumentProps {
    creditNote: any;
    company?: any;
    dianStatus?: string;
}

export function ReturnDetailDocument({ creditNote, company, dianStatus }: ReturnDetailDocumentProps) {
    const router = useRouter();
    const dataBlockRef = useRef<HTMLDivElement>(null);
    const [qrSize, setQrSize] = useState(120);

    useEffect(() => {
        if (dataBlockRef.current) {
            const h = dataBlockRef.current.offsetHeight;
            if (h > 0) setQrSize(h);
        }
    });
    const customerName = creditNote?.customer_name || creditNote?.customer?.registration_name || creditNote?.customer?.name || "—";
    const customerDoc = creditNote?.customer?.identification_number || '';
    const customerDv = creditNote?.customer?.verification_digit;
    const customerDocLabel = customerDoc
        ? (customerDv != null && customerDv !== '' ? `${customerDoc}-${customerDv}` : `${customerDoc}`)
        : '';
    const lines = creditNote?.lines || [];

    // Helper: fecha puede venir como "22/07/2026" (ya formateada) o ISO
    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return "—";
        // Si ya viene en formato dd/mm/yyyy, la devolvemos tal cual
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
        // Si viene en ISO yyyy-mm-dd la parseamos
        return dayjs(dateStr).isValid() ? dayjs(dateStr).format("DD/MM/YYYY") : "—";
    };

    // Type name based on ID
    const getTypeName = (id: number) => {
        const types: Record<number, string> = {
            1: "Devolución de parte de los bienes",
            2: "Anulación de factura electrónica",
            3: "Rebaja o descuento parcial o total",
            4: "Ajuste de precio",
            5: "Otros",
            6: "Descuento comercial por pronto pago",
            7: "Descuento comercial por volumen de ventas"
        };
        return types[id] || "Nota Crédito";
    };

    const typeName = getTypeName(creditNote?.type_credit_note_id);
    const invoicePrefix = creditNote?.invoice?.prefix || "";
    const invoiceNumber = creditNote?.invoice?.number || creditNote?.invoice_id || "";
    const invoiceTotal = creditNote?.invoice?.total || 0;

    const currencyId = creditNote?.currency_id || creditNote?.invoice?.type_currency_id || 35;
    const currencyCode = currencyId === 35 ? 'COP' : 'USD';

    // Calculate totals and adjustments
    const finalSubtotal = Number(creditNote?.subtotal || 0);
    const finalTaxes = Number(creditNote?.tax_total || 0);
    const finalTotal = Number(creditNote?.total || creditNote?.payable_amount || 0);

    const allDiscounts = creditNote?.discounts || [];
    const allCharges = creditNote?.charges || [];

    const globalDiscounts = allDiscounts.filter((d: any) => String(d.charge_indicator) !== "true");

    // Sumamos los descuentos de línea recorriendo las lines, o usamos el fallback si es un formato antiguo
    const lineDiscountsTotal = lines.reduce((sum: number, line: any) => {
        const itemDiscounts = line.discounts || [];
        return sum + itemDiscounts.reduce((dSum: number, d: any) => dSum + Number(d.amount), 0);
    }, 0) || Number(creditNote?.discount_total || 0);

    const globalCharges = allCharges.filter((c: any) => c.scope === 'global' || !c.line_id);
    const globalDiscountsTotal = globalDiscounts.reduce((sum: number, d: any) => sum + Number(d.calculated_amount || d.amount || d.value || 0), 0);
    const globalChargesTotal = globalCharges.reduce((sum: number, c: any) => sum + Number(c.calculated_amount || c.amount || c.value || 0), 0);

    const grossSubtotal = finalSubtotal + (lineDiscountsTotal > 0 && !creditNote?.discount_total ? 0 : lineDiscountsTotal); // Si el subtotal ya viene neto de descuentos, adjust accordingly. Generalmente grossSubtotal = finalSubtotal + lineDiscountsTotal


    const compName = company?.name || company?.company_name || company?.registration_name || '';
    const compId = company?.identification_number || company?.company_id || '';
    const compDv = company?.verification_digit ?? company?.dv ?? company?.company_dv;
    const compEmail = company?.email || '';

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

                <div className="p-10 space-y-8">
                    {/* Doc Header */}
                    <div className="flex justify-between items-start mb-10 border-b pb-8 border-slate-100">
                        {/* Logo */}
                        <div className="w-1/3 pl-8">
                            <div className="w-64 h-24 relative flex items-center justify-start">
                                <FactucoreLogo
                                    variant="icon"
                                    alt="Logo de empresa"
                                    className="w-full h-full object-left"
                                />
                            </div>
                        </div>

                        {/* Empresa (Centro) */}
                        <div className="w-1/3 pt-2 flex flex-col justify-center">
                            <CompanyHeaderPdfStyle companyProp={company} />
                        </div>

                        {/* Factura No & DIAN (Derecha) */}
                        <div className="w-1/3 text-right flex flex-col items-end pt-2">
                            <div className="text-slate-500 text-xl font-light text-primary">
                                No. <span className="font-semibold">{creditNote?.prefix || ''}{creditNote?.number || creditNote?.id}</span>
                            </div>
                            <div className="mt-2 flex items-center justify-end gap-2 uppercase">
                                <span className="text-xs text-slate-400">Estado DIAN:</span>
                                <DianStatusBadge status={dianStatus || 'NO APROBADA'} />
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-4 mb-10 text-slate-600">
                        <div className="space-y-2 border-b border-slate-100 pb-2">
                            <div className="flex items-center">
                                <span className="font-bold text-slate-700 w-48 shrink-0">Cliente:</span>
                                <Link href={`/contacts/${creditNote?.customer?.id || creditNote?.contact_id || ''}`} className="font-medium text-slate-800 cursor-pointer hover:bg-slate-100 px-2 py-1 rounded -ml-2 transition-colors">
                                    {customerName}
                                </Link>
                            </div>
                            <div className="flex items-center">
                                <span className="font-bold text-slate-700 w-48 shrink-0">Cédula de ciudadanía:</span>
                                <span>{customerDocLabel || '—'}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="font-bold text-slate-700 w-48 shrink-0">Teléfono:</span>
                                <span>{creditNote?.customer?.phone1 || creditNote?.customer?.phone || '—'}</span>
                            </div>
                        </div>
                        <div className="space-y-2 border-b border-slate-100 pb-2">
                            <div className="flex items-center">
                                <span className="font-bold text-slate-700 w-48 shrink-0">Creación:</span>
                                <span>{formatDate(creditNote?.issue_date)}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="font-bold text-slate-700 w-48 shrink-0">Tipo de nota crédito:</span>
                                <span>{typeName}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="font-bold text-slate-700 w-48 shrink-0">Factura asociada:</span>
                                <span>
                                    {creditNote?.invoice
                                        ? `${creditNote.invoice.prefix || ''}${creditNote.invoice.number} | Monto ${formatCurrency(Number(creditNote.invoice.total || 0), currencyCode)}`
                                        : creditNote?.invoice_id
                                            ? `${creditNote.invoice_id}`
                                            : "—"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Productos */}
                    <div className="overflow-x-auto relative mb-10 border-b border-gray-200">
                        <Table className="[&_td]:border-b-0">
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead className="font-bold uppercase text-xs text-slate-900 border-l border-gray-200">ITEM</TableHead>
                                    <TableHead className="font-bold uppercase text-xs text-slate-900">Subtotal</TableHead>
                                    <TableHead className="font-bold uppercase text-xs text-slate-900 text-center">Descuento</TableHead>
                                    <TableHead className="font-bold uppercase text-xs text-slate-900 text-center">Impuesto</TableHead>
                                    <TableHead className="font-bold uppercase text-xs text-slate-900 text-center">Cantidad</TableHead>
                                    <TableHead className="font-bold uppercase text-xs text-slate-900 text-right border-r border-gray-200">Monto devuelto</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lines.map((line: any, idx: number) => {
                                    const qty = parseFloat(line.quantity) || 1;
                                    const price = parseFloat(line.price) || 0;
                                    const subtotal = parseFloat(line.subtotal) || price * qty;
                                    const lineTotal = parseFloat(line.total_line) || parseFloat(line.total) || subtotal;
                                    
                                    // Discount calculation
                                    const discountAmount = line.discounts?.length
                                        ? line.discounts.reduce((sum: number, d: any) => sum + Number(d.amount || 0), 0)
                                        : Number(line.discount_amount || 0);
                                        
                                    let discountPercentDisplay = parseFloat(line.discount_percentage) || 0;
                                    if (line.discounts?.length > 0 && line.discounts[0].percent) {
                                        discountPercentDisplay = Number(line.discounts[0].percent);
                                    } else if (!discountPercentDisplay && discountAmount > 0 && subtotal > 0) {
                                        discountPercentDisplay = (discountAmount / subtotal) * 100;
                                    }

                                    // Tax calculation
                                    const taxAmount = line.taxes?.length
                                        ? line.taxes.reduce((sum: number, t: any) => sum + Number(t.tax_amount || 0), 0)
                                        : Number(line.tax_amount || 0);
                                        
                                    return (
                                        <TableRow key={idx} className="hover:bg-transparent border-0 border-b-0">
                                            <TableCell className="text-slate-700 border-l border-gray-200">{line.description}</TableCell>
                                            <TableCell className="text-slate-600">{formatCurrency(subtotal, currencyCode)}</TableCell>
                                            <TableCell className="text-slate-600 text-center">
                                                {discountAmount > 0 ? (
                                                    <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                                                        <span>{discountPercentDisplay % 1 !== 0 ? discountPercentDisplay.toFixed(2) : discountPercentDisplay}%</span>
                                                        <span className="text-slate-500 text-xs">({formatCurrency(discountAmount, currencyCode)})</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-slate-600 text-center">
                                                {line.taxes?.length > 0 || taxAmount > 0 ? (
                                                    <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                                                        {line.taxes && line.taxes.length > 0 ? line.taxes.map((t: any, i: number) => (
                                                            <span key={i}>{t.name} {Number(t.percent || t.rate || 0)}%</span>
                                                        )) : <span>IVA 0%</span>}
                                                        <span className="text-slate-500 text-xs">({formatCurrency(taxAmount, currencyCode)})</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-slate-600 text-center">{Math.round(qty)}</TableCell>
                                            <TableCell className="text-slate-700 font-medium text-right border-r border-gray-200">
                                                {formatCurrency(lineTotal, currencyCode)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
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
                                        <span className="text-slate-500">Cargos Globales</span>
                                        <span>{formatCurrency(globalChargesTotal, currencyCode)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Impuestos en línea</span>
                                    <span>{formatCurrency(finalTaxes, currencyCode)}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-slate-800 pt-3 border-t border-slate-200">
                                    <span className="text-xl font-normal text-[#0F2843]">Total devolución</span>
                                    <span className="text-2xl">{formatCurrency(finalTotal, currencyCode)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QR, Datos DIAN, Notas y Observaciones */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-8 justify-between">
                        {(() => {
                            const inv = creditNote?.invoice;
                            const qrData = creditNote?.qr || creditNote?.qr_url;
                            const tplData = inv?.invoice_snapshot?.template_data;
                            const supplierSnap = tplData?.supplier_snapshot;
                            const nitFac = supplierSnap?.identification_number || inv?.supplier_id || '';
                            const docAdq = creditNote?.customer?.identification_number || '';
                            const valFac = creditNote?.subtotal || '0.00';
                            // IVA = impuestos con code 01
                            const taxTotals: any[] = tplData?.taxTotals || [];
                            const ivaTotal = taxTotals
                                .filter((t: any) => t.tax_code === '01')
                                .reduce((s: number, t: any) => s + parseFloat(t.tax_amount || 0), 0);
                            // OtrosImpuestos = todo lo que no sea IVA (INC, ICA, etc.)
                            const otrosIm = taxTotals
                                .filter((t: any) => t.tax_code !== '01')
                                .reduce((s: number, t: any) => s + parseFloat(t.tax_amount || 0), 0);
                            const valTol = creditNote?.total || '0.00';
                            const numFac = `${creditNote?.invoice?.prefix || ''}${creditNote?.invoice?.number || ''}`;
                            const fecFac = creditNote?.invoice?.issue_date || '';
                            const horFac = creditNote?.invoice?.issue_time || '';

                            return (
                                <div className="flex items-start gap-4 flex-1">
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
                                    {creditNote?.note || '—'}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-black font-bold mb-2 text-xs uppercase">Observaciones:</h3>
                                <div className="bg-gray-50 rounded-md p-3 text-xs text-black leading-relaxed min-h-[60px] border border-gray-200">
                                    {creditNote?.observation || '—'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Firmas */}
                    <div className="flex justify-between mt-16 text-sm text-slate-600 gap-12">
                        <div className="w-1/2 flex flex-col justify-end">
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
                        <div className="grid grid-cols-2 gap-4 text-sm">
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
