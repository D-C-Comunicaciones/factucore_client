"use client";

import { Plus, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SupportDocumentPageHeaderProps {
    onExport?: () => void;
    onNavigate?: (view: string) => void;
}

export function SupportDocumentPageHeader({ onExport }: SupportDocumentPageHeaderProps) {
    const router = useRouter();

    return (
        <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                <h1 className="text-lg md:text-xl font-bold text-foreground">
                    Documentos soporte
                </h1>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Botón directo de Exportar */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onExport}
                        className="text-xs border-border bg-white text-foreground hover:bg-muted transition-colors cursor-pointer flex items-center gap-1.5 h-8 px-3 rounded-lg"
                    >
                        <FileText className="w-3.5 h-3.5 text-slate-700" />
                        <span>Exportar</span>
                    </Button>

                    {/* Nuevo documento soporte */}
                    <Button
                        size="sm"
                        onClick={() => router.push("/expenses/support-documents/new")}
                        className="bg-primary hover:bg-primary/90 text-white font-medium cursor-pointer text-xs flex items-center gap-1 h-8 px-3 rounded-lg shadow-xs"
                    >
                        <Plus className="w-3.5 h-3.5 mr-0.5" />
                        <span>Nuevo documento soporte</span>
                    </Button>
                </div>
            </div>

            <p className="text-xs text-muted-foreground mt-0.5">
                Crea tus documentos soporte por las compras que realices a sujetos no obligados a facturar.{" "}
                <a
                    href="https://www.dian.gov.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                >
                    Saber más.
                </a>
            </p>

            <div className="mt-1">
                <Link
                    href="/configuration/electronic-billing"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                >
                    <FileText className="w-3.5 h-3.5" />
                    Habilitar documento soporte electrónico
                </Link>
            </div>
        </div>
    );
}
