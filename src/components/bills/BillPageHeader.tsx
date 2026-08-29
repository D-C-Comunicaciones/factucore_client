"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ChevronDown,
    Download,
    UploadCloud,
    Plus,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface BillPageHeaderProps {
    onExportClick: () => void;
    onImportExcelClick: () => void;
    onUploadFileClick: () => void;
}

export function BillPageHeader({
    onExportClick,
    onImportExcelClick,
    onUploadFileClick,
}: BillPageHeaderProps) {
    const router = useRouter();

    return (
        <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                {/* Title */}
                <h1 className="text-lg md:text-xl font-bold text-foreground">
                    Facturas de compra
                </h1>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Más acciones dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-xs border-border bg-white text-foreground hover:bg-primary/10 hover:text-foreground transition-colors cursor-pointer relative"
                            >
                                Más acciones
                                <ChevronDown className="w-3 h-3 ml-1" />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full border border-white" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 p-1 bg-white shadow-xl rounded-xl border border-border">
                            <DropdownMenuItem
                                onClick={onExportClick}
                                className="flex items-center gap-2 px-3 py-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted"
                            >
                                <Download className="w-4 h-4 text-slate-500" />
                                <span>Exportar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={onImportExcelClick}
                                className="flex items-center justify-between px-3 py-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted"
                            >
                                <div className="flex items-center gap-2">
                                    <UploadCloud className="w-4 h-4 text-slate-500" />
                                    <span>Importar desde excel</span>
                                </div>
                                <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 text-[10px] px-1.5 py-0 rounded">
                                    Nuevo
                                </Badge>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Nueva factura de compra dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-white font-medium cursor-pointer flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3 mr-1" />
                                Nueva factura de compra
                                <ChevronDown className="w-3 h-3 ml-1" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-1 bg-white shadow-xl rounded-xl border border-border">
                            <DropdownMenuItem
                                onClick={() => router.push("/expenses/bills/new")}
                                className="flex items-center gap-2 px-3 py-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted"
                            >
                                <Plus className="w-4 h-4 text-slate-500" />
                                <span>Crear manualmente</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={onUploadFileClick}
                                className="flex items-center gap-2 px-3 py-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted"
                            >
                                <Sparkles className="w-4 h-4 text-slate-500" />
                                <span>Desde un archivo o imagen</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground">
                Registra las compras que realizas a tus proveedores y actualiza tu inventario de forma automática.{" "}
                <Link
                    href="#"
                    className="text-primary hover:text-primary/80 font-medium"
                >
                    Saber más.
                </Link>
            </p>
        </div>
    );
}
