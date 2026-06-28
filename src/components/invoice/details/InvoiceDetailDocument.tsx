import { DianStatusBadge } from "@/components/invoice/table/columns";
import Link from "next/link";

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
    const isCobrada = bill.is_paid || pendingAmount <= 0;
    const isAccepted = ["ACEPTADA", "PROCESADO CORRECTAMENTE", "APROBADA", "AUTORIZADA"].includes((dianStatus || '').toUpperCase());

    const getNestedValue = (obj: any, key: string) => obj?.[key] ?? obj?.legal_monetary_total?.[key] ?? 0;

    const finalSubtotal = Number(getNestedValue(bill, 'line_extension_amount') || bill.subtotal || 0);
    const finalDiscount = Number(getNestedValue(bill, 'discount_total') || bill.discount_amount || 0);
    const finalTaxes = Number(getNestedValue(bill, 'tax_total') || getNestedValue(bill, 'tax_totals') || bill.tax_amount || 0);
    const finalTotal = Number(getNestedValue(bill, 'payable_amount') || bill.total || 0);

    const allDiscounts = bill.discounts || bill.invoice_snapshot?.template_data?.invoice?.discounts || [];
    const allCharges = bill.charges || bill.invoice_snapshot?.template_data?.invoice?.charges || [];

    const globalDiscounts = allDiscounts.filter((d: any) => !d.invoice_line_id && String(d.charge_indicator) !== "true");
    const lineDiscountsTotal = allDiscounts.filter((d: any) => d.invoice_line_id && String(d.charge_indicator) !== "true").reduce((sum: number, d: any) => sum + Number(d.amount), 0);

    const globalCharges = allCharges.filter((c: any) => c.scope === 'global' || !c.line_id);
    const globalDiscountsTotal = globalDiscounts.reduce((sum: number, d: any) => sum + Number(d.amount), 0);
    const globalChargesTotal = globalCharges.reduce((sum: number, c: any) => sum + Number(c.calculated_amount || c.amount || c.value || 0), 0);

    const grossSubtotal = finalSubtotal + lineDiscountsTotal;


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

                <div className="p-10">
                {/* Doc Header */}
                <div className="flex justify-between items-start mb-10 border-b pb-8 border-slate-100">
                    {/* Logo */}
                    <div className="w-1/3">
                        <div className="bg-slate-200 w-64 h-24 rounded flex items-center justify-center text-slate-400">
                            Logo de empresa
                        </div>
                    </div>

                    {/* Empresa (Centro) */}
                    <div className="w-1/3 text-center flex flex-col items-center justify-center pt-2">
                        <h2 className="text-xl font-bold text-[#0F2843] uppercase">{company?.name || company?.company_name || company?.registration_name || ''}</h2>
                        <div className="text-slate-500 mt-1 text-sm font-medium">
                            NIT: {company?.identification_number || company?.company_id || ''}
                            {(company?.verification_digit != null || company?.dv != null || company?.company_dv != null) &&
                                `-${company?.verification_digit ?? company?.dv ?? company?.company_dv}`
                            }
                        </div>
                        {company?.email && <div className="text-slate-500 text-sm mt-0.5">{company.email}</div>}
                    </div>

                    {/* Factura No & DIAN (Derecha) */}
                    <div className="w-1/3 text-right flex flex-col items-end pt-2">
                        <div className="text-slate-500 text-xl font-light text-primary">
                            No. <span className="font-semibold">{bill.prefix || ''}{bill.number || bill.id}</span>
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
                            <Link href={`/contacts/${customer?.id || bill?.contact_id || ''}`} className="font-medium text-slate-800 cursor-pointer hover:bg-slate-100 px-2 py-1 rounded -ml-2 transition-colors">
                                {customer?.names || customer?.company || customer?.name || customer?.registration_name || ''}
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <span className="font-bold text-slate-700 w-48 shrink-0">
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
                        <div className="flex items-center">
                            <span className="font-bold text-slate-700 w-48 shrink-0">Teléfono:</span>
                            <span>{customer?.phone1 || customer?.phone || ''}</span>
                        </div>
                    </div>
                    <div className="space-y-2 border-b border-slate-100 pb-2">
                        <div className="flex items-center">
                            <span className="font-bold text-slate-700 w-48 shrink-0">Creación:</span>
                            <span>{bill.created_at || ''}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-bold text-slate-700 w-48 shrink-0">Vencimiento:</span>
                            <span>{bill.payment_due_date || bill.billing_reference?.payment_due_date || bill.created_at || ''}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-bold text-slate-700 w-48 shrink-0">Plazo de pago:</span>
                            <span>{bill.payment_term?.name || 'De contado'}</span>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-10">
                    <table className="w-full text-sm text-slate-600">
                        <thead>
                            <tr className="border-b-2 border-slate-100 text-slate-900 uppercase text-xs font-bold">
                                <th className="text-left py-3 px-2">ITEM</th>
                                <th className="text-left py-3 px-2">REFERENCIA</th>
                                <th className="text-right py-3 px-2">PRECIO</th>
                                <th className="text-right py-3 px-2">DESCUENTO</th>
                                <th className="text-right py-3 px-2">IMPUESTO</th>
                                <th className="text-left py-3 px-2">DESCRIPCIÓN</th>
                                <th className="text-center py-3 px-2">CANTIDAD</th>
                                <th className="text-right py-3 px-2">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item: any, idx: number) => {
                                // Soportar tanto item de BD como item del snapshot XML
                                const itemName = item.name || item.item_name || item.item?.name || item.description;
                                const itemId = item.item_id || item.id || item.item?.id;
                                const itemRef = item.code_reference || item.item_code || item.standard_item_code || item.code;
                                const itemPrice = item.price || item.price_amount;
                                const itemQty = item.quantity;
                                const itemTotal = item.total || item.total_line || item.line_extension_amount;
                                const taxRate = item.tax_rate || (item.tax_totals?.[0]?.percent) || (item.taxes?.[0]?.percent) || 0;

                                return (
                                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-2">
                                            {itemId ? (
                                                <Link href={`/items/${itemId}`} className="text-slate-800 font-medium cursor-pointer hover:bg-slate-200 px-2 py-1 rounded -ml-2 transition-colors inline-block">
                                                    {itemName}
                                                </Link>
                                            ) : (
                                                <span className="text-slate-800 font-medium">{itemName}</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-2">{itemRef}</td>
                                        <td className="py-3 px-2 text-right">$ {Number(itemPrice || 0).toLocaleString()}</td>
                                        <td className="py-3 px-2 text-right">$ {Number(item.discount_amount || 0).toLocaleString()}</td>
                                        <td className="py-3 px-2 text-right">{Number(taxRate)} %</td>
                                        <td className="py-3 px-2">{item.description || ''}</td>
                                        <td className="py-3 px-2 text-center">{Number(itemQty)}</td>
                                        <td className="py-3 px-2 text-right">$ {Number(itemTotal || 0).toLocaleString()}</td>
                                    </tr>
                                );
                            })}
                            {items.length === 0 && (
                                <tr><td colSpan={8} className="py-6 text-center text-slate-400">No hay productos en esta factura</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Signature, Adjustments and Subtotals */}
                <div className="flex justify-between text-slate-600 border-t border-slate-100 pt-8">
                    <div className="w-1/3 flex flex-col items-center justify-end">
                        <div className="h-20 w-32 bg-slate-100 rounded flex items-center justify-center text-slate-400 mb-2">
                            {/* Signature Image Placeholder */}
                            <span className="text-xs">Firma</span>
                        </div>
                        <div className="w-3/4 border-t border-slate-300 text-center pt-2 text-xs uppercase">
                            ELABORADO POR
                        </div>
                    </div>

                    <div className="w-1/3 space-y-6 text-right flex flex-col justify-end">
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
                                            <h5 className="font-semibold text-slate-600 text-[11px] uppercase tracking-wider mb-1">Recargos</h5>
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
                                    <span className="text-slate-500">Recargos Globales</span>
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
                        </div>
                    </div>
                </div>

                {/* Additional Info and Notes */}
                <div className="flex justify-between mt-16 text-sm text-slate-600 gap-12">
                    <div className="w-1/2 space-y-10">
                        {/* Información adicional */}
                        <div>
                            <h3 className="font-bold text-slate-800 mb-4 text-base">Información adicional</h3>
                            <div className="space-y-3">
                                <div className="flex border-b border-slate-100 pb-2">
                                    <span className="w-1/2 font-bold text-slate-700">Forma de pago</span>
                                    <span className="w-1/2 font-medium">{bill.payment_form?.name || bill.payment_term?.name || 'Contado'}</span>
                                </div>
                                <div className="flex border-b border-slate-100 pb-2">
                                    <span className="w-1/2 font-bold text-slate-700">Medio de pago</span>
                                    <span className="w-1/2 font-medium">{bill.payment_method?.name || 'Transferencia débito'}</span>
                                </div>
                                <div className="flex border-b border-slate-100 pb-2">
                                    <span className="w-1/2 font-bold text-slate-700">Tipo de factura</span>
                                    <span className="w-1/2 font-medium">Factura de venta</span>
                                </div>
                                <div className="flex border-b border-slate-100 pb-2">
                                    <span className="w-1/2 font-bold text-slate-700">Tipo de operación</span>
                                    <span className="w-1/2 font-medium">Estándar</span>
                                </div>
                                <div className="flex border-b border-slate-100 pb-2">
                                    <span className="w-1/2 font-bold text-slate-700">Orden de compra</span>
                                    <span className="w-1/2 font-medium">{bill.order_reference?.id || bill.order_reference || ''}</span>
                                </div>
                            </div>
                        </div>

                        {/* Términos y condiciones */}
                        <div>
                            <h3 className="text-slate-500 mb-3 text-base">Términos y condiciones</h3>
                            <p className="text-xs text-slate-400 leading-relaxed text-justify">
                                {bill.terms_and_conditions || 'Esta factura se asimila en todos sus efectos a una letra de cambio de conformidad con el Art. 774 del código de comercio. Autorizo que en caso de incumplimiento de esta obligación sea reportado a las centrales de riesgo, se cobraran intereses por mora.'}
                            </p>
                        </div>
                    </div>

                    <div className="w-1/2">
                        <h3 className="text-slate-500 mb-3 text-base">Notas</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            {bill.notes || ''}
                        </p>
                    </div>
                </div>

                {/* Footer notes */}
                <div className="mt-10 pt-6 border-t border-slate-100 text-xs text-slate-400 text-center">
                    <p>Resolución DIAN: {bill.resolution?.resolution_text || bill.resolution_text || ''}</p>
                </div>
            </div>
        </div>
    </div>
);
}
