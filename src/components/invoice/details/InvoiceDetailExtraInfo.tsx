import { FileText } from "lucide-react";

interface InvoiceDetailExtraInfoProps {
    bill: any;
}

export function InvoiceDetailExtraInfo({ bill }: InvoiceDetailExtraInfoProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-primary" /> Información adicional
                </h3>
                <div className="text-slate-500">
                    {bill.observation || 'No hay observaciones.'}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                    Vendedor y Bodega
                </h3>
                <div className="space-y-2">
                    <div className="flex justify-between border-b border-slate-100 pb-2 items-center">
                        <span className="font-bold text-slate-700">Vendedor:</span>
                        <span className="text-slate-800 font-medium cursor-pointer hover:bg-slate-100 px-2 py-1 rounded -mr-2 transition-colors">{bill.seller?.name || 'No asignado'}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                        <span className="font-bold text-slate-700">Bodega:</span>
                        <span className="text-right ml-4">
                            {(() => {
                                const inventoryDocuments = bill.inventory_documents || bill.invoice_snapshot?.template_data?.invoice?.inventory_documents || [];
                                if (inventoryDocuments.length === 0) return 'Principal';
                                
                                const warehouseNames = inventoryDocuments
                                    .map((doc: any) => doc?.source_warehouse?.name)
                                    .filter((name: any, index: number, self: any) => name && self.indexOf(name) === index);
                                
                                return warehouseNames.length > 0 ? warehouseNames.join(', ') : 'Principal';
                            })()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                    Archivos adjuntos
                </h3>
                <div className="text-slate-400 flex flex-col items-center justify-center py-4 border-2 border-dashed border-slate-200 rounded">
                    <span>No hay archivos adjuntos</span>
                    <span className="text-primary cursor-pointer hover:underline mt-1 text-xs">Agregar archivo</span>
                </div>
            </div>
        </div>
    );
}
