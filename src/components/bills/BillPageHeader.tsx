"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BillPageHeaderProps {
    onExportClick: () => void;
}

export function BillPageHeader({ onExportClick }: BillPageHeaderProps) {
    const router = useRouter();

    return (
        <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                <h1 className="text-lg md:text-xl font-bold text-foreground">
                    Facturas de compra
                </h1>

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onExportClick}
                        className="text-xs border-border bg-white text-foreground hover:bg-muted transition-colors cursor-pointer flex items-center gap-1.5 h-8 px-3 rounded-lg"
                    >
                        <Download className="w-3.5 h-3.5 text-slate-700" />
                        <span>Exportar</span>
                    </Button>

                    <Button
                        size="sm"
                        onClick={() => router.push("/expenses/bills/new")}
                        className="bg-primary hover:bg-primary/90 text-white font-medium cursor-pointer text-xs flex items-center gap-1 h-8 px-3 rounded-lg shadow-xs"
                    >
                        <Plus className="w-3.5 h-3.5 mr-0.5" />
                        <span>Nueva factura de compra</span>
                    </Button>
                </div>
            </div>

            <p className="text-xs text-muted-foreground">
                Registra las facturas de compra que te emiten tus proveedores (no se envían a la DIAN, solo quedan en tu registro interno).{" "}
                <Link href="#" className="text-primary hover:text-primary/80 font-medium">
                    Saber más.
                </Link>
            </p>
        </div>
    );
}
