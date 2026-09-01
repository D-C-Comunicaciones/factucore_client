"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Printer, FileCode, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DianStatusBadge } from "@/components/support-documents/table/columns";
import { useAdjustmentNotesList } from "@/hooks/adjustmentNotes/useAdjustmentNotes";
import { AdjustmentNotesService } from "@/lib/adjustmentNotes";
import { showToast } from "@/components/sonner/CustomToaster";

export default function AdjustmentNotesPage() {
    const router = useRouter();
    const [search, setSearch] = React.useState("");
    const [page, setPage] = React.useState(1);

    const { data, isLoading, isError } = useAdjustmentNotesList({
        params: { page, per_page: 15 },
    });

    const notes = data?.adjustment_notes || [];
    const filtered = search
        ? notes.filter((n: any) => {
            const num = `${n.prefix || ""}${n.number || ""}`.toLowerCase();
            const supplierName = (n.contact?.registration_name || n.contact?.name || "").toLowerCase();
            const q = search.toLowerCase();
            return num.includes(q) || supplierName.includes(q);
        })
        : notes;

    const handlePrint = async (id: number, e?: React.MouseEvent) => {
        e?.stopPropagation();
        try {
            const blob = await AdjustmentNotesService.printPdfBlob(id);
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
        } catch {
            showToast("Error al generar el PDF", "error");
        }
    };

    const handleDownloadXml = async (id: number, filename: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        try {
            const blob = await AdjustmentNotesService.downloadXmlBlob(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${filename}.xml`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch {
            showToast("Error al descargar el XML", "error");
        }
    };

    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 space-y-6">
                <div className="mb-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                        <h1 className="text-lg md:text-xl font-bold text-foreground">Notas de ajuste</h1>
                        <Button
                            size="sm"
                            onClick={() => router.push("/expenses/adjustment-notes/new")}
                            className="bg-primary hover:bg-primary/90 text-white font-medium cursor-pointer text-xs flex items-center gap-1 h-8 px-3 rounded-lg shadow-xs"
                        >
                            <Plus className="w-3.5 h-3.5 mr-0.5" />
                            <span>Nueva nota de ajuste</span>
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Corrige o anula un Documento Soporte ya emitido: rebajas parciales, ajustes de precio o anulación total.
                    </p>
                </div>

                <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-3 border-b border-gray-200">
                        <Input
                            placeholder="Buscar por proveedor o no. de nota"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-xs h-9 text-sm"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <Table className="w-full text-xs text-left">
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead>Número</TableHead>
                                    <TableHead>Documento soporte</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead>Estado DIAN</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-slate-400">Cargando...</TableCell>
                                    </TableRow>
                                ) : isError ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-red-500">Error al cargar las notas de ajuste</TableCell>
                                    </TableRow>
                                ) : filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-slate-400">Sin registros aún</TableCell>
                                    </TableRow>
                                ) : (
                                    filtered.map((note: any) => {
                                        const numberStr = `${note.prefix || ""}${note.number || note.id}`;
                                        const sdNumberStr = note.support_document
                                            ? `${note.support_document.prefix || ""}${note.support_document.number || ""}`
                                            : "-";
                                        const isAnnulment = note.type_adjustment_note?.code === "2";

                                        return (
                                            <TableRow
                                                key={note.id}
                                                className="hover:bg-slate-50 transition-colors cursor-pointer"
                                                onClick={() => router.push(`/expenses/adjustment-notes/${note.id}`)}
                                            >
                                                <TableCell className="font-medium text-slate-900">{numberStr}</TableCell>
                                                <TableCell className="text-slate-600">{sdNumberStr}</TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex px-2 py-1 rounded-full font-medium ${isAnnulment ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {isAnnulment ? 'Anulación' : 'Corrección'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-slate-600">{note.issue_date}</TableCell>
                                                <TableCell className="text-right text-slate-900 font-medium">
                                                    $ {Number(note.total || 0).toLocaleString("es-CO")}
                                                </TableCell>
                                                <TableCell>
                                                    <DianStatusBadge status={note.dian_status} />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            onClick={() => router.push(`/expenses/adjustment-notes/${note.id}`)}
                                                            className="p-1.5 rounded hover:bg-gray-100 text-slate-600 cursor-pointer"
                                                            title="Ver detalle"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => handlePrint(note.id, e)}
                                                            className="p-1.5 rounded hover:bg-gray-100 text-slate-600 cursor-pointer"
                                                            title="Imprimir"
                                                        >
                                                            <Printer className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDownloadXml(note.id, numberStr, e)}
                                                            className="p-1.5 rounded hover:bg-gray-100 text-slate-600 cursor-pointer"
                                                            title="Descargar XML"
                                                        >
                                                            <FileCode className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {data?.pagination && data.pagination.last_page > 1 && (
                        <div className="flex items-center justify-between p-3 border-t border-gray-200 text-xs text-slate-500">
                            <span>Página {data.pagination.current_page} de {data.pagination.last_page}</span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="h-7 text-xs cursor-pointer">Anterior</Button>
                                <Button variant="outline" size="sm" disabled={page >= data.pagination.last_page} onClick={() => setPage((p) => p + 1)} className="h-7 text-xs cursor-pointer">Siguiente</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
