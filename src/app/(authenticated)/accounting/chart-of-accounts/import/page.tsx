"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
    AlertTriangle,
    Check,
    ChevronDown,
    ChevronRight as ChevronRightIcon,
    ChevronUp,
    Copy,
    Download,
    File as FileIcon,
    FileCheck2,
    HelpCircle,
    Loader2,
    Plus,
    Redo2,
    Sparkles,
    Trash2,
    Undo2,
    Upload,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FactucoreLogo } from "@/components/brand/FactucoreLogo";
import { showToast } from "@/components/sonner/CustomToaster";
import { envs } from "@/config/env";
import { AuthService } from "@/lib/auth";
import { accountImportApi, BalanceTransfer, ExistingAccountBalance, ImportRow, ImportWarning, UsageDefault } from "@/lib/accountImport";
import { useAccountUsages } from "@/hooks/accounting/useAccounting";

const ELEMENT_OPTIONS = [
    { value: "Activos", label: "Activos" },
    { value: "Pasivos", label: "Pasivos" },
    { value: "Patrimonio", label: "Patrimonio" },
    { value: "Ingresos", label: "Ingresos" },
    { value: "Gastos", label: "Gastos" },
    { value: "Costos", label: "Costos" },
    { value: "Costos de Producción", label: "Costos de Producción" },
    { value: "Cuentas de orden", label: "Cuentas de orden" },
];

const NATURE_OPTIONS = [
    { value: "debito", label: "Débito" },
    { value: "credito", label: "Crédito" },
];

const TIPO_OPTIONS = [
    { value: "movimiento", label: "Cuenta de movimiento" },
    { value: "mayor", label: "Cuenta mayor" },
];

const STATIC_ELEMENT_LOOKUP: Record<string, string> = {
    activos: "Activos", pasivos: "Pasivos", patrimonio: "Patrimonio", ingresos: "Ingresos",
    gastos: "Gastos", costos: "Costos", "costos de producción": "Costos de Producción",
    orden: "Cuentas de orden", "cuentas de orden": "Cuentas de orden",
};

const staticBase = (() => {
    try {
        return new URL(envs.apiUrl).origin;
    } catch {
        return "";
    }
})();

let rowKeySeq = 0;
function makeRowKey() {
    rowKeySeq += 1;
    return `row-${rowKeySeq}`;
}

function StepShell({
    title,
    stepLabel,
    onClose,
    onBack,
    onContinue,
    continueLabel = "Continuar",
    continueDisabled = false,
    continuePending = false,
    toolbar,
    dense = false,
    children,
}: {
    title: string;
    stepLabel: string;
    onClose: () => void;
    onBack?: () => void;
    onContinue?: () => void;
    continueLabel?: string;
    continueDisabled?: boolean;
    continuePending?: boolean;
    toolbar?: React.ReactNode;
    dense?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="w-full h-full">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full">
                <div className={`flex items-center border-b border-gray-200 shrink-0 gap-4 ${dense ? "px-4 py-2" : "px-6 py-4"}`}>
                    <h1 className="text-base font-bold text-foreground shrink-0">{title}</h1>
                    {toolbar && <div className="flex-1 flex items-center justify-center min-w-0">{toolbar}</div>}
                    <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-muted-foreground">{stepLabel}</span>
                        {onBack && (
                            <Button variant="outline" size="sm" onClick={onBack} className="h-8 text-xs cursor-pointer">
                                Volver
                            </Button>
                        )}
                        {onContinue && (
                            <Button
                                size="sm"
                                onClick={onContinue}
                                disabled={continueDisabled || continuePending}
                                className="h-8 text-xs bg-primary hover:bg-primary/90 text-white cursor-pointer"
                            >
                                {continuePending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                                {continueLabel}
                            </Button>
                        )}
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
}

export default function ImportChartOfAccountsPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: accountUsages } = useAccountUsages();

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showRecommendations, setShowRecommendations] = useState(false);
    const [parsing, setParsing] = useState(false);

    const [rows, setRows] = useState<(ImportRow & { key: string })[]>([]);
    const [warnings, setWarnings] = useState<ImportWarning[]>([]);

    // Undo/redo + row copy for the "Revisión de catálogo" spreadsheet-style grid.
    const [historyPast, setHistoryPast] = useState<(ImportRow & { key: string })[][]>([]);
    const [historyFuture, setHistoryFuture] = useState<(ImportRow & { key: string })[][]>([]);
    const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);
    const [clipboardCount, setClipboardCount] = useState(0);
    const [showResumenPanel, setShowResumenPanel] = useState(true);
    const [openResumenGroups, setOpenResumenGroups] = useState<Record<string, boolean>>({});

    const [existingAccounts, setExistingAccounts] = useState<ExistingAccountBalance[] | null>(null);
    const [loadingMovements, setLoadingMovements] = useState(false);
    const [balanceMap, setBalanceMap] = useState<Record<number, string>>({});

    const [usageDefaultMap, setUsageDefaultMap] = useState<Record<string, string>>({});

    const [showVolverConfirm, setShowVolverConfirm] = useState(false);

    const [importing, setImporting] = useState(false);
    const [successSummary, setSuccessSummary] = useState<{ accounts: number; transfers: number; usages: number } | null>(null);

    const companyName = useMemo(() => {
        const comp: any = AuthService.getCompany();
        return comp?.company_name || comp?.name || "tu empresa";
    }, []);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const postableOptions = useMemo(
        () => rows.filter((r) => r.tipo_cuenta === "movimiento" && r.codigo).map((r) => ({ value: r.codigo, label: `${r.codigo} - ${r.nombre}` })),
        [rows]
    );

    const handleClose = () => router.push("/accounting/chart-of-accounts");

    // "Volver" from any review step discards everything parsed so far and restarts at the
    // upload screen — always behind a confirm, since going back genuinely loses the edits made
    // in the grid (Nivel/Código/Elemento/... corrections, balance mappings, usage defaults).
    const handleVolverClick = () => setShowVolverConfirm(true);
    const confirmVolver = () => {
        setShowVolverConfirm(false);
        setStep(1);
        setFile(null);
        setRows([]);
        setWarnings([]);
        setExistingAccounts(null);
        setBalanceMap({});
        setUsageDefaultMap({});
        setHistoryPast([]);
        setHistoryFuture([]);
        setSelectedRowKey(null);
        setClipboardCount(0);
        setShowResumenPanel(true);
        setOpenResumenGroups({});
    };

    // ---------- Step 1: Cargar archivo ----------
    const handleFileSelected = (f: File | null) => setFile(f);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFileSelected(f);
    };

    const handleContinueStep1 = async () => {
        if (!file) return;
        setParsing(true);
        try {
            const res: any = await accountImportApi.parse(file);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "No fue posible leer el archivo");
            }
            const parsedRows: ImportRow[] = res.data?.rows ?? [];
            setRows(parsedRows.map((r) => ({ ...r, key: makeRowKey() })));
            setWarnings(res.data?.warnings ?? []);
            setStep(2);
        } catch (error: any) {
            showToast(error?.message || "Error al procesar el archivo", "error");
        } finally {
            setParsing(false);
        }
    };

    // ---------- Step 2: Revisión de catálogo ----------
    // Every mutation snapshots the grid before it changes, so Deshacer/Rehacer can step through
    // the edit history the same way they would in a spreadsheet.
    const pushHistory = () => {
        setHistoryPast((prev) => [...prev, rows]);
        setHistoryFuture([]);
    };

    const updateRow = (key: string, field: keyof ImportRow, value: any) => {
        pushHistory();
        setRows((prev) => prev.map((r) => (r.key === key ? { ...r, [field]: value } : r)));
    };

    const addRow = () => {
        pushHistory();
        setRows((prev) => [
            ...prev,
            { key: makeRowKey(), nivel: null, codigo: "", nombre: "", elemento: "Activos", naturaleza: "debito", uso_cuenta: "", tipo_cuenta: "movimiento", ver_saldos_por_terceros: false },
        ]);
    };

    const removeRow = (key: string) => {
        pushHistory();
        setRows((prev) => prev.filter((r) => r.key !== key));
    };

    const handleUndo = () => {
        if (historyPast.length === 0) return;
        const previous = historyPast[historyPast.length - 1];
        setHistoryPast((prev) => prev.slice(0, -1));
        setHistoryFuture((prev) => [rows, ...prev]);
        setRows(previous);
    };

    const handleRedo = () => {
        if (historyFuture.length === 0) return;
        const next = historyFuture[0];
        setHistoryFuture((prev) => prev.slice(1));
        setHistoryPast((prev) => [...prev, rows]);
        setRows(next);
    };

    // Clicking a row's number cell selects it (Excel-style row selection); Duplicar inserts a
    // copy of that row right below it, with a blank código (it must stay unique).
    const handleDuplicateRow = () => {
        const idx = rows.findIndex((r) => r.key === selectedRowKey);
        const sourceIdx = idx !== -1 ? idx : rows.length - 1;
        const source = rows[sourceIdx];
        if (!source) return;
        pushHistory();
        const copy = { ...source, key: makeRowKey(), codigo: "" };
        setRows((prev) => [...prev.slice(0, sourceIdx + 1), copy, ...prev.slice(sourceIdx + 1)]);
        setClipboardCount((c) => c + 1);
        setSelectedRowKey(copy.key);
    };

    const handleDownloadGrid = () => {
        const header = ["Nivel", "Código", "Nombre", "Elemento", "Naturaleza", "Uso de cuenta", "Tipo de cuenta"];
        const csvEscape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
        const lines = [header.map(csvEscape).join(",")];
        rows.forEach((r) => {
            lines.push(
                [
                    r.nivel ?? "",
                    r.codigo,
                    r.nombre,
                    r.elemento,
                    r.naturaleza === "credito" ? "Crédito" : "Débito",
                    r.uso_cuenta,
                    r.tipo_cuenta === "mayor" ? "Cuenta mayor" : "Cuenta de movimiento",
                ]
                    .map(csvEscape)
                    .join(",")
            );
        });
        const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "catalogo-cuentas-revision.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Clicking a warning in the Resumen panel jumps the grid to its first flagged row and
    // flashes it briefly so it's easy to spot among hundreds of rows.
    const [highlightedRowIndex, setHighlightedRowIndex] = useState<number | null>(null);
    const scrollToImportRow = (rowIndex: number | undefined) => {
        if (rowIndex === undefined) return;
        const el = document.getElementById(`import-row-${rowIndex}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedRowIndex(rowIndex);
        window.setTimeout(() => setHighlightedRowIndex((cur) => (cur === rowIndex ? null : cur)), 2000);
    };

    const cellWarningsByRow = useMemo(() => {
        const map = new Map<number, Set<string>>();
        warnings.forEach((w) => {
            w.rows.forEach((idx) => {
                if (!map.has(idx)) map.set(idx, new Set());
                if (w.column) map.get(idx)!.add(w.column);
            });
        });
        return map;
    }, [warnings]);

    // Groups the flat warnings list by column ("Columna Naturaleza", "Columna Código", ...) for
    // the collapsible Resumen panel, mirroring the reference layout.
    const COLUMN_LABELS: Record<string, string> = { codigo: "Código", naturaleza: "Naturaleza", nombre: "Nombre", elemento: "Elemento", uso_cuenta: "Uso de cuenta" };
    const warningGroups = useMemo(() => {
        const groups = new Map<string, ImportWarning[]>();
        warnings.forEach((w) => {
            const key = w.column ?? "general";
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key)!.push(w);
        });
        return Array.from(groups.entries()).map(([column, items]) => ({
            column,
            label: COLUMN_LABELS[column] || (column.charAt(0).toUpperCase() + column.slice(1)),
            items,
        }));
    }, [warnings]);

    const handleContinueStep2 = () => {
        // Código and Nombre are both optional per row — a group/header row with neither is still
        // created (Alegra's own reference catalogs include rows like that). Only real, non-blank
        // duplicate códigos are blocked, since two accounts can't share a código.
        const codes = rows.map((r) => r.codigo.trim()).filter((c) => c !== "");
        const dupes = codes.filter((c, i) => codes.indexOf(c) !== i);
        if (dupes.length > 0) {
            showToast(`Hay códigos repetidos: ${[...new Set(dupes)].join(", ")}`, "error");
            return;
        }
        setStep(3);
        if (existingAccounts === null) {
            setLoadingMovements(true);
            accountImportApi
                .movements()
                .then((res: any) => setExistingAccounts(res?.data?.accounts ?? []))
                .catch(() => setExistingAccounts([]))
                .finally(() => setLoadingMovements(false));
        }
    };

    // ---------- Step 3: Transferencia de saldos ----------
    const handleContinueStep3 = () => {
        const unmapped = (existingAccounts || []).filter((a) => a.has_movements && !balanceMap[a.id]);
        if (unmapped.length > 0) {
            showToast(`Falta asignar cuenta destino para: ${unmapped.map((a) => a.name).join(", ")}`, "error");
            return;
        }
        setStep(4);
    };

    // ---------- Step 4: Comportamientos automáticos ----------
    const handleImport = async () => {
        setImporting(true);
        try {
            const payloadRows: ImportRow[] = rows.map(({ key, ...rest }) => rest);
            const balance_transfers: BalanceTransfer[] = Object.entries(balanceMap)
                .filter(([, code]) => code)
                .map(([oldId, code]) => ({ old_account_id: Number(oldId), new_code: code }));
            const usage_defaults: UsageDefault[] = Object.entries(usageDefaultMap)
                .filter(([, code]) => code)
                .map(([usageCode, code]) => ({ usage_code: usageCode, new_code: code }));

            const res: any = await accountImportApi.execute({ rows: payloadRows, balance_transfers, usage_defaults });
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "No fue posible importar el catálogo");
            }
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            setSuccessSummary({
                accounts: res.data?.imported ?? payloadRows.length,
                transfers: balance_transfers.length,
                usages: usage_defaults.length,
            });
        } catch (error: any) {
            showToast(error?.message || "Error al importar el catálogo", "error");
        } finally {
            setImporting(false);
        }
    };

    const templateHref = (kind: "puc" | "niif") =>
        `${staticBase}/templates/accounting/factucore-plantilla-importacion-catalogo-cuentas-${kind}.xlsx`;

    // Fetched and saved via a throwaway blob link instead of a plain <a href> so hovering the
    // trigger never reveals the backend's real URL in the browser's status bar.
    const downloadTemplate = async (kind: "puc" | "niif") => {
        try {
            const res = await fetch(templateHref(kind));
            if (!res.ok) throw new Error("No fue posible descargar la plantilla");
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `factucore-plantilla-importacion-catalogo-cuentas-${kind}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (error: any) {
            showToast(error?.message || "Error al descargar la plantilla", "error");
        }
    };

    if (!mounted) return null;

    const content = (
        <div
            className="fixed inset-0 z-[45] bg-black/25 backdrop-blur-sm flex items-center justify-center p-[4px]"
            onKeyDown={(e) => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); } }}
        >
            {step === 1 ? (
                <div className="w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                  <div className="flex-1 min-h-0 flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 bg-white flex flex-col overflow-y-auto">
                        <div className="h-[68px] shrink-0 flex items-center justify-between px-8">
                            <button onClick={handleClose} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-slate-500 hover:bg-gray-50 cursor-pointer">
                                <X className="w-4 h-4" />
                            </button>
                            <button onClick={() => showToast("Ayuda estará disponible próximamente", "info")} className="text-sm text-primary hover:bg-primary/10 rounded-full px-4 py-1.5 cursor-pointer flex items-center gap-1.5 transition-colors">
                                <HelpCircle className="w-3.5 h-3.5" /> Ayuda
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-8 w-full max-w-2xl mx-auto">
                            <FactucoreLogo variant="icon" className="h-10 w-auto mb-8" />
                            <h2 className="text-3xl font-bold text-foreground mb-4">Importa tu catálogo de cuentas</h2>
                            <p className="text-sm text-muted-foreground mb-6">
                                Importa tu catálogo y asigna el uso que tendrá cada cuenta contable.
                            </p>
                            <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
                                <span className="text-primary">✦</span>
                                <span>Carga archivos en <span className="font-semibold text-foreground">cualquier formato</span>, nosotros lo ajustaremos automáticamente.</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Download className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                <span>
                                    Descarga el{" "}
                                    <button type="button" onClick={() => downloadTemplate("niif")} className="text-primary cursor-pointer">Catálogo de ejemplo NIIF</button>{" "}
                                    o{" "}
                                    <button type="button" onClick={() => downloadTemplate("puc")} className="text-primary cursor-pointer">Catálogo de ejemplo PUC</button>{" "}
                                    o usa nuestras plantillas como referencia.
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 bg-gray-50 flex flex-col overflow-y-auto">
                        <div className="h-[68px] shrink-0 flex items-center justify-between px-8">
                            <span className="text-sm font-medium text-foreground flex items-center gap-2">
                                <FileIcon className="w-4 h-4 text-amber-500" /> Catálogo de cuentas
                            </span>
                            <button onClick={() => showToast("Guías estarán disponibles próximamente", "info")} className="text-sm text-primary hover:underline cursor-pointer">
                                Guías
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col px-8 md:px-16 py-8 w-full max-w-2xl mx-auto">
                          <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-foreground">Cargar el archivo</span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="h-8 px-4 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/15 rounded-full cursor-pointer flex items-center transition-colors">
                                            Descargar plantilla
                                            <ChevronDown className="w-3.5 h-3.5 ml-1.5" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => downloadTemplate("puc")} className="cursor-pointer">
                                            <FileIcon className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                            Descargar plantilla PUC
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => downloadTemplate("niif")} className="cursor-pointer">
                                            <FileIcon className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                            Descargar plantilla NIIF
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                className={`bg-white border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-gray-200"}`}
                            >
                                {file ? (
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2.5 w-full max-w-md">
                                        <FileIcon className="w-4 h-4 text-slate-500 shrink-0" />
                                        <div className="flex-1 text-left min-w-0">
                                            <div className="text-sm text-foreground truncate">{file.name}</div>
                                            <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} MB</div>
                                        </div>
                                        <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500 cursor-pointer">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-9 h-9 text-slate-300 mb-3" />
                                        <p className="text-sm font-medium text-foreground">Arrastra tu archivo hasta aquí</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Formatos válidos: Excel (máx. 2MB), CSV y TXT
                                        </p>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-primary hover:bg-primary/10 rounded-full px-4 py-1.5 text-sm mt-2 cursor-pointer transition-colors no-underline"
                                        >
                                            O selecciónalo de tu computador
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".xlsx,.xls,.csv,.txt"
                                            className="hidden"
                                            onChange={(e) => handleFileSelected(e.target.files?.[0] || null)}
                                        />
                                    </>
                                )}
                            </div>

                            <div className="border border-gray-200 rounded-lg mt-4 bg-white">
                                <button
                                    onClick={() => setShowRecommendations((v) => !v)}
                                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-foreground cursor-pointer"
                                >
                                    Recomendaciones
                                    {showRecommendations ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                                {showRecommendations && (
                                    <ul className="px-4 pb-3 text-xs text-muted-foreground list-disc list-inside space-y-1">
                                        <li>Las nuevas cuentas importadas reemplazarán por completo a las cuentas contables existentes.</li>
                                        <li>Evita eliminar o cambiar el orden de las columnas de la plantilla.</li>
                                        <li>El orden y jerarquía de tus cuentas se define por la columna Código (usando prefijos, ej. 1105 es hija de 11).</li>
                                        <li>Si las cuentas actuales tienen movimientos, en el paso siguiente elegirás la cuenta a la que se trasladarán.</li>
                                        <li>Podrás definir el uso que tendrá cada cuenta y sus comportamientos automáticos.</li>
                                    </ul>
                                )}
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>

                  <div className="shrink-0 border-t border-gray-200 bg-white px-8 py-4 flex justify-end">
                        <Button
                            onClick={handleContinueStep1}
                            disabled={!file || parsing}
                            className="rounded-lg bg-primary hover:bg-primary/90 text-white cursor-pointer"
                        >
                            {parsing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Continuar
                        </Button>
                  </div>
                </div>
            ) : step === 2 ? (
                <StepShell
                    title="Revisión de catálogo"
                    stepLabel="1 de 3"
                    onClose={handleClose}
                    onBack={handleVolverClick}
                    onContinue={handleContinueStep2}
                    dense
                    toolbar={
                        <div className="flex items-center gap-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button onClick={handleUndo} disabled={historyPast.length === 0} className="p-1.5 rounded-md text-slate-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                                        <Undo2 className="w-4 h-4" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">Deshacer</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button onClick={handleRedo} disabled={historyFuture.length === 0} className="p-1.5 rounded-md text-slate-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                                        <Redo2 className="w-4 h-4" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">Rehacer</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button onClick={handleDuplicateRow} disabled={rows.length === 0} className="p-1.5 rounded-md text-slate-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">Duplicar</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button onClick={addRow} className="p-1.5 rounded-md text-slate-500 hover:bg-gray-100 cursor-pointer">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">Agregar línea</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button onClick={handleDownloadGrid} disabled={rows.length === 0} className="p-1.5 rounded-md text-slate-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">Descargar</TooltipContent>
                            </Tooltip>
                            <div className="h-4 w-px bg-gray-200 mx-1.5" />
                            <span className="flex items-center gap-1 text-xs text-muted-foreground bg-gray-100 rounded-full px-2 py-0.5">
                                <FileCheck2 className="w-3 h-3" /> {clipboardCount}
                            </span>
                            <span className="text-xs text-muted-foreground ml-1.5">Todo guardado</span>
                        </div>
                    }
                >
                    <div className="flex h-full">
                        <div className="flex-1 p-4 space-y-3 overflow-x-auto">
                            <table className="w-full text-xs text-left min-w-[900px] border-separate border-spacing-0">
                                <thead>
                                    <tr className="text-muted-foreground">
                                        <th className="h-[26px] border border-gray-200 bg-gray-100 w-9 sticky top-0 left-0 z-30"></th>
                                        {["A", "B", "C", "D", "E", "F", "G"].map((letter, i) => (
                                            <th
                                                key={letter}
                                                className={`h-[26px] border border-gray-200 bg-gray-100 font-normal text-center sticky top-0 z-20 ${["w-[9%]", "w-[9%]", "w-[18%]", "w-[13%]", "w-[10%]", "w-[16%]", "w-[15%]"][i]}`}
                                            >
                                                {letter}
                                            </th>
                                        ))}
                                        <th className="h-[26px] border border-gray-200 bg-gray-100 w-[4%] sticky top-0 z-20"></th>
                                    </tr>
                                    <tr className="bg-gray-50 text-muted-foreground">
                                        <th className="h-[34px] border border-gray-200 bg-gray-50 sticky top-[26px] left-0 z-30"></th>
                                        <th className="h-[34px] border border-gray-200 px-2 font-medium sticky top-[26px] z-20 bg-gray-50">Nivel *</th>
                                        <th className="h-[34px] border border-gray-200 px-2 font-medium sticky top-[26px] z-20 bg-gray-50">Código</th>
                                        <th className="h-[34px] border border-gray-200 px-2 font-medium sticky top-[26px] z-20 bg-gray-50">Nombre *</th>
                                        <th className="h-[34px] border border-gray-200 px-2 font-medium sticky top-[26px] z-20 bg-gray-50">Elemento *</th>
                                        <th className="h-[34px] border border-gray-200 px-2 font-medium sticky top-[26px] z-20 bg-gray-50">Naturaleza *</th>
                                        <th className="h-[34px] border border-gray-200 px-2 font-medium sticky top-[26px] z-20 bg-gray-50">Uso de cuenta</th>
                                        <th className="h-[34px] border border-gray-200 px-2 font-medium sticky top-[26px] z-20 bg-gray-50">Tipo de cuenta</th>
                                        <th className="h-[34px] border border-gray-200 sticky top-[26px] z-20 bg-gray-50"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, idx) => {
                                        const flagged = cellWarningsByRow.get(idx);
                                        const isHighlighted = highlightedRowIndex === idx;
                                        const cellClass = (col: string) =>
                                            flagged?.has(col) ? "bg-amber-50/60" : "";
                                        return (
                                        <tr key={row.key} id={`import-row-${idx}`} className={`hover:bg-gray-50/50 transition-colors ${isHighlighted ? "bg-primary/5" : ""}`}>
                                            <td
                                                onClick={() => setSelectedRowKey(row.key)}
                                                className={`border border-gray-200 text-center text-muted-foreground cursor-pointer sticky left-0 z-10 ${selectedRowKey === row.key ? "bg-primary/10 text-primary font-medium" : "bg-gray-50"}`}
                                            >
                                                {idx + 1}
                                            </td>
                                            <td className="border border-gray-200 p-0">
                                                <Input
                                                    type="number"
                                                    value={row.nivel ?? ""}
                                                    onChange={(e) => updateRow(row.key, "nivel", e.target.value ? Number(e.target.value) : null)}
                                                    className="h-7 text-xs w-full border-0 rounded-none shadow-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary"
                                                />
                                            </td>
                                            <td className={`border border-gray-200 p-0 ${cellClass("codigo")}`}>
                                                <Input value={row.codigo} onChange={(e) => updateRow(row.key, "codigo", e.target.value)} className="h-7 text-xs border-0 rounded-none shadow-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary" />
                                            </td>
                                            <td className="border border-gray-200 p-0">
                                                <Input value={row.nombre} onChange={(e) => updateRow(row.key, "nombre", e.target.value)} className="h-7 text-xs border-0 rounded-none shadow-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary" />
                                            </td>
                                            <td className="border border-gray-200 p-0">
                                                <SearchableSelect
                                                    value={STATIC_ELEMENT_LOOKUP[row.elemento?.toLowerCase()] || row.elemento}
                                                    onValueChange={(v) => updateRow(row.key, "elemento", v)}
                                                    options={ELEMENT_OPTIONS}
                                                    className="h-7 text-xs bg-white border-0 rounded-none shadow-none"
                                                />
                                            </td>
                                            <td className={`border border-gray-200 p-0 ${cellClass("naturaleza")}`}>
                                                <SearchableSelect
                                                    value={row.naturaleza}
                                                    onValueChange={(v) => updateRow(row.key, "naturaleza", v)}
                                                    options={NATURE_OPTIONS}
                                                    className="h-7 text-xs bg-white border-0 rounded-none shadow-none"
                                                />
                                            </td>
                                            <td className="border border-gray-200 p-0">
                                                <SearchableSelect
                                                    value={row.uso_cuenta}
                                                    onValueChange={(v) => updateRow(row.key, "uso_cuenta", v)}
                                                    options={[{ value: "", label: "Sin uso contable" }, ...(accountUsages || []).map((u: any) => ({ value: u.name, label: u.name }))]}
                                                    placeholder="Sin uso contable"
                                                    className="h-7 text-xs bg-white border-0 rounded-none shadow-none"
                                                />
                                            </td>
                                            <td className="border border-gray-200 p-0">
                                                <SearchableSelect
                                                    value={row.tipo_cuenta}
                                                    onValueChange={(v) => updateRow(row.key, "tipo_cuenta", v)}
                                                    options={TIPO_OPTIONS}
                                                    className="h-7 text-xs bg-white border-0 rounded-none shadow-none"
                                                />
                                            </td>
                                            <td className="border border-gray-200 text-center">
                                                <button onClick={() => removeRow(row.key)} className="text-slate-400 hover:text-red-600 cursor-pointer">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <button onClick={addRow} className="text-primary hover:text-primary/80 text-xs font-semibold flex items-center gap-1 cursor-pointer">
                                <Plus className="w-4 h-4" /> Agregar línea
                            </button>
                        </div>

                        {warnings.length > 0 && (
                            showResumenPanel ? (
                                <div className="w-72 border-l border-gray-200 shrink-0 overflow-y-auto flex flex-col">
                                    <div className="flex items-center justify-between px-4 py-3 shrink-0">
                                        <span className="text-sm font-semibold text-foreground">Resumen</span>
                                        <button onClick={() => setShowResumenPanel(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 pb-3 border-b border-gray-100 shrink-0">
                                        <span className="text-xs font-medium text-primary border border-primary/30 bg-primary/5 rounded-full px-3 py-1">Todos</span>
                                        <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-1">
                                            <AlertTriangle className="w-3 h-3" /> {warnings.length}
                                        </span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                                        {warningGroups.map((group) => {
                                            const isOpen = openResumenGroups[group.column] ?? true;
                                            return (
                                                <div key={group.column}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpenResumenGroups((prev) => ({ ...prev, [group.column]: !isOpen }))}
                                                        className="w-full flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2 cursor-pointer"
                                                    >
                                                        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                        Columna {group.label}
                                                    </button>
                                                    {isOpen && (
                                                        <ul className="space-y-3">
                                                            {group.items.map((w, i) => {
                                                                const displayRows = w.rows.slice(0, 12).map((r) => r + 1);
                                                                const hasMore = w.rows.length > 12;
                                                                return (
                                                                    <li key={i} className="flex items-start justify-between gap-2">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => scrollToImportRow(w.rows[0])}
                                                                            className="flex-1 text-left cursor-pointer"
                                                                        >
                                                                            <p className="text-xs font-semibold text-foreground">
                                                                                Fila {displayRows.join(", ")}{hasMore ? "…" : ""}
                                                                            </p>
                                                                            <p className="text-[11px] text-muted-foreground mt-0.5">{w.message}</p>
                                                                        </button>
                                                                        <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                                                                            <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />
                                                                        </span>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="border-l border-gray-200 shrink-0 p-3">
                                    <button
                                        onClick={() => setShowResumenPanel(true)}
                                        className="relative p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                                    >
                                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                                        <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] leading-none rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
                                            {warnings.length}
                                        </span>
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                </StepShell>
            ) : step === 3 ? (
                <StepShell
                    title="Transferencia de saldos"
                    stepLabel="2 de 3"
                    onClose={handleClose}
                    onBack={handleVolverClick}
                    onContinue={handleContinueStep3}
                >
                    <div className="p-6 space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Selecciona las cuentas que van a recibir el saldo de las que reemplazaste en tu catálogo. Las cuentas con movimientos son obligatorias.
                        </p>
                        {loadingMovements ? (
                            <div className="h-40 flex items-center justify-center text-slate-400">
                                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Cargando cuentas...
                            </div>
                        ) : (
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="w-full text-xs text-left">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50/50 text-muted-foreground">
                                            <th className="px-3 py-2 font-medium">Cuenta que existe en el catálogo actual</th>
                                            <th className="px-3 py-2 font-medium">Cuenta que recibirá el saldo</th>
                                            <th className="px-3 py-2 font-medium text-right">Saldo a transferir</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {(existingAccounts || []).map((a) => (
                                            <tr key={a.id}>
                                                <td className="px-3 py-2">
                                                    {a.code} - {a.name}
                                                    {a.has_movements && <span className="ml-1.5 text-[10px] text-red-500">*</span>}
                                                </td>
                                                <td className="px-3 py-2 w-72">
                                                    <SearchableSelect
                                                        value={balanceMap[a.id] || ""}
                                                        onValueChange={(v) => setBalanceMap((prev) => ({ ...prev, [a.id]: v }))}
                                                        options={postableOptions}
                                                        placeholder="Seleccionar cuenta"
                                                        searchPlaceholder="Buscar cuenta..."
                                                        className="h-7 text-xs bg-white"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-right font-medium">
                                                    $ {a.balance.toLocaleString("es-CO")}
                                                </td>
                                            </tr>
                                        ))}
                                        {(existingAccounts || []).length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="px-3 py-8 text-center text-slate-400">
                                                    No hay cuentas en el catálogo actual para transferir.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                    </div>
                </StepShell>
            ) : (
                <StepShell
                    title="Comportamientos automáticos"
                    stepLabel="3 de 3"
                    onClose={handleClose}
                    onBack={handleVolverClick}
                    onContinue={handleImport}
                    continueLabel="Importar catálogo"
                    continuePending={importing}
                >
                    <div className="p-6 space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Selecciona una cuenta para los comportamientos automáticos que necesites — cada uno queda disponible para que el sistema lo use al contabilizar automáticamente.
                        </p>
                        <div className="border border-gray-200 rounded-lg overflow-hidden max-h-[420px] overflow-y-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="sticky top-0 bg-white">
                                    <tr className="border-b border-gray-200 bg-gray-50/50 text-muted-foreground">
                                        <th className="px-3 py-2 font-medium">Comportamiento automático</th>
                                        <th className="px-3 py-2 font-medium">Cuenta contable</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {(accountUsages || []).map((u: any) => (
                                        <tr key={u.code}>
                                            <td className="px-3 py-2">{u.name}</td>
                                            <td className="px-3 py-2 w-80">
                                                <SearchableSelect
                                                    value={usageDefaultMap[u.code] || ""}
                                                    onValueChange={(v) => setUsageDefaultMap((prev) => ({ ...prev, [u.code]: v }))}
                                                    options={postableOptions}
                                                    placeholder="Sin asignar"
                                                    searchPlaceholder="Buscar cuenta..."
                                                    className="h-7 text-xs bg-white"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </StepShell>
            )}

            <Dialog open={showVolverConfirm} onOpenChange={(v) => !v && setShowVolverConfirm(false)}>
                <DialogContent
                    hideClose
                    className="max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white"
                    onEscapeKeyDown={(e) => e.preventDefault()}
                    onPointerDownOutside={(e) => e.preventDefault()}
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <h2 className="text-base font-bold text-foreground">¿Estás seguro?</h2>
                        <button onClick={() => setShowVolverConfirm(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="px-6 py-5">
                        <p className="text-sm text-muted-foreground">
                            Todos los datos importados hasta ahora serán eliminados y no podrás recuperarlos.
                        </p>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setShowVolverConfirm(false)} className="rounded-full cursor-pointer">
                            Cancelar
                        </Button>
                        <Button onClick={confirmVolver} className="rounded-full bg-primary hover:bg-primary/90 text-white cursor-pointer">
                            Confirmar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={Boolean(successSummary)} onOpenChange={() => {}}>
                <DialogContent
                    hideClose
                    className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white"
                    onEscapeKeyDown={(e) => e.preventDefault()}
                    onPointerDownOutside={(e) => e.preventDefault()}
                >
                    <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 p-8">
                        <div>
                            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-6">
                                <Check className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-3">¡Terminaste de importar tu catálogo!</h2>
                            <p className="text-sm text-muted-foreground mb-6">
                                Ya tienes tu catálogo registrado en la empresa <span className="font-semibold text-foreground">{companyName}</span>. 🎉
                            </p>
                            <div className="border-t border-gray-100 pt-4">
                                <Button
                                    onClick={() => router.push("/accounting/chart-of-accounts")}
                                    className="bg-primary hover:bg-primary/90 text-white cursor-pointer"
                                >
                                    Ver mi catálogo
                                </Button>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-5">
                            <h3 className="text-sm font-bold text-foreground mb-3">Resumen de importación</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2.5">
                                    <div className="flex items-center gap-2">
                                        <FileCheck2 className="w-4 h-4 text-primary" />
                                        <span className="text-xs font-medium text-foreground">Cuentas contables</span>
                                    </div>
                                    <span className="text-xs font-semibold text-foreground">{successSummary?.accounts ?? 0}</span>
                                </div>
                                {(successSummary?.transfers ?? 0) > 0 && (
                                    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2.5">
                                        <span className="text-xs font-medium text-foreground">Saldos transferidos</span>
                                        <span className="text-xs font-semibold text-foreground">{successSummary?.transfers}</span>
                                    </div>
                                )}
                                {(successSummary?.usages ?? 0) > 0 && (
                                    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2.5">
                                        <span className="text-xs font-medium text-foreground">Comportamientos automáticos</span>
                                        <span className="text-xs font-semibold text-foreground">{successSummary?.usages}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );

    return createPortal(content, document.body);
}
