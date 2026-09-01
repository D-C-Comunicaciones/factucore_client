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

interface BillDetailDocumentProps {
    bill: any;
    company: any;
}

export function BillDetailDocument({ bill, company }: BillDetailDocumentProps) {
    const contact = bill.contact || {};
    const lines = bill.lines || [];

    const balance = Number(bill.balance ?? 0);
    const isPaid = balance <= 0.01;
    const statusCode = String(bill.bill_status?.code || "").toUpperCase();
    const isCancelled = statusCode === "ANULADO";

    const globalDiscounts = (bill.discounts || []).filter((d: any) => d.bill_line_id === null);
    const globalCharges = (bill.charges || []).filter((c: any) => c.scope === 'global');
    const lineDiscountsTotal = (bill.discounts || [])
        .filter((d: any) => d.bill_line_id !== null)
        .reduce((sum: number, d: any) => sum + Number(d.amount || 0), 0);
    const globalDiscountsTotal = globalDiscounts.reduce((sum: number, d: any) => sum + Number(d.amount || 0), 0);
    const globalChargesTotal = globalCharges.reduce((sum: number, c: any) => sum + Number(c.calculated_amount || c.amount || 0), 0);

    const grossSubtotal = Number(bill.subtotal || 0) + lineDiscountsTotal;
    const withholdings = bill.withholdings || [];

    const resolvedLines = lines.map((line: any, idx: number) => {
        const itemName = line.item_snapshot?.name || line.description || `Ítem #${idx + 1}`;
        const itemRef = line.item_code || '';
        const itemPrice = Number(line.price || 0);
        const itemQty = Number(line.quantity || 0);
        const itemTotal = Number(line.total || 0);
        const firstTax = (line.taxes || [])[0];
        const taxRate = Number(firstTax?.percent || 0);
        const taxAmount = (line.taxes || []).reduce((sum: number, t: any) => sum + Number(t.tax_amount || 0), 0);
        const taxNameStr = firstTax?.name || 'IVA';
        const discountAmount = Number(line.discount || 0);
        const totalGross = itemPrice * itemQty;
        const discountPercent = discountAmount > 0 && totalGross > 0 ? (discountAmount / totalGross) * 100 : 0;

        return {
            key: line.id ?? idx,
            itemName,
            itemRef,
            itemPrice,
            itemQty,
            itemTotal,
            taxRate,
            taxNameStr,
            taxAmount,
            discountAmount,
            discountPercent,
            description: line.description || '',
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
                <div className={`absolute top-6 -left-12 w-48 text-center text-white text-[11px] uppercase tracking-wide font-bold py-1.5 transform -rotate-45 shadow-md ${isCancelled ? 'bg-slate-500' : (isPaid ? 'bg-green-500' : 'bg-red-500')}`}>
                    {isCancelled ? 'ANULADO' : (isPaid ? 'PAGADO' : 'POR PAGAR')}
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

                        {/* Documento No (Derecha) */}
                        <div className="w-full md:w-1/3 flex flex-col items-center md:items-end md:pt-2">
                            <div className="text-slate-500 text-sm uppercase tracking-wide font-semibold text-primary">
                                Factura de compra
                            </div>
                            <div className="text-slate-500 text-xl font-light text-primary">
                                No. <span className="font-semibold">{bill.bill_number || `#${bill.id}`}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact (Proveedor) Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-slate-600">
                        <div className="space-y-2 border-b border-slate-100 pb-2">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-bold text-slate-700 sm:w-48 shrink-0">Proveedor:</span>
                                <Link href={`/contacts/${contact?.id || bill?.contact_id || ''}`} className="font-medium text-slate-800 cursor-pointer hover:bg-slate-100 px-2 py-1 rounded -ml-2 transition-colors self-start">
                                    {contact?.registration_name || contact?.name || `${contact?.first_name || ''} ${contact?.last_name || ''}`.trim() || 'Sin proveedor'}
                                </Link>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-bold text-slate-700 sm:w-48 shrink-0">
                                    {contact?.type_document_identification?.name || 'Identificación'}:
                                </span>
                                <span>
                                    {contact?.identification_number || ''}
                                    {contact?.verification_digit != null ? `-${contact.verification_digit}` : ''}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-bold text-slate-700 sm:w-48 shrink-0">Teléfono:</span>
                                <span>{contact?.phone || contact?.email || ''}</span>
                            </div>
                        </div>
                        <div className="space-y-2 border-b border-slate-100 pb-2">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-bold text-slate-700 sm:w-32 shrink-0">Emisión:</span>
                                <span>{bill.issue_date || ''}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-bold text-slate-700 sm:w-32 shrink-0">Vencimiento:</span>
                                <span>{bill.due_date || bill.issue_date || ''}</span>
                            </div>
                            {bill.physical_document_number && (
                                <div className="flex flex-col sm:flex-row sm:items-center">
                                    <span className="font-bold text-slate-700 sm:w-32 shrink-0">Doc. físico:</span>
                                    <span>{bill.physical_document_number}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Items — tarjetas en móvil */}
                    <div className="mb-10 md:hidden border border-gray-200 rounded-lg divide-y divide-gray-200 overflow-hidden">
                        {resolvedLines.length === 0 ? (
                            <div className="h-24 flex items-center justify-center text-center text-slate-400 text-sm">
                                No hay productos en esta factura
                            </div>
                        ) : (
                            resolvedLines.map((line: typeof resolvedLines[number]) => (
                                <div key={line.key} className="p-4 bg-white">
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="text-slate-800 font-medium text-sm">{line.itemName}</span>
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
                                {resolvedLines.map((line: typeof resolvedLines[number]) => (
                                    <TableRow key={line.key} className="hover:bg-transparent border-0 border-b-0">
                                        <TableCell className="border-l border-gray-200">
                                            <span className="text-slate-800 font-medium">{line.itemName}</span>
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
                                                        const isPercent = Number(d.percent) > 0;
                                                        const typeStr = isPercent ? `Porcentual (${Number(d.percent)}%)` : 'Fijo';
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
                                                        const isPercent = Number(c.percent) > 0;
                                                        const typeStr = isPercent ? `Porcentual (${Number(c.percent)}%)` : 'Fijo';
                                                        return (
                                                            <div key={`c-${idx}`} className="flex justify-between gap-4 py-2 border-b border-slate-100 last:border-0 items-center">
                                                                <div className="flex flex-col space-y-0.5 text-slate-600">
                                                                    <span className="truncate" title={c.reason}><strong className="text-slate-500 font-semibold">Motivo:</strong> {c.reason || 'Sin motivo'}</span>
                                                                    <span><strong className="text-slate-500 font-semibold">Tipo:</strong> {typeStr}</span>
                                                                </div>
                                                                <span className="font-medium text-slate-700 shrink-0">$ {Number(c.calculated_amount || c.amount).toLocaleString()}</span>
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
                                    <span className="text-slate-500">Impuestos</span>
                                    <span>$ {Number(bill.tax_total || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-slate-800 pt-3 border-t border-slate-200">
                                    <span className="text-xl font-normal text-slate-600">Total</span>
                                    <span className="text-2xl">$ {Number(bill.total || 0).toLocaleString()}</span>
                                </div>
                                {withholdings.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                                        {withholdings.map((w: any, idx: number) => (
                                            <div key={idx} className="flex justify-between">
                                                <span className="text-slate-500">{w.name} {Number(w.percent) > 0 ? `${w.percent}%` : ''}</span>
                                                <span className="text-red-500">-$ {Number(w.amount || 0).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-slate-800 mt-2">
                                    <span className="text-lg font-normal text-slate-600">Pagado</span>
                                    <span className="text-xl text-green-600">$ {Number(bill.paid_amount || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-bold text-slate-800">
                                    <span className="text-lg font-normal text-slate-600">Saldo</span>
                                    <span className="text-xl text-primary">$ {balance.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info and Notes */}
                    <div className="flex flex-col md:flex-row justify-between mt-16 text-sm text-slate-600 gap-8 md:gap-12">
                        <div className="w-full md:w-1/2 space-y-10">
                            <div>
                                <h3 className="font-bold text-slate-800 mb-4 text-base">Información adicional</h3>
                                <div className="space-y-3">
                                    <div className="flex flex-col sm:flex-row border-b border-slate-100 pb-2">
                                        <span className="sm:w-1/2 font-bold text-slate-700">Tipo de documento</span>
                                        <span className="sm:w-1/2 font-medium">Factura de compra</span>
                                    </div>
                                </div>
                            </div>

                            {bill.terms_conditions && (
                                <div>
                                    <h3 className="text-black font-bold mb-3 text-base">Términos y condiciones</h3>
                                    <p className="text-xs text-black leading-relaxed text-justify">
                                        {bill.terms_conditions}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="w-full md:w-1/2 space-y-4">
                            <div>
                                <h3 className="text-black font-bold mb-2 text-xs uppercase">Notas:</h3>
                                <div className="bg-gray-50 rounded-md p-3 text-xs text-black leading-relaxed min-h-[60px] border border-gray-200">
                                    {bill.notes || '—'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
