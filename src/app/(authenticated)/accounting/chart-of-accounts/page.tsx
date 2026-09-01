"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowDown,
    ArrowUp,
    Download,
    Eye,
    FileSpreadsheet,
    Minus,
    MoreVertical,
    PanelRightClose,
    Pencil,
    Plus,
    RefreshCw,
    Trash2,
    Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { showToast } from "@/components/sonner/CustomToaster";
import {
    useAccountsList,
    useAccountTypes,
    useAccountUsages,
    useCreateAccount,
    useUpdateAccount,
    useDeleteAccount,
    useChooseCatalog,
    useSortMode,
    useUpdateSortMode,
    useReorderAccounts,
} from "@/hooks/accounting/useAccounting";

const NIIF_PREVIEW = [
    { depth: 0, name: "Activos" },
    { depth: 1, name: "Activos corrientes" },
    { depth: 1, name: "Activos no corrientes" },
    { depth: 0, name: "Pasivos" },
    { depth: 1, name: "Pasivos corrientes" },
    { depth: 1, name: "Pasivos no corrientes" },
    { depth: 0, name: "Patrimonio" },
    { depth: 1, name: "Capital social" },
    { depth: 1, name: "Reservas" },
    { depth: 0, name: "Ingresos" },
    { depth: 0, name: "Gastos" },
    { depth: 0, name: "Costos" },
];

const PUC_PREVIEW = [
    { depth: 0, name: "1 - Activo" },
    { depth: 1, name: "11 - Disponible" },
    { depth: 1, name: "12 - Inversiones" },
    { depth: 1, name: "13 - Deudores comerciales y otras cuentas por cobrar" },
    { depth: 1, name: "14 - Inventarios" },
    { depth: 1, name: "15 - Propiedades, planta y equipo" },
    { depth: 1, name: "16 - Intangibles" },
    { depth: 1, name: "17 - Otros activos no financieros" },
    { depth: 1, name: "18 - Otros activos" },
    { depth: 0, name: "2 - Pasivo" },
    { depth: 0, name: "3 - Patrimonio" },
];

interface AccountRow {
    id: number;
    name: string;
    code: string | null;
    description: string | null;
    type: string | null;
    account_type_id: number | null;
    account_usage_id: number | null;
    parent_id: number | null;
    level: number | null;
    is_postable: boolean | null;
    nature: "debito" | "credito" | null;
    usage: string | null;
    has_movements: boolean;
}

const emptyForm = {
    account_type_id: "",
    account_usage_id: "",
    parent_id: "",
    code: "",
    name: "",
    description: "",
    nature: "debito" as "debito" | "credito",
    is_postable: true,
};

function exportToCsv(rows: AccountRow[]) {
    const header = ["Codigo", "Nombre", "Tipo", "Naturaleza", "Uso", "Nivel", "Postable", "Descripcion"];
    const escape = (v: string) => `"${(v || "").replace(/"/g, '""')}"`;
    const lines = [header.join(";")];
    rows.forEach((a) => {
        lines.push([
            escape(a.code || ""),
            escape(a.name),
            escape(a.type || ""),
            escape(a.nature === "debito" ? "Débito" : a.nature === "credito" ? "Crédito" : ""),
            escape(a.usage || ""),
            String(a.level || 1),
            a.is_postable ? "Si" : "No",
            escape(a.description || ""),
        ].join(";"));
    });
    const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "catalogo-cuentas.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export default function ChartOfAccountsPage() {
    const router = useRouter();
    const [showFilters, setShowFilters] = useState(false);
    const [nameFilter, setNameFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [descriptionFilter, setDescriptionFilter] = useState("");
    const [appliedFilters, setAppliedFilters] = useState({ name: "", type: "", description: "" });

    const [expandedIds, setExpandedIds] = useState<Set<number> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deletingAccount, setDeletingAccount] = useState<AccountRow | null>(null);
    const [form, setForm] = useState(emptyForm);

    const { data: accounts, isLoading, isFetching, isError, refetch } = useAccountsList();
    const { data: accountTypes } = useAccountTypes();
    const { data: accountUsages } = useAccountUsages();
    const createAccount = useCreateAccount();
    const updateAccount = useUpdateAccount();
    const deleteAccount = useDeleteAccount();
    const chooseCatalog = useChooseCatalog();
    const { data: sortMode } = useSortMode();
    const updateSortMode = useUpdateSortMode();
    const reorderAccounts = useReorderAccounts();

    const [catalogChoice, setCatalogChoice] = useState<"niif" | "puc">("niif");
    const [showChoiceConfirm, setShowChoiceConfirm] = useState(false);
    const [pendingSortMode, setPendingSortMode] = useState<"manual" | "code">("code");
    const [showSortConfirm, setShowSortConfirm] = useState(false);

    const handleConfirmSortMode = async () => {
        try {
            await updateSortMode.mutateAsync(pendingSortMode);
            setShowSortConfirm(false);
            showToast("¡Orden actualizado! Orden de las cuentas contables ha sido actualizado correctamente.", "success");
        } catch (error: any) {
            showToast(error?.message || "Error al actualizar el orden", "error");
        }
    };

    const moveSibling = (account: AccountRow, direction: -1 | 1) => {
        const siblings = childrenByParent.get(account.parent_id ?? null) || [];
        const idx = siblings.findIndex((s) => s.id === account.id);
        const swapIdx = idx + direction;
        if (idx === -1 || swapIdx < 0 || swapIdx >= siblings.length) return;
        const reordered = [...siblings];
        [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];
        reorderAccounts.mutate(reordered.map((a) => a.id));
    };

    const list: AccountRow[] = accounts || [];
    const needsCatalogChoice = !isLoading && !isError && list.length === 0;

    const handleConfirmCatalogChoice = async () => {
        try {
            await chooseCatalog.mutateAsync(catalogChoice);
            setShowChoiceConfirm(false);
            showToast("¡Tu catálogo está listo! Todo quedó preparado para tus registros contables.", "success");
        } catch (error: any) {
            showToast(error?.message || "Error al configurar el catálogo de cuentas", "error");
        }
    };

    // Default expanded state: top-level (level 1) accounts open, everything deeper collapsed —
    // matches the reference catalog view (Activos/Pasivos/... open, their children collapsed).
    const expanded = useMemo(() => {
        if (expandedIds) return expandedIds;
        return new Set(list.filter((a) => (a.level || 1) === 1).map((a) => a.id));
    }, [expandedIds, list]);

    const childrenByParent = useMemo(() => {
        const map = new Map<number | null, AccountRow[]>();
        list.forEach((a) => {
            const key = a.parent_id ?? null;
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(a);
        });
        return map;
    }, [list]);

    const hasChildren = (id: number) => (childrenByParent.get(id)?.length || 0) > 0;

    const filtersActive = Boolean(appliedFilters.name || appliedFilters.type || appliedFilters.description);

    const matchesFilters = (a: AccountRow) => {
        if (appliedFilters.name && !a.name.toLowerCase().includes(appliedFilters.name.toLowerCase()) && !(a.code || "").toLowerCase().includes(appliedFilters.name.toLowerCase())) return false;
        if (appliedFilters.type && a.type !== appliedFilters.type) return false;
        if (appliedFilters.description && !(a.description || "").toLowerCase().includes(appliedFilters.description.toLowerCase())) return false;
        return true;
    };

    // Flattens the tree into visible rows respecting expand/collapse state. When filters are
    // active, the tree collapses into a flat filtered list instead (indentation stops meaning
    // much once you're searching across levels).
    const rows = useMemo(() => {
        if (filtersActive) {
            return list.filter(matchesFilters).map((a) => ({ account: a, depth: 0 }));
        }
        const out: { account: AccountRow; depth: number }[] = [];
        const visit = (parentId: number | null, depth: number) => {
            const children = childrenByParent.get(parentId) || [];
            children.forEach((a) => {
                out.push({ account: a, depth });
                if (expanded.has(a.id)) visit(a.id, depth + 1);
            });
        };
        visit(null, 0);
        return out;
    }, [list, childrenByParent, expanded, filtersActive, appliedFilters]);

    const toggleExpand = (id: number) => {
        setExpandedIds((prev) => {
            const next = new Set(prev ?? expanded);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const accountTypeOptions = (accountTypes || []).map((t: any) => ({ value: String(t.id), label: t.name }));
    const typeFilterOptions = [{ value: "", label: "Todos" }, ...(accountTypes || []).map((t: any) => ({ value: t.name, label: t.name }))];
    const accountUsageOptions = [
        { value: "", label: "Ninguno" },
        ...(accountUsages || []).map((u: any) => ({ value: String(u.id), label: u.name })),
    ];
    const parentOptions = useMemo(() => [
        { value: "", label: "Ninguna (cuenta de primer nivel)" },
        ...list.map((a) => ({ value: String(a.id), label: `${a.code} — ${a.name}` })),
    ], [list]);

    const openCreate = (presetParentId?: number) => {
        setEditingId(null);
        const parent = presetParentId ? list.find((a) => a.id === presetParentId) : null;
        setForm({
            ...emptyForm,
            parent_id: presetParentId ? String(presetParentId) : "",
            account_type_id: parent?.account_type_id ? String(parent.account_type_id) : "",
        });
        setIsModalOpen(true);
    };

    const openEdit = (a: AccountRow) => {
        setEditingId(a.id);
        setForm({
            account_type_id: a.account_type_id ? String(a.account_type_id) : "",
            account_usage_id: a.account_usage_id ? String(a.account_usage_id) : "",
            parent_id: a.parent_id ? String(a.parent_id) : "",
            code: a.code || "",
            name: a.name,
            description: a.description || "",
            nature: a.nature || "debito",
            is_postable: Boolean(a.is_postable),
        });
    };

    const editingAccount = editingId ? list.find((a) => a.id === editingId) || null : null;

    const closeModal = () => {
        setIsModalOpen(false);
        setForm(emptyForm);
    };

    const closeEditPanel = () => {
        setEditingId(null);
        setForm(emptyForm);
    };

    const handleSubmit = async () => {
        if (!form.account_type_id || !form.code.trim() || !form.name.trim()) {
            showToast("Completa el tipo, código y nombre de la cuenta", "error");
            return;
        }
        const payload = {
            account_type_id: Number(form.account_type_id),
            account_usage_id: form.account_usage_id ? Number(form.account_usage_id) : undefined,
            parent_id: form.parent_id ? Number(form.parent_id) : undefined,
            code: form.code.trim(),
            name: form.name.trim(),
            description: form.description.trim() || undefined,
            nature: form.nature,
            is_postable: form.is_postable,
        };
        try {
            if (editingId) {
                await updateAccount.mutateAsync({ id: editingId, data: payload });
                showToast("Cuenta contable actualizada correctamente", "success");
                closeEditPanel();
            } else {
                await createAccount.mutateAsync(payload);
                showToast("Cuenta contable creada correctamente", "success");
                closeModal();
            }
        } catch (error: any) {
            showToast(error?.message || "Error al guardar la cuenta contable", "error");
        }
    };

    const handleDelete = async () => {
        if (!deletingAccount) return;
        try {
            await deleteAccount.mutateAsync(deletingAccount.id);
            showToast("Cuenta contable eliminada correctamente", "success");
        } catch (error: any) {
            showToast(error?.message || "No fue posible eliminar la cuenta", "error");
        } finally {
            setDeletingAccount(null);
        }
    };

    const handleApplyFilters = () => {
        setAppliedFilters({ name: nameFilter.trim(), type: typeFilter, description: descriptionFilter.trim() });
    };

    const handleCloseFilters = () => {
        setShowFilters(false);
        setNameFilter("");
        setTypeFilter("");
        setDescriptionFilter("");
        setAppliedFilters({ name: "", type: "", description: "" });
    };

    const loading = isLoading;
    const hasRows = rows.length > 0;
    const isEditPanelOpen = Boolean(editingId && editingAccount);
    const columnsCount = isEditPanelOpen ? 3 : 4;

    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-4 py-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <h1 className="text-lg md:text-xl font-bold text-foreground">Catálogo de cuentas</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Configura y personaliza las cuentas contables que hacen parte de tu catálogo.{" "}
                            <a href="#" onClick={(e) => e.preventDefault()} className="text-primary hover:underline">Saber más</a>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => showToast("Saldos iniciales estará disponible próximamente", "info")}
                            className="h-9 px-3 text-xs bg-white cursor-pointer"
                        >
                            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
                            Saldos iniciales
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 px-3 text-xs bg-white cursor-pointer">
                                    Más acciones
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-[240px]">
                                <DropdownMenuItem
                                    onClick={() => router.push("/accounting/chart-of-accounts/import")}
                                    className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer py-2"
                                >
                                    <Upload className="w-4 h-4 mr-2 text-primary" />
                                    <div>
                                        <div className="font-medium">Importar catálogo de cuentas</div>
                                        <div className="text-[11px] text-muted-foreground">Sube un archivo para personalizar tus cuentas</div>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => exportToCsv(filtersActive ? list.filter(matchesFilters) : list)}
                                    className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer py-2"
                                >
                                    <Download className="w-4 h-4 mr-2 text-primary" />
                                    <div>
                                        <div className="font-medium">Exportar a Excel</div>
                                        <div className="text-[11px] text-muted-foreground">Extrae el listado completo de tu catálogo</div>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => showToast("Parametrización contable estará disponible próximamente", "info")}
                                    className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer py-2"
                                >
                                    <FileSpreadsheet className="w-4 h-4 mr-2 text-primary" />
                                    <div>
                                        <div className="font-medium">Parametrización contable</div>
                                        <div className="text-[11px] text-muted-foreground">Configura las cuentas que usa cada registro</div>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => showToast("Cuentas eliminadas estará disponible próximamente", "info")}
                                    className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer py-2"
                                >
                                    <Trash2 className="w-4 h-4 mr-2 text-primary" />
                                    <div>
                                        <div className="font-medium">Cuentas eliminadas</div>
                                        <div className="text-[11px] text-muted-foreground">Restaura, transfiere saldos o elimina definitivamente</div>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {needsCatalogChoice ? (
                    <div className="space-y-4">
                        <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-foreground">
                            <span className="text-blue-500">ⓘ</span>
                            <span>
                                Elige a continuación el catálogo contable que mejor se ajuste a tu actividad. También puedes{" "}
                                <button onClick={() => router.push("/accounting/chart-of-accounts/import")} className="text-primary underline hover:no-underline cursor-pointer">
                                    Importar uno propio
                                </button>.
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(["niif", "puc"] as const).map((option) => {
                                const preview = option === "niif" ? NIIF_PREVIEW : PUC_PREVIEW;
                                const selected = catalogChoice === option;
                                return (
                                    <button
                                        key={option}
                                        onClick={() => setCatalogChoice(option)}
                                        className={`text-left bg-white rounded-xl border-2 overflow-hidden transition-colors cursor-pointer ${selected ? "border-primary" : "border-gray-200 hover:border-gray-300"}`}
                                    >
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selected ? "border-primary" : "border-gray-300"}`}>
                                                    {selected && <span className="w-2 h-2 rounded-full bg-primary" />}
                                                </span>
                                                <span className="font-semibold text-sm text-foreground">
                                                    Catálogo de cuentas {option === "niif" ? "NIIF" : "PUC"}
                                                </span>
                                            </div>
                                            {option === "niif" && (
                                                <span className="text-[10px] font-medium text-primary bg-primary/10 rounded-full px-2 py-1">Usado por defecto</span>
                                            )}
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                                        <th className="text-left px-3 py-2 font-medium text-muted-foreground">Nombre</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {preview.map((row, i) => (
                                                        <tr key={i} className="border-b border-gray-50">
                                                            <td className="px-3 py-1.5" style={{ paddingLeft: `${12 + row.depth * 18}px` }}>
                                                                <span className={row.depth === 0 ? "font-semibold text-slate-900" : "text-primary"}>{row.name}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex items-center justify-end">
                            <Button
                                onClick={() => setShowChoiceConfirm(true)}
                                className="bg-primary hover:bg-primary/90 text-white cursor-pointer"
                            >
                                Guardar
                            </Button>
                        </div>
                    </div>
                ) : (
                <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <Button
                        size="sm"
                        onClick={() => openCreate()}
                        className="bg-primary hover:bg-primary/90 text-white font-medium cursor-pointer text-xs flex items-center gap-1 h-8 px-3 rounded-lg shadow-xs"
                    >
                        <Plus className="w-3.5 h-3.5 mr-0.5" />
                        <span>Nueva cuenta</span>
                    </Button>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
                            <button
                                onClick={() => { setPendingSortMode("manual"); setShowSortConfirm(true); }}
                                className={`h-8 px-3 text-xs font-medium cursor-pointer transition-colors ${sortMode === "manual" ? "bg-primary text-white" : "bg-white text-foreground hover:bg-gray-50"}`}
                            >
                                Orden manual
                            </button>
                            <button
                                onClick={() => { setPendingSortMode("code"); setShowSortConfirm(true); }}
                                className={`h-8 px-3 text-xs font-medium cursor-pointer transition-colors border-l border-gray-200 ${sortMode === "code" ? "bg-primary text-white" : "bg-white text-foreground hover:bg-gray-50"}`}
                            >
                                Ordenar por código
                            </button>
                        </div>

                        {showFilters && (
                            <>
                                <Input
                                    placeholder="Nombre"
                                    value={nameFilter}
                                    onChange={(e) => setNameFilter(e.target.value)}
                                    className="h-8 text-xs bg-white w-36"
                                />
                                <SearchableSelect
                                    value={typeFilter}
                                    onValueChange={setTypeFilter}
                                    options={typeFilterOptions}
                                    placeholder="Tipo"
                                    className="h-8 text-xs bg-white w-32"
                                />
                                <Input
                                    placeholder="Descripción"
                                    value={descriptionFilter}
                                    onChange={(e) => setDescriptionFilter(e.target.value)}
                                    className="h-8 text-xs bg-white w-40"
                                />
                                <Button size="sm" onClick={handleApplyFilters} className="h-8 px-3 text-xs bg-primary hover:bg-primary/90 text-white cursor-pointer">
                                    Filtrar
                                </Button>
                            </>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => (showFilters ? handleCloseFilters() : setShowFilters(true))}
                            className="h-8 px-3 text-xs bg-white cursor-pointer"
                        >
                            {showFilters ? "Cerrar" : "Filtrar"}
                        </Button>
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                <div className="bg-white rounded-lg border border-gray-200 flex-1 min-w-0">
                    <div className="relative">
                        <div className="overflow-x-auto">
                            <Table className="text-xs">
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead className="border-l border-gray-200">Nombre</TableHead>
                                        <TableHead>
                                            <div className="flex items-center gap-1">
                                                Uso de la cuenta
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="inline-flex w-3.5 h-3.5 rounded-full border border-gray-400 text-gray-400 items-center justify-center text-[9px] cursor-help">?</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="max-w-64 text-xs">
                                                        Selecciona una opción para definir el comportamiento de esta cuenta o si deseas usarla en los registros automáticos del sistema
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </TableHead>
                                        {!isEditPanelOpen && (
                                            <TableHead className="border-r border-gray-200">Descripción</TableHead>
                                        )}
                                        <TableHead className="w-10"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow className="hover:bg-transparent">
                                            <TableCell colSpan={columnsCount} className="bg-white text-center align-middle p-0">
                                                <div className="h-64 bg-white" />
                                            </TableCell>
                                        </TableRow>
                                    ) : isError ? (
                                        <TableRow className="hover:bg-transparent">
                                            <TableCell colSpan={columnsCount} className="bg-white text-center align-middle p-0">
                                                <div className="flex h-64 flex-col items-center justify-center py-8 text-center">
                                                    <div className="text-lg font-semibold text-red-500">Error al cargar el catálogo</div>
                                                    <div className="text-sm text-gray-500 mt-1">Verifica tu conexión a internet e intenta de nuevo</div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : !hasRows ? (
                                        <TableRow className="hover:bg-transparent">
                                            <TableCell colSpan={columnsCount} className="bg-white text-center align-middle p-0">
                                                <div className="flex h-64 flex-col items-center justify-center py-8 text-center">
                                                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-4 text-gray-300">
                                                        <rect x="8" y="10" width="32" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                                                        <rect x="14" y="18" width="20" height="2" rx="1" fill="currentColor" />
                                                        <rect x="14" y="24" width="12" height="2" rx="1" fill="currentColor" />
                                                    </svg>
                                                    <div className="text-lg font-semibold text-gray-700">Sin resultados</div>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        {filtersActive ? "No se encontraron cuentas con esos filtros" : "Sin cuentas registradas aún"}
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        rows.map(({ account: a, depth }) => {
                                            const isExpandable = !filtersActive && hasChildren(a.id);
                                            const isExpanded = expanded.has(a.id);
                                            const blockedByChildren = hasChildren(a.id);
                                            const blockedByMovements = !blockedByChildren && a.has_movements;
                                            const deleteDisabled = blockedByChildren || blockedByMovements;
                                            return (
                                                <TableRow key={a.id} className="hover:bg-slate-50 transition-colors">
                                                    <TableCell>
                                                        <div className="flex items-center gap-1.5" style={{ paddingLeft: `${depth * 20}px` }}>
                                                            {isExpandable ? (
                                                                <button
                                                                    onClick={() => toggleExpand(a.id)}
                                                                    className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer shrink-0"
                                                                >
                                                                    {isExpanded ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                                                </button>
                                                            ) : (
                                                                <span className="w-4 h-4 shrink-0" />
                                                            )}
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <span className="cursor-default text-slate-900">
                                                                        {a.code ? `${a.code} - ${a.name}` : a.name}
                                                                    </span>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="right" className="text-xs p-3 max-w-72">
                                                                    <div className="font-semibold mb-1">{a.name} | {a.code}</div>
                                                                    <div className="mb-2">
                                                                        {a.nature === "debito" ? "Deudora" : "Acreedora"}
                                                                        {a.usage && (
                                                                            <span className="text-blue-300"> (Cuenta para registros automáticos)</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                                                                        <div className="font-medium">Tipo de cuenta</div>
                                                                        <div className="font-medium">Uso de la cuenta</div>
                                                                        <div>{a.is_postable ? "Cuenta de movimiento" : "Cuenta mayor"}</div>
                                                                        <div>{a.usage || "Sin uso contable"}</div>
                                                                    </div>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-slate-600">{a.usage || "-"}</TableCell>
                                                    {!isEditPanelOpen && (
                                                        <TableCell className="text-slate-500">{a.description || "-"}</TableCell>
                                                    )}
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <button className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer">
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="min-w-[200px]">
                                                                {sortMode === "manual" && !filtersActive && (
                                                                    <>
                                                                        <DropdownMenuItem
                                                                            onClick={() => moveSibling(a, -1)}
                                                                            className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer"
                                                                        >
                                                                            <ArrowUp className="w-4 h-4 mr-2" />
                                                                            Mover arriba
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() => moveSibling(a, 1)}
                                                                            className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer"
                                                                        >
                                                                            <ArrowDown className="w-4 h-4 mr-2" />
                                                                            Mover abajo
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                )}
                                                                <DropdownMenuItem
                                                                    onClick={() => router.push(`/accounting/ledger?account_id=${a.id}&account_label=${encodeURIComponent(`${a.code} — ${a.name}`)}`)}
                                                                    className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer"
                                                                >
                                                                    <Eye className="w-4 h-4 mr-2" />
                                                                    Ver movimientos
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => openCreate(a.id)}
                                                                    className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer"
                                                                >
                                                                    <Plus className="w-4 h-4 mr-2" />
                                                                    Agregar subcuenta
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => openEdit(a)}
                                                                    className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer"
                                                                >
                                                                    <Pencil className="w-4 h-4 mr-2" />
                                                                    Editar
                                                                </DropdownMenuItem>
                                                                {deleteDisabled ? (
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <div>
                                                                                <DropdownMenuItem
                                                                                    disabled
                                                                                    className="text-slate-300 cursor-not-allowed data-[disabled]:opacity-100"
                                                                                >
                                                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                                                    Eliminar cuenta
                                                                                </DropdownMenuItem>
                                                                            </div>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent className="max-w-56 text-xs">
                                                                            {blockedByChildren
                                                                                ? "No se puede eliminar una cuenta que tiene subcuentas."
                                                                                : "Esta cuenta contable no se puede eliminar, se encuentra asociada a movimientos automáticos."}
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                ) : (
                                                                    <DropdownMenuItem
                                                                        onClick={() => setDeletingAccount(a)}
                                                                        className="text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 transition-colors cursor-pointer"
                                                                    >
                                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                                        Eliminar cuenta
                                                                    </DropdownMenuItem>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {loading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/55">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-ring/25 border-t-primary" />
                            </div>
                        )}
                    </div>

                    <div className="flex min-h-12 items-center justify-end border-t border-gray-200 px-4 py-2">
                        <button
                            type="button"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                            aria-label="Actualizar"
                        >
                            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                        </button>
                    </div>
                </div>

                {editingId && editingAccount && (
                    <div className="w-[380px] shrink-0 bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-1">
                            <h2 className="text-sm font-semibold text-foreground">Editar cuenta contable</h2>
                            <div className="flex items-center gap-1">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="min-w-[200px]">
                                        <DropdownMenuItem
                                            onClick={() => router.push(`/accounting/ledger?account_id=${editingAccount.id}&account_label=${encodeURIComponent(`${editingAccount.code} — ${editingAccount.name}`)}`)}
                                            className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            Ver movimientos
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => { closeEditPanel(); openCreate(editingAccount.id); }}
                                            className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Agregar subcuenta
                                        </DropdownMenuItem>
                                        {(() => {
                                            const blockedByChildren = hasChildren(editingAccount.id);
                                            const blockedByMovements = !blockedByChildren && editingAccount.has_movements;
                                            const deleteDisabled = blockedByChildren || blockedByMovements;
                                            return deleteDisabled ? (
                                                <DropdownMenuItem disabled className="text-slate-300 cursor-not-allowed data-[disabled]:opacity-100">
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Eliminar cuenta
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem
                                                    onClick={() => setDeletingAccount(editingAccount)}
                                                    className="text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Eliminar cuenta
                                                </DropdownMenuItem>
                                            );
                                        })()}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <button onClick={closeEditPanel} className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer" aria-label="Cerrar">
                                    <PanelRightClose className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">
                            Cambia la información asociada a la cuenta que seleccionaste.
                        </p>

                        {!editingAccount.parent_id && (
                            <p className="text-xs text-muted-foreground mb-4">
                                Esta cuenta funciona de manera automática como cuenta principal de{" "}
                                <span className="font-semibold text-foreground">{editingAccount.name}</span>.
                            </p>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">Nombre <span className="text-primary">*</span></label>
                                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="h-9" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">Código</label>
                                <Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} className="h-9" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">Naturaleza <span className="text-primary">*</span></label>
                                <div className="h-9 flex items-center px-3 rounded-md border border-gray-200 bg-gray-50 text-sm text-muted-foreground">
                                    {form.nature === "debito" ? "Deudora" : "Acreedora"}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">Descripción</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                    rows={4}
                                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            <Button
                                onClick={handleSubmit}
                                disabled={updateAccount.isPending}
                                className="bg-primary hover:bg-primary/90 text-white cursor-pointer w-full sm:w-auto"
                            >
                                {updateAccount.isPending ? "Guardando..." : "Guardar"}
                            </Button>
                        </div>
                    </div>
                )}
                </div>
                </>
                )}
            </div>

            <AlertDialog open={showChoiceConfirm} onOpenChange={setShowChoiceConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar selección</AlertDialogTitle>
                        <AlertDialogDescription>
                            La elección del tipo de catálogo de cuentas servirá como base para tus registros contables y también influirá en la presentación de tus reportes contables.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer" disabled={chooseCatalog.isPending}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmCatalogChoice} disabled={chooseCatalog.isPending} className="bg-primary hover:bg-primary/90 cursor-pointer">
                            {chooseCatalog.isPending ? "Guardando..." : "Guardar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showSortConfirm} onOpenChange={setShowSortConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {pendingSortMode === "manual" ? "Ordenar cuentas manualmente" : "Ordenar cuentas por código"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Al ordenar tu catálogo también se ordenarán todos los reportes contables según la elección. Ten en cuenta que este orden respeta la jerarquía de las cuentas madres.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer" disabled={updateSortMode.isPending}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmSortMode} disabled={updateSortMode.isPending} className="bg-primary hover:bg-primary/90 cursor-pointer">
                            {updateSortMode.isPending ? "Ordenando..." : "Ordenar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className="max-w-lg p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white">
                    <DialogHeader className="px-6 py-4 border-b border-border/40 bg-[#f8fafc]">
                        <DialogTitle className="text-base font-bold text-[#123159]">
                            Nueva cuenta contable
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">Código <span className="text-primary">*</span></label>
                                <Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="Ej. 220520" className="h-9" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">Naturaleza <span className="text-primary">*</span></label>
                                <SearchableSelect
                                    value={form.nature}
                                    onValueChange={(v) => setForm((f) => ({ ...f, nature: v as "debito" | "credito" }))}
                                    options={[{ value: "debito", label: "Débito" }, { value: "credito", label: "Crédito" }]}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Nombre <span className="text-primary">*</span></label>
                            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nombre de la cuenta" className="h-9" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Descripción</label>
                            <Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Opcional" className="h-9" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Tipo de cuenta <span className="text-primary">*</span></label>
                            <SearchableSelect
                                value={form.account_type_id}
                                onValueChange={(v) => setForm((f) => ({ ...f, account_type_id: v }))}
                                options={accountTypeOptions}
                                placeholder="Seleccionar tipo"
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Uso</label>
                            <SearchableSelect
                                value={form.account_usage_id}
                                onValueChange={(v) => setForm((f) => ({ ...f, account_usage_id: v }))}
                                options={accountUsageOptions}
                                placeholder="Ninguno"
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Cuenta padre</label>
                            <SearchableSelect
                                value={form.parent_id}
                                onValueChange={(v) => setForm((f) => ({ ...f, parent_id: v }))}
                                options={parentOptions.filter((p) => p.value !== String(editingId))}
                                placeholder="Ninguna (cuenta de primer nivel)"
                                searchPlaceholder="Buscar cuenta..."
                                className="w-full"
                            />
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.is_postable}
                                onChange={(e) => setForm((f) => ({ ...f, is_postable: e.target.checked }))}
                                className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary accent-primary cursor-pointer"
                            />
                            <span className="text-sm text-foreground">Es una cuenta postable (recibe movimientos directamente)</span>
                        </label>
                    </div>

                    <div className="px-6 py-4 border-t border-border/40 bg-[#f8fafc] flex justify-end gap-3 rounded-b-2xl">
                        <button
                            onClick={closeModal}
                            className="px-5 py-2 bg-white border border-border hover:bg-muted text-foreground text-sm font-bold rounded-xl transition-all cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={createAccount.isPending || updateAccount.isPending}
                            className="px-5 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-primary/20 cursor-pointer disabled:opacity-60"
                        >
                            {createAccount.isPending || updateAccount.isPending ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog open={Boolean(deletingAccount)} onOpenChange={(open) => !open && setDeletingAccount(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar cuenta contable</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Seguro que deseas eliminar la cuenta "{deletingAccount?.code} — {deletingAccount?.name}"? Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 cursor-pointer">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
