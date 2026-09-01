import Link from "next/link";
import { DianStatusBadge } from "@/components/support-documents/table/columns";
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

interface AdjustmentNoteDetailDocumentProps {
    note: any;
    company: any;
}

export function AdjustmentNoteDetailDocument({ note, company }: AdjustmentNoteDetailDocumentProps) {
    const contact = note?.contact || {};
    const supportDocument = note?.support_document || {};
    const lines: any[] = note?.lines || [];
    const isAnnulment = note?.type_adjustment_note?.code === "2";

    const resolvedLines = lines.map((line: any, idx: number) => {
        const itemName = line.item_snapshot?.name || line.description || `Ítem #${idx + 1}`;
        const itemPrice = Number(line.price || 0);
        const itemQty = Number(line.quantity || 0);
        const itemTotal = Number(line.total || 0);
        const firstTax = (line.taxes || [])[0];
        const taxRate = Number(firstTax?.percent || 0);
        const taxAmount = (line.taxes || []).reduce((sum: number, t: any) => sum + Number(t.tax_amount || 0), 0);
        const taxNameStr = firstTax?.name || 'IVA';

        return { key: line.id ?? idx, itemName, itemPrice, itemQty, itemTotal, taxRate, taxNameStr, taxAmount, hasTax: taxAmount > 0 || taxRate > 0 };
    });

    const globalDiscounts = (note?.discounts || []).filter((d: any) => d.adjustment_note_line_id === null);
    const globalCharges = (note?.charges || []).filter((c: any) => c.scope === 'global');
    const globalDiscountsTotal = globalDiscounts.reduce((sum: number, d: any) => sum + Number(d.amount || 0), 0);
    const globalChargesTotal = globalCharges.reduce((sum: number, c: any) => sum + Number(c.calculated_amount || c.amount || 0), 0);

    return (
        <div className="filter drop-shadow-sm">
            <div
                className="bg-white rounded-lg border border-slate-200 relative overflow-hidden"
                style={{ clipPath: 'polygon(0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 0 100%)' }}
            >
                <div className={`absolute top-6 -left-12 w-48 text-center text-white text-[11px] uppercase tracking-wide font-bold py-1.5 transform -rotate-45 shadow-md ${isAnnulment ? 'bg-red-500' : 'bg-blue-500'}`}>
                    {isAnnulment ? 'ANULACIÓN' : 'CORRECCIÓN'}
                </div>

                <div className="absolute top-0 right-0 w-10 h-10 pointer-events-none" style={{ filter: 'drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.08))' }}>
                    <div className="w-full h-full bg-gradient-to-bl from-slate-200 via-slate-100 to-white border-l border-b border-slate-200/80" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }} />
                </div>

                <div className="p-5 sm:p-8 md:p-10 space-y-8">
                    {/* Doc Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 mb-10 border-b pb-8 border-slate-100 text-center md:text-left">
                        <div className="w-full md:w-1/3 md:pl-8 flex justify-center md:justify-start">
                            <div className="w-64 h-24 relative flex items-center justify-center md:justify-start">
                                <FactucoreLogo variant="icon" alt="Logo de empresa" className="w-full h-full object-contain md:object-left" />
                            </div>
                        </div>

                        <div className="w-full md:w-1/3 md:pt-2 flex flex-col justify-center items-center md:items-stretch">
                            <CompanyHeaderPdfStyle companyProp={company} />
                        </div>

                        <div className="w-full md:w-1/3 flex flex-col items-center md:items-end md:pt-2">
                            <div className="text-slate-500 text-sm uppercase tracking-wide font-semibold text-primary">
                                Nota de ajuste a documento soporte
                            </div>
                            <div className="text-slate-500 text-xl font-light text-primary">
                                No. <span className="font-semibold">{note?.prefix || ''}{note?.number || note?.id}</span>
                            </div>
                            <div className="mt-2 flex items-center justify-center md:justify-end gap-2 uppercase">
                                <span className="text-xs text-slate-400">Estado DIAN:</span>
                                <DianStatusBadge status={note?.dian_status} />
                            </div>
                        </div>
                    </div>

                    {/* Contact + reference info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-slate-600">
                        <div className="space-y-2 border-b border-slate-100 pb-2">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-bold text-slate-700 sm:w-48 shrink-0">Proveedor:</span>
                                <Link href={`/contacts/${contact?.id || note?.contact_id || ''}`} className="font-medium text-slate-800 cursor-pointer hover:bg-slate-100 px-2 py-1 rounded -ml-2 transition-colors self-start">
                                    {contact?.registration_name || contact?.name || 'Sin proveedor'}
                                </Link>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-bold text-slate-700 sm:w-48 shrink-0">Identificación:</span>
                                <span>{contact?.identification_number || '—'}{contact?.verification_digit != null ? `-${contact.verification_digit}` : ''}</span>
                            </div>
                        </div>
                        <div className="space-y-2 border-b border-slate-100 pb-2">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-bold text-slate-700 sm:w-48 shrink-0">Generación:</span>
                                <span>{note?.issue_date || '—'}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-bold text-slate-700 sm:w-48 shrink-0">Documento soporte ajustado:</span>
                                <Link href={`/expenses/support-documents/${supportDocument?.id || ''}`} className="text-primary font-medium hover:underline">
                                    {supportDocument?.prefix || ''}{supportDocument?.number || '—'}
                                </Link>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <span className="font-bold text-slate-700 sm:w-48 shrink-0">Concepto:</span>
                                <span>{note?.type_adjustment_note?.name || note?.discrepancy_response_description || '—'}</span>
                            </div>
                            {note?.cuds && (
                                <div className="flex flex-col sm:flex-row sm:items-start">
                                    <span className="font-bold text-slate-700 sm:w-48 shrink-0">CUDS:</span>
                                    <span className="break-all text-xs">{note.cuds}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Items — mobile */}
                    <div className="mb-10 md:hidden border border-gray-200 rounded-lg divide-y divide-gray-200 overflow-hidden">
                        {resolvedLines.length === 0 ? (
                            <div className="h-24 flex items-center justify-center text-center text-slate-400 text-sm">
                                No hay líneas en esta nota de ajuste
                            </div>
                        ) : (
                            resolvedLines.map((line) => (
                                <div key={line.key} className="p-4 bg-white">
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="text-slate-800 font-medium text-sm">{line.itemName}</span>
                                        <span className="text-sm font-semibold text-slate-900 shrink-0">$ {line.itemTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <div className="text-slate-400">Precio</div>
                                            <div className="text-slate-700 font-medium">$ {line.itemPrice.toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-slate-400">Cantidad</div>
                                            <div className="text-slate-700 font-medium">{line.itemQty}</div>
                                        </div>
                                    </div>
                                    {line.hasTax && (
                                        <div className="mt-2 text-xs text-slate-500">
                                            {line.taxNameStr} {line.taxRate}% (${line.taxAmount.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Items table — desktop */}
                    <div className="mb-10 relative overflow-x-auto border-b border-gray-200 hidden md:block">
                        <Table className="[&_td]:border-b-0">
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead className="text-slate-900 uppercase font-bold border-l border-gray-200">ITEM</TableHead>
                                    <TableHead className="text-slate-900 uppercase font-bold text-right">PRECIO</TableHead>
                                    <TableHead className="text-slate-900 uppercase font-bold text-right">IMPUESTO</TableHead>
                                    <TableHead className="text-slate-900 uppercase font-bold text-center">CANTIDAD</TableHead>
                                    <TableHead className="text-slate-900 uppercase font-bold text-right border-r border-gray-200">TOTAL</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {resolvedLines.map((line) => (
                                    <TableRow key={line.key} className="hover:bg-transparent border-0 border-b-0">
                                        <TableCell className="border-l border-gray-200 text-slate-800 font-medium">{line.itemName}</TableCell>
                                        <TableCell className="text-right">$ {line.itemPrice.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            {line.hasTax ? (
                                                <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                                                    <span>{line.taxNameStr} {line.taxRate}%</span>
                                                    <span className="text-slate-500 text-xs">(${line.taxAmount.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">{line.itemQty}</TableCell>
                                        <TableCell className="text-right border-r border-gray-200 font-medium">$ {line.itemTotal.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                                {resolvedLines.length === 0 && (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={5} className="h-24 text-center text-slate-400 border-l border-r border-gray-200">No hay líneas en esta nota de ajuste</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <div className="w-full md:w-1/3 space-y-6 text-right flex flex-col justify-end">
                            {(globalDiscounts.length > 0 || globalCharges.length > 0) && (
                                <div className="border border-slate-100 rounded-lg p-4 bg-slate-50 text-xs text-left">
                                    <h4 className="font-bold text-slate-700 mb-2 border-b border-slate-200 pb-1 text-right">Ajustes Globales</h4>
                                    {globalDiscounts.map((d: any, idx: number) => (
                                        <div key={`d-${idx}`} className="flex justify-between gap-4 py-1">
                                            <span className="text-slate-600">{d.reason || 'Descuento'}</span>
                                            <span className="font-medium text-red-500">-$ {Number(d.amount).toLocaleString()}</span>
                                        </div>
                                    ))}
                                    {globalCharges.map((c: any, idx: number) => (
                                        <div key={`c-${idx}`} className="flex justify-between gap-4 py-1">
                                            <span className="text-slate-600">{c.reason || 'Cargo'}</span>
                                            <span className="font-medium text-slate-700">$ {Number(c.calculated_amount || c.amount).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span>$ {Number(note?.subtotal || 0).toLocaleString()}</span>
                                </div>
                                {Number(note?.discount_total) > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Descuentos</span>
                                        <span className="text-red-500">-$ {Number(note.discount_total).toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Impuestos</span>
                                    <span>$ {Number(note?.tax_total || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-slate-800 pt-3 border-t border-slate-200">
                                    <span className="text-xl font-normal text-slate-600">Total</span>
                                    <span className="text-2xl">$ {Number(note?.payable_amount || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="flex flex-col md:flex-row justify-between mt-16 text-sm text-slate-600 gap-8 md:gap-12">
                        <div className="w-full md:w-1/2 space-y-4">
                            <h3 className="text-black font-bold mb-2 text-xs uppercase">Notas:</h3>
                            <div className="bg-gray-50 rounded-md p-3 text-xs text-black leading-relaxed min-h-[60px] border border-gray-200">
                                {note?.note || '—'}
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 space-y-4">
                            <h3 className="text-black font-bold mb-2 text-xs uppercase">Observaciones:</h3>
                            <div className="bg-gray-50 rounded-md p-3 text-xs text-black leading-relaxed min-h-[60px] border border-gray-200">
                                {note?.observation || '—'}
                            </div>
                        </div>
                    </div>

                    {/* Signature */}
                    <div className="flex flex-col items-center md:items-start mt-16 text-sm text-slate-600">
                        <div className="w-64">
                            <div className="mb-2">
                                <span className="text-slate-700" style={{ fontFamily: '"Great Vibes", cursive', fontSize: '30px' }}>
                                    {note?.user?.name || 'Administrador'}
                                </span>
                            </div>
                            <div className="border-t border-slate-300 pt-2 text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                                Elaborado por
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-slate-100 text-xs text-black text-center">
                        <p>Resolución DIAN: {note?.resolution?.resolution_text || ''}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
