"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Printer, FileCode, Pencil, Trash2, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DianStatusBadge } from "@/components/support-documents/table/columns";
import { CommentsAndReminders } from "@/components/shared/CommentsAndReminders";
import { useSupportDocument, useDeleteSupportDocument } from "@/hooks/supportDocuments/useSupportDocuments";
import { SupportDocumentsService } from "@/lib/supportDocuments";
import { showToast } from "@/components/sonner/CustomToaster";

export default function SupportDocumentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const { data: response, isLoading, isError, refetch } = useSupportDocument(id);
    const deleteMutation = useDeleteSupportDocument();

    const doc: any = response?.data || response?.support_document || response || null;

    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                <p className="text-sm">Cargando documento soporte...</p>
            </div>
        );
    }

    if (isError || !doc) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center py-20 text-center px-4">
                <h3 className="text-base font-semibold text-foreground mb-2">No se encontró el documento soporte</h3>
                <p className="text-xs text-muted-foreground mb-4">El documento solicitado no existe o fue eliminado.</p>
                <Button variant="outline" size="sm" onClick={() => router.push("/expenses/support-documents")}>
                    Volver a la lista
                </Button>
            </div>
        );
    }

    const numberStr = `${doc.prefix || ""}${doc.number || doc.id}`;
    const supplier = doc.supplier || doc.customer || doc.contact || {};
    const supplierName = supplier.name || supplier.registration_name || `${supplier.first_name || ''} ${supplier.last_name || ''}`.trim() || doc.supplier_name || "Sin proveedor";
    const supplierId = supplier.identification_number ? `${supplier.identification_number}${supplier.verification_digit != null ? `-${supplier.verification_digit}` : ''}` : doc.supplier_identification;
    const lines = doc.items || doc.lines || doc.support_document_lines || [];
    const withholdings = doc.withholdings || doc.withholding_taxes || [];

    const handlePrint = async () => {
        try {
            const blob = await SupportDocumentsService.printPdfBlob(id);
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
        } catch {
            showToast("Error al generar PDF del documento soporte", "error");
        }
    };

    const handleDownloadXml = async () => {
        try {
            const blob = await SupportDocumentsService.downloadXml(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `DocumentoSoporte_${numberStr}.xml`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch {
            showToast("Error al descargar XML", "error");
        }
    };

    const handleEmitDian = async () => {
        try {
            await SupportDocumentsService.sendDirect({ id: Number(id) });
            showToast("Documento emitido a la DIAN correctamente", "success");
            refetch();
        } catch (err: any) {
            showToast(err?.response?.data?.message || "Error al emitir a la DIAN", "error");
        }
    };

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de eliminar este documento soporte?")) return;
        try {
            await deleteMutation.mutateAsync(id);
            showToast("Documento soporte eliminado", "success");
            router.push("/expenses/support-documents");
        } catch {
            showToast("Error al eliminar", "error");
        }
    };

    return (
        <div className="w-full min-h-screen py-6 px-4 sm:px-6 md:px-8 max-w-[1100px] mx-auto space-y-6">
            {/* Top Action Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/expenses/support-documents")}
                        className="h-8 w-8 text-slate-500 hover:text-foreground cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg md:text-xl font-bold text-foreground">
                                Documento soporte #{numberStr}
                            </h1>
                            <DianStatusBadge status={doc.status_dian} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Creado el {doc.created_at || doc.operation_date || "Hoy"}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/expenses/support-documents/${id}/edit`)}
                        className="text-xs border-border bg-white text-foreground hover:bg-muted cursor-pointer"
                    >
                        <Pencil className="w-3.5 h-3.5 mr-1.5" />
                        Editar
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrint}
                        className="text-xs border-border bg-white text-foreground hover:bg-muted cursor-pointer"
                    >
                        <Printer className="w-3.5 h-3.5 mr-1.5" />
                        Imprimir PDF
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadXml}
                        className="text-xs border-border bg-white text-foreground hover:bg-muted cursor-pointer"
                    >
                        <FileCode className="w-3.5 h-3.5 mr-1.5" />
                        XML
                    </Button>

                    <Button
                        size="sm"
                        onClick={handleEmitDian}
                        className="text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                    >
                        <Send className="w-3.5 h-3.5 mr-1.5" />
                        Emitir a la DIAN
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDelete}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Document Card */}
            <div className="bg-white rounded-xl border border-border p-6 shadow-sm space-y-6">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-border gap-4">
                    <div>
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                            Documento Soporte Electrónico
                        </span>
                        <h2 className="text-2xl font-black text-slate-800 mt-0.5">#{numberStr}</h2>
                        {doc.resolution && (
                            <p className="text-[11px] text-slate-400">
                                Resolución DIAN No. {doc.resolution.resolution_number || ""}
                            </p>
                        )}
                    </div>

                    <div className="text-left sm:text-right text-xs text-slate-600 space-y-1">
                        <p><strong className="text-slate-700">Fecha de operación:</strong> {doc.operation_date || doc.created_at || "-"}</p>
                        <p><strong className="text-slate-700">Fecha de vencimiento:</strong> {doc.payment_due_date || "-"}</p>
                        <p><strong className="text-slate-700">Forma de pago:</strong> {doc.payment_form?.name || (doc.payment_form_id === 2 ? "Crédito" : "Contado")}</p>
                        <p><strong className="text-slate-700">Medio de pago:</strong> {doc.payment_method?.name || "Efectivo"}</p>
                    </div>
                </div>

                {/* Supplier Info */}
                <div className="bg-slate-50/70 p-4 rounded-lg border border-border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    <div>
                        <span className="text-[11px] text-muted-foreground uppercase font-medium">Proveedor</span>
                        <p className="font-semibold text-slate-800 text-sm mt-0.5">{supplierName}</p>
                    </div>
                    <div>
                        <span className="text-[11px] text-muted-foreground uppercase font-medium">Identificación</span>
                        <p className="font-medium text-slate-700 mt-0.5">{supplierId || "-"}</p>
                    </div>
                    <div>
                        <span className="text-[11px] text-muted-foreground uppercase font-medium">Teléfono / Correo</span>
                        <p className="font-medium text-slate-700 mt-0.5">
                            {supplier.phone1 || supplier.phone || doc.supplier_phone || supplier.email || "-"}
                        </p>
                    </div>
                </div>

                {/* Products and Services table */}
                <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                        Detalle de productos y servicios
                    </h4>
                    <div className="border border-border rounded-lg overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-slate-50 border-b border-border text-slate-600 font-medium">
                                <tr>
                                    <th className="p-3">Concepto</th>
                                    <th className="p-3">Descripción</th>
                                    <th className="p-3 text-right">Cantidad</th>
                                    <th className="p-3 text-right">Costo unitario</th>
                                    <th className="p-3 text-right">Descuento</th>
                                    <th className="p-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {lines.map((line: any, idx: number) => {
                                    const qty = Number(line.quantity || line.cantidad || 1);
                                    const price = Number(line.price_amount || line.precio || line.price || 0);
                                    const disc = Number(line.discount_amount || line.discountValue || 0);
                                    const totalLine = Number(line.total || Math.max(0, qty * price - disc));

                                    return (
                                        <tr key={idx}>
                                            <td className="p-3 font-medium text-slate-800">
                                                {line.name || line.item || line.item_name || `Ítem #${idx + 1}`}
                                            </td>
                                            <td className="p-3 text-slate-500">{line.description || "-"}</td>
                                            <td className="p-3 text-right">{qty}</td>
                                            <td className="p-3 text-right">${price.toLocaleString("es-CO")}</td>
                                            <td className="p-3 text-right">{disc > 0 ? `-$${disc.toLocaleString("es-CO")}` : "$0"}</td>
                                            <td className="p-3 text-right font-semibold text-slate-900">
                                                ${totalLine.toLocaleString("es-CO")}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Withholdings details if present */}
                {withholdings.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                            Retenciones aplicadas
                        </h4>
                        <div className="border border-border rounded-lg overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 border-b border-border text-slate-600 font-medium">
                                    <tr>
                                        <th className="p-2.5">Tipo de retención</th>
                                        <th className="p-2.5 text-right">Base</th>
                                        <th className="p-2.5 text-right">Porcentaje</th>
                                        <th className="p-2.5 text-right">Valor retenido</th>
                                        <th className="p-2.5 text-center">Asumida</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {withholdings.map((w: any, idx: number) => (
                                        <tr key={idx}>
                                            <td className="p-2.5 font-medium text-slate-700">{w.name || w.retention_name || "Retención"}</td>
                                            <td className="p-2.5 text-right">${Number(w.base || 0).toLocaleString("es-CO")}</td>
                                            <td className="p-2.5 text-right">{w.percentage || 0}%</td>
                                            <td className="p-2.5 text-right font-semibold text-amber-700">-${Number(w.value || 0).toLocaleString("es-CO")}</td>
                                            <td className="p-2.5 text-center">{w.is_assumed ? "Sí" : "No"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Footer Notes & Totals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                    <div className="space-y-3 text-xs">
                        {doc.authorization_text && (
                            <div>
                                <span className="font-semibold text-slate-700">Texto de autorización:</span>
                                <p className="text-slate-600 mt-0.5">{doc.authorization_text}</p>
                            </div>
                        )}
                        {doc.notes && (
                            <div>
                                <span className="font-semibold text-slate-700">Notas:</span>
                                <p className="text-slate-600 mt-0.5">{doc.notes}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col justify-end space-y-2 text-xs text-slate-700 bg-slate-50/70 p-4 rounded-lg">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Subtotal:</span>
                            <span className="font-medium">${Number(doc.subtotal || doc.total || 0).toLocaleString("es-CO")}</span>
                        </div>
                        {doc.discount_amount > 0 && (
                            <div className="flex justify-between">
                                <span className="text-slate-500">Descuento:</span>
                                <span className="font-medium">-${Number(doc.discount_amount).toLocaleString("es-CO")}</span>
                            </div>
                        )}
                        {doc.withholdings_total > 0 && (
                            <div className="flex justify-between text-amber-700">
                                <span>Retenciones:</span>
                                <span className="font-medium">-${Number(doc.withholdings_total).toLocaleString("es-CO")}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                            <span>Total a pagar:</span>
                            <span>${Number(doc.total || doc.payable_amount || 0).toLocaleString("es-CO")}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Comments and Reminders on Saved Document */}
            <CommentsAndReminders
                type="support_document"
                commentableId={Number(id)}
                requiresSaveFirst={false}
            />
        </div>
    );
}
