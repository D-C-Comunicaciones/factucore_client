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

    return (
        <div className="filter drop-shadow-sm">
            <div className="bg-white rounded-lg border border-slate-200 relative overflow-hidden">
                <div className="p-10">
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
                                Cotización No. <span className="font-semibold">{quote.prefix || ''}{quote.number || quote.id}</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-4 mb-10 text-slate-600">
                        <div className="space-y-2 border-b border-slate-100 pb-2">
                            <div className="flex items-center">
                                <span className="font-bold text-slate-700 w-48 shrink-0">Cliente:</span>
                                <Link href={`/contacts/${customer?.id || quote?.contact_id || ''}`} className="font-medium text-slate-800 cursor-pointer hover:bg-slate-100 px-2 py-1 rounded -ml-2 transition-colors">
                                    {customer?.names || customer?.company || customer?.name || customer?.registration_name || ''}
                                </Link>
                            </div>
                            <div className="flex items-center">
                                <span className="font-bold text-slate-700 w-48 shrink-0">
                                    {(() => {
                                        const orgCode = customer?.type_organization?.code || quote?.contact?.type_organization_id || customer?.type_organization_id;
                                        const isJuridica = String(orgCode) === "1";

                                        if (isJuridica) return "NIT";

                                        const docName = customer?.type_document_identification?.name || quote?.contact?.type_document_identification?.name;
                                        return docName || "Cédula de ciudadanía";
                                    })()}:
                                </span>
                                <span>
                                    {customer?.identification || customer?.company_id || customer?.identification_number || ''}
                                    {(() => {
                                        const dv = customer?.verification_digit ?? quote?.contact?.verification_digit;
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
                                <span className="font-bold text-slate-700 w-32 shrink-0">Creación:</span>
                                <span>{quote.created_at || ''}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="font-bold text-slate-700 w-32 shrink-0">Vencimiento:</span>
                                <span>{quote.payment_due_date || quote.expiration_date || quote.created_at || ''}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="font-bold text-slate-700 w-32 shrink-0">Plazo de pago:</span>
                                <span>{quote.payment_term?.name || 'De contado'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-10 relative overflow-x-auto border-b border-gray-200">
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
                                {items.map((item: any, idx: number) => {
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

                                    // Discount calculations
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

                                    // Tax calculations
                                    const taxAmount = item.taxes?.length
                                        ? item.taxes.reduce((sum: number, t: any) => sum + Number(t.tax_amount || 0), 0)
                                        : item.tax_totals?.length 
                                            ? item.tax_totals.reduce((sum: number, t: any) => sum + Number(t.tax_amount || 0), 0)
                                            : Number(item.tax_amount || 0);

                                    return (
                                        <TableRow key={idx} className="hover:bg-transparent border-0 border-b-0">
                                            <TableCell className="border-l border-gray-200">
                                                {itemId ? (
                                                    <Link href={`/items/${itemId}`} className="text-slate-800 font-medium cursor-pointer hover:bg-slate-200 px-2 py-1 rounded -ml-2 transition-colors inline-block">
                                                        {itemName}
                                                    </Link>
                                                ) : (
                                                    <span className="text-slate-800 font-medium">{itemName}</span>
                                                )}
                                            </TableCell>
                                            <TableCell>{itemRef}</TableCell>
                                            <TableCell className="text-right">$ {Number(itemPrice || 0).toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                {discountAmount > 0 ? (
                                                    <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                                                        <span>{discountPercent % 1 !== 0 ? discountPercent.toFixed(2) : discountPercent}%</span>
                                                        <span className="text-slate-500 text-xs">
                                                            (${discountAmount.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {Number(taxRate) > 0 || taxAmount > 0 ? (
                                                    <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                                                        <span>{taxName} {Number(taxRate)}%</span>
                                                        <span className="text-slate-500 text-xs">
                                                            (${taxAmount.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>{item.description || ''}</TableCell>
                                            <TableCell className="text-center">{Number(itemQty)}</TableCell>
                                            <TableCell className="text-right border-r border-gray-200">$ {Number(itemTotal || 0).toLocaleString()}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                {items.length === 0 && (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={8} className="h-24 text-center text-slate-400 border-l border-r border-gray-200">No hay productos en esta cotización</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Signature, Adjustments and Subtotals */}
                    <div className="flex justify-between text-slate-600 border-t border-slate-100 pt-8">
                        <div className="w-1/3 flex flex-col items-center justify-end pb-4">
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

                        <div className="w-1/3 space-y-6 text-right flex flex-col justify-end">
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
                    <div className="flex justify-between mt-16 text-sm text-slate-600 gap-12">
                        <div className="w-1/2 space-y-10">
                            {/* Información adicional */}
                            <div>
                                <h3 className="font-bold text-slate-800 mb-4 text-base">Información adicional</h3>
                                <div className="space-y-3">
                                    <div className="flex border-b border-slate-100 pb-2">
                                        <span className="w-1/2 font-bold text-slate-700">Forma de pago</span>
                                        <span className="w-1/2 font-medium">{quote.payment_form?.name || quote.payment_term?.name || 'Contado'}</span>
                                    </div>
                                    <div className="flex border-b border-slate-100 pb-2">
                                        <span className="w-1/2 font-bold text-slate-700">Medio de pago</span>
                                        <span className="w-1/2 font-medium">{quote.payment_method?.name || 'Transferencia débito'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Términos y condiciones */}
                            <div>
                                <h3 className="text-black font-bold mb-3 text-base">Términos y condiciones</h3>
                                <p className="text-xs text-black leading-relaxed text-justify whitespace-pre-wrap">
                                    {quote.terms_and_conditions || 'Ninguno'}
                                </p>
                            </div>
                        </div>

                        <div className="w-1/2 space-y-4">
                            <div>
                                <h3 className="text-black font-bold mb-2 text-xs uppercase">Notas:</h3>
                                <div className="bg-gray-50 rounded-md p-3 text-xs text-black leading-relaxed min-h-[60px] border border-gray-200 whitespace-pre-wrap">
                                    {quote.notes || quote.observation || '—'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
