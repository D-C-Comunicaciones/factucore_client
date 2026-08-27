"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Pencil,
    Printer,
    Download,
    FileCode,
    Send,
    Loader2,
    ChevronDown,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DebitNoteDetailHeaderProps {
    debitNote: any;
    canEdit: boolean;
    canEmit: boolean;
    isSending: boolean;
    handleSendToDian: () => void;
    handlePrint: () => void;
    handleDownloadPdf: () => void;
    handleDownloadXml: () => void;
    isPrinting?: boolean;
    isDownloadingPdf?: boolean;
    isDownloadingXml?: boolean;
}

export function DebitNoteDetailHeader({
    debitNote,
    canEdit,
    canEmit,
    isSending,
    handleSendToDian,
    handlePrint,
    handleDownloadPdf,
    handleDownloadXml,
    isPrinting,
    isDownloadingPdf,
    isDownloadingXml
}: DebitNoteDetailHeaderProps) {
    const defaultBtnClass =
        "h-9 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-700 cursor-pointer transition-colors shadow-sm font-medium";

    return (
        <div>
            <div className="flex items-center text-sm text-slate-500 mb-2">
                <Link href="/debit-notes" className="hover:text-primary transition-colors">
                    Notas de débito
                </Link>
                <span className="mx-2">&gt;</span>
                <span className="text-slate-700 font-medium">Detalle de nota débito</span>
            </div>

            <div className="flex flex-wrap items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-[#0F2843]">
                    Nota débito {debitNote.prefix || ""}{debitNote.number || debitNote.id}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                    {canEdit && (
                        <Button variant="outline" size="sm" asChild className={defaultBtnClass}>
                            <Link href={`/debit-notes/${debitNote.id}/edit`}>
                                <Pencil className="w-4 h-4 mr-2" /> Editar
                            </Link>
                        </Button>
                    )}

                    {canEmit && (
                        <Button
                            variant="default"
                            size="sm"
                            className="relative h-9 bg-[#2b5deb] hover:bg-[#204bc2] text-white border-transparent cursor-pointer shadow-sm disabled:opacity-100 disabled:bg-[#2b5deb]"
                            onClick={handleSendToDian}
                            disabled={isSending}
                        >
                            {isSending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                                    <span className="invisible flex items-center"><Send className="w-4 h-4 mr-2" /> Emitir</span>
                                </>
                            ) : (
                                <><Send className="w-4 h-4 mr-2" />
                                Emitir</>
                            )}
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        className={`relative ${defaultBtnClass} disabled:opacity-100 disabled:bg-white`}
                        onClick={handlePrint}
                        disabled={isPrinting}
                    >
                        {isPrinting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2b5deb]" />
                                <span className="invisible flex items-center"><Printer className="w-4 h-4 mr-2" /> Imprimir</span>
                            </>
                        ) : (
                            <><Printer className="w-4 h-4 mr-2" /> Imprimir</>
                        )}
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className={`relative ${defaultBtnClass} disabled:opacity-100 disabled:bg-white`}
                        onClick={handleDownloadPdf}
                        disabled={isDownloadingPdf}
                    >
                        {isDownloadingPdf ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2b5deb]" />
                                <span className="invisible flex items-center"><Download className="w-4 h-4 mr-2" /> Descargar PDF</span>
                            </>
                        ) : (
                            <><Download className="w-4 h-4 mr-2" /> Descargar PDF</>
                        )}
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className={defaultBtnClass}>
                                Más acciones <ChevronDown className="w-4 h-4 ml-2" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 text-slate-700 bg-white">
                            <DropdownMenuItem
                                className={`relative cursor-pointer hover:bg-slate-50 ${isDownloadingXml ? 'opacity-100 pointer-events-none' : ''}`}
                                onClick={handleDownloadXml}
                                disabled={isDownloadingXml}
                            >
                                {isDownloadingXml ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2b5deb]" />
                                        <span className="invisible flex items-center"><FileCode className="w-4 h-4 mr-2" /> Descargar XML</span>
                                    </>
                                ) : (
                                    <><FileCode className="w-4 h-4 mr-2" /> Descargar XML</>
                                )}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}
