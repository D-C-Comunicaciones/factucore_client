"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { DateRange } from "react-day-picker";
import { AlertCircle, ArrowDownRight, ArrowUpRight, Check, ChevronDown, ChevronLeft, HelpCircle, Landmark, RotateCcw, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DateRangePickerSimple } from "@/components/ui/DateRangePickerSimple";
import { RadioFilterList } from "@/components/banks/table/RadioFilterList";
import { ReconciliationMovementsTable } from "@/components/banks/table/ReconciliationMovementsTable";
import { showToast } from "@/components/sonner/CustomToaster";
import { formatAmount } from "@/utils/format-currency";
import {
    useBankAccount,
    useBankAccountsList,
    useBankReconciliation,
    useUpdateBankReconciliation,
    useCompleteBankReconciliation,
    useReopenBankReconciliation,
} from "@/hooks/banks/useBanks";
import type { BankAccount } from "@/lib/banks";

const moneyInputClass =
    "flex-1 h-full px-2 text-sm outline-none bg-transparent disabled:bg-transparent";
const moneyWrapperClass =
    "flex items-center rounded-md overflow-hidden h-9 transition-colors bg-white border border-gray-300 hover:border-primary focus-within:border-primary";
const moneyWrapperErrorClass =
    "flex items-center rounded-md overflow-hidden h-9 transition-colors bg-white border border-destructive";
const moneyPrefixClass =
    "px-2 text-muted-foreground text-sm bg-gray-100 h-full flex items-center shrink-0";

function isValidSignedNumber(val: string): boolean {
    return val.trim() !== "" && !isNaN(Number(val));
}

function isValidNonNegativeNumber(val: string): boolean {
    return isValidSignedNumber(val) && Number(val) >= 0;
}

/** Acepta ISO ("2026-09-02..."), "YYYY-MM-DD" o un valor ya formateado como "DD/MM/YYYY" (en cuyo
 *  caso se devuelve tal cual, para no volver a "formatear" un string que ya lo está). */
function formatDate(dateStr?: string | null): string {
    if (!dateStr) return "-";
    if (dateStr.includes("/")) return dateStr;
    const [y, m, d] = dateStr.split("-");
    if (!y || !m || !d) return "-";
    return `${d.slice(0, 2)}/${m}/${y}`;
}

function InfoTooltip({ text }: { text: string }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="text-primary cursor-help inline-flex">
                        <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-[240px] text-xs">{text}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;

function draftKey(reconciliationId: number): string {
    return `bank-reconciliation-draft-${reconciliationId}`;
}

interface ReconciliationDraft {
    savedAt: number;
    bankBalance: string;
    bankCharges: string;
    bankTaxes: string;
    bankOtherEntries: string;
    checkedIds: number[];
}

function readDraft(reconciliationId: number): ReconciliationDraft | null {
    try {
        const raw = localStorage.getItem(draftKey(reconciliationId));
        if (!raw) return null;
        const draft = JSON.parse(raw) as ReconciliationDraft;
        if (Date.now() - draft.savedAt > DRAFT_TTL_MS) {
            localStorage.removeItem(draftKey(reconciliationId));
            return null;
        }
        return draft;
    } catch {
        return null;
    }
}

function clearDraft(reconciliationId: number): void {
    try {
        localStorage.removeItem(draftKey(reconciliationId));
    } catch {
        // localStorage puede no estar disponible (modo privado, cuota, etc.) — no es crítico.
    }
}

function ReconciliationDetailSkeleton() {
    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8 space-y-6 py-6">
                <Skeleton className="h-4 w-40" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-72" />
                    <Skeleton className="h-3 w-96" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-32 rounded-full" />
                    <Skeleton className="h-8 w-48 rounded-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Skeleton className="h-20 rounded-lg" />
                    <Skeleton className="h-20 rounded-lg" />
                    <Skeleton className="h-20 rounded-lg" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Skeleton className="h-20 rounded-lg" />
                    <Skeleton className="h-20 rounded-lg" />
                    <Skeleton className="h-20 rounded-lg" />
                </div>
                <Skeleton className="h-32 rounded-lg" />
                <div className="bg-white rounded-lg border border-border overflow-hidden p-4 space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function BankReconciliationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params?.id);

    const { data, isLoading, refetch } = useBankReconciliation(id);
    const { data: accountsData } = useBankAccountsList();
    const bankAccounts: BankAccount[] = accountsData?.bank_accounts ?? [];
    const updateMutation = useUpdateBankReconciliation();
    const completeMutation = useCompleteBankReconciliation();
    const reopenMutation = useReopenBankReconciliation();

    const [bankBalance, setBankBalance] = useState("");
    const [bankCharges, setBankCharges] = useState("0");
    const [bankTaxes, setBankTaxes] = useState("0");
    const [bankOtherEntries, setBankOtherEntries] = useState("0");
    const [checkedIds, setCheckedIds] = useState<number[]>([]);
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
    const markTouched = (field: string) => setTouchedFields((prev) => new Set(prev).add(field));

    const [pendingDraft, setPendingDraft] = useState<ReconciliationDraft | null>(null);
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const draftResolvedRef = useRef(false);

    const reconciliation = data?.reconciliation;
    const movements = data?.movements ?? [];

    // Todos los movimientos históricos de la cuenta (sin acotar a este periodo) — solo para saber
    // qué días del calendario tienen algún movimiento y así deshabilitar el resto.
    const { data: fullAccountData } = useBankAccount(reconciliation?.bank_account_id ?? null);
    const allowedDates = useMemo(() => {
        const set = new Set<string>();
        (fullAccountData?.movements ?? []).forEach((line: any) => {
            const d = line.journal_entry?.entry_date;
            if (d) set.add(d.slice(0, 10));
        });
        return set;
    }, [fullAccountData]);
    const isDateDisabled = useCallback(
        (date: Date) => allowedDates.size > 0 && !allowedDates.has(date.toISOString().slice(0, 10)),
        [allowedDates]
    );

    const hydrateFromServer = useCallback(() => {
        if (!reconciliation) return;
        setBankBalance(reconciliation.bank_balance !== null ? String(reconciliation.bank_balance) : "");
        setBankCharges(String(reconciliation.bank_charges ?? 0));
        setBankTaxes(String(reconciliation.bank_taxes ?? 0));
        setBankOtherEntries(String(reconciliation.bank_other_entries ?? 0));
        // El estado real de conciliación vive en cada línea del libro (is_reconciled), no en la
        // conciliación — se deriva de los movimientos ya conciliados por ESTE ciclo.
        setCheckedIds(
            movements.filter((line: any) => line.is_reconciled && line.bank_reconciliation_id === reconciliation.id).map((line: any) => line.id)
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reconciliation?.id, movements.length]);

    // Al cargar una conciliación sin terminar, si hay un borrador reciente (< 24h) guardado en
    // este navegador, se le pregunta al usuario si quiere retomarlo antes de hidratar con los
    // valores del servidor — evita perder trabajo si cerró la pestaña sin "Posponer"/"Conciliar".
    useEffect(() => {
        if (!reconciliation) return;
        draftResolvedRef.current = false;

        if (reconciliation.status !== "completed") {
            const draft = readDraft(reconciliation.id);
            if (draft) {
                setPendingDraft(draft);
                hydrateFromServer();
                return;
            }
        }

        hydrateFromServer();
        draftResolvedRef.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reconciliation?.id, movements.length]);

    // Autoguardado local: cualquier cambio en los campos editables se cachea (con su hora) para
    // poder ofrecer "retomar borrador" si el usuario abandona la página sin guardar en el servidor.
    // "Guardando cambios..." se muestra mientras el debounce espera una pausa en la escritura;
    // al cumplirse, se escribe a localStorage y pasa a "Última actualización: hoy a las...".
    useEffect(() => {
        if (!reconciliation || reconciliation.status === "completed" || !draftResolvedRef.current) return;

        setIsSavingDraft(true);
        const timeout = setTimeout(() => {
            try {
                const draft: ReconciliationDraft = {
                    savedAt: Date.now(),
                    bankBalance,
                    bankCharges,
                    bankTaxes,
                    bankOtherEntries,
                    checkedIds,
                };
                localStorage.setItem(draftKey(reconciliation.id), JSON.stringify(draft));
                setLastSavedAt(new Date());
            } catch {
                // localStorage puede no estar disponible — el autoguardado simplemente no ocurre.
            } finally {
                setIsSavingDraft(false);
            }
        }, 600);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bankBalance, bankCharges, bankTaxes, bankOtherEntries, checkedIds, reconciliation?.id]);

    if (isLoading || !reconciliation) {
        return isLoading ? <ReconciliationDetailSkeleton /> : (
            <div className="w-full min-h-screen flex items-center justify-center text-muted-foreground">
                Conciliación no encontrada.
            </div>
        );
    }

    const isCompleted = reconciliation.status === "completed";
    const accountName = reconciliation.bank_account?.account?.name || reconciliation.bank_account?.name;

    const toggleLine = (lineId: number) => {
        setCheckedIds((prev) => (prev.includes(lineId) ? prev.filter((id) => id !== lineId) : [...prev, lineId]));
    };

    const handleContinueDraft = () => {
        if (pendingDraft) {
            setBankBalance(pendingDraft.bankBalance);
            setBankCharges(pendingDraft.bankCharges);
            setBankTaxes(pendingDraft.bankTaxes);
            setBankOtherEntries(pendingDraft.bankOtherEntries);
            setCheckedIds(pendingDraft.checkedIds);
        }
        setPendingDraft(null);
        draftResolvedRef.current = true;
    };

    const handleDiscardDraft = () => {
        clearDraft(reconciliation.id);
        hydrateFromServer();
        setPendingDraft(null);
        draftResolvedRef.current = true;
    };

    const persistProgress = async () => {
        await updateMutation.mutateAsync({
            id: reconciliation.id,
            data: {
                bank_balance: bankBalance === "" ? null : Number(bankBalance),
                bank_charges: Number(bankCharges) || 0,
                bank_taxes: Number(bankTaxes) || 0,
                bank_other_entries: Number(bankOtherEntries) || 0,
                reconciled_line_ids: checkedIds,
            },
        });
        clearDraft(reconciliation.id);
        refetch();
    };

    const handlePostpone = async () => {
        try {
            await persistProgress();
            showToast("Progreso guardado", "success");
            router.push("/banks/reconciliations");
        } catch (error: any) {
            showToast(error?.response?.data?.message || "No se pudo guardar el progreso", "error");
        }
    };

    // Recalculado en vivo con lo que el usuario está digitando, para que "Diferencia" reaccione
    // sin esperar el round-trip de guardar.
    const liveTotalBalance =
        Number(reconciliation.previous_balance) +
        Number(reconciliation.total_in) -
        Number(reconciliation.total_out) +
        (Number(bankOtherEntries) || 0) -
        (Number(bankCharges) || 0) -
        (Number(bankTaxes) || 0);
    const liveDifference = bankBalance === "" ? null : Number(bankBalance) - liveTotalBalance;
    const differenceIsZero = liveDifference !== null && Math.abs(liveDifference) < 0.01;

    const bankBalanceError = touchedFields.has("bankBalance") && !isValidSignedNumber(bankBalance)
        ? "El valor debe ser un número positivo o negativo."
        : null;
    const bankChargesError = touchedFields.has("bankCharges") && !isValidNonNegativeNumber(bankCharges)
        ? "El valor debe ser un número positivo."
        : null;
    const bankTaxesError = touchedFields.has("bankTaxes") && !isValidNonNegativeNumber(bankTaxes)
        ? "El valor debe ser un número positivo."
        : null;
    const bankOtherEntriesError = touchedFields.has("bankOtherEntries") && !isValidNonNegativeNumber(bankOtherEntries)
        ? "El valor debe ser un número positivo."
        : null;
    const hasFieldErrors = Boolean(bankBalanceError || bankChargesError || bankTaxesError || bankOtherEntriesError);

    const handleReconcile = async () => {
        if (bankBalance === "") {
            showToast("Ingresa el saldo bancario para conciliar", "warning");
            return;
        }
        if (hasFieldErrors) {
            showToast("Debes completar los campos obligatorios", "error");
            return;
        }
        if (!differenceIsZero) {
            showToast("No es posible completar la conciliación porque existe una diferencia pendiente de validar.", "error");
            return;
        }
        try {
            await persistProgress();
            await completeMutation.mutateAsync(reconciliation.id);
            showToast("Conciliación cerrada exitosamente", "success");
            refetch();
        } catch (error: any) {
            showToast(error?.response?.data?.message || "No se pudo conciliar", "error");
        }
    };

    const handleReopen = async () => {
        try {
            await reopenMutation.mutateAsync(reconciliation.id);
            showToast("Conciliación reabierta", "success");
            refetch();
        } catch (error: any) {
            showToast(error?.response?.data?.message || "No se pudo reabrir la conciliación", "error");
        }
    };

    const handleAccountChange = async (newAccountId: string) => {
        if (!newAccountId || Number(newAccountId) === reconciliation.bank_account_id) return;
        try {
            await updateMutation.mutateAsync({ id: reconciliation.id, data: { bank_account_id: Number(newAccountId) } });
            showToast("Cuenta bancaria actualizada", "success");
            refetch();
        } catch (error: any) {
            showToast(error?.response?.data?.message || "No se pudo cambiar la cuenta bancaria", "error");
        }
    };

    const handlePeriodChange = async (range: DateRange) => {
        if (!range.from || !range.to) return;
        try {
            await updateMutation.mutateAsync({
                id: reconciliation.id,
                data: {
                    period_start: range.from.toISOString().split("T")[0],
                    period_end: range.to.toISOString().split("T")[0],
                },
            });
            showToast("Periodo actualizado", "success");
            refetch();
        } catch (error: any) {
            showToast(error?.response?.data?.message || "No se pudo cambiar el periodo", "error");
        }
    };

    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8 space-y-6 py-6">
                <div className="flex items-center text-sm text-primary mb-2 font-medium">
                    <Link href="/banks/reconciliations" className="hover:underline">Conciliaciones</Link>
                    <ChevronLeft className="w-4 h-4 mx-1 text-slate-400 rotate-180" />
                    <span className="text-slate-500">Conciliación {accountName}</span>
                </div>

                <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Conciliación {accountName}</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Concilia tus movimientos bancarios y genera reportes detallados al instante.</p>
                    </div>
                    {(isSavingDraft || lastSavedAt) && !isCompleted && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            {isSavingDraft ? (
                                <>
                                    <Save className="w-3.5 h-3.5 animate-pulse text-primary" />
                                    <span className="text-primary">Guardando cambios...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-3.5 h-3.5" />
                                    <span>
                                        Última actualización: <span className="font-bold text-foreground">hoy a las {lastSavedAt!.toLocaleTimeString("es-CO", { hour12: false })}</span>
                                    </span>
                                </>
                            )}
                            <InfoTooltip text="¡Tu trabajo está seguro! Guardamos tu progreso automáticamente." />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                disabled={isCompleted}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary hover:bg-primary/15 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer transition-colors"
                            >
                                <Landmark className="w-3.5 h-3.5" />
                                {accountName}
                                <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="min-w-[240px] p-0">
                            <RadioFilterList
                                options={bankAccounts.map((a) => ({ value: String(a.id), label: a.name }))}
                                value={String(reconciliation.bank_account_id)}
                                onChange={handleAccountChange}
                                searchable
                                searchPlaceholder="Buscar banco"
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex items-center gap-1">
                        <DateRangePickerSimple
                            value={{ from: new Date(reconciliation.period_start), to: new Date(reconciliation.period_end) }}
                            onChange={handlePeriodChange}
                            disabledDates={isDateDisabled}
                            className={`rounded-full w-auto ${isCompleted ? "opacity-70 pointer-events-none" : ""}`}
                        />
                        <InfoTooltip text="Podés cambiar el rango de fechas para conciliar solo el periodo que necesites. Esto no afecta tu contabilidad histórica ni otras conciliaciones." />
                    </div>

                    {isCompleted && (
                        <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">Conciliada</span>
                    )}
                </div>

                {isCompleted && (
                    <div className="flex items-center justify-between gap-3 -mt-2">
                        <p className="text-xs text-muted-foreground">
                            Conciliado el {formatDate(reconciliation.reconciled_at?.slice(0, 10))}
                            {reconciliation.completed_by?.name ? ` por ${reconciliation.completed_by.name}` : ""}
                        </p>
                        <Button variant="outline" size="sm" onClick={handleReopen} disabled={reopenMutation.isPending} className="cursor-pointer">
                            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                            Reabrir conciliación
                        </Button>
                    </div>
                )}

                <div className="relative bg-white rounded-lg border border-border grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
                    <div className="p-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            Saldo anterior
                            <InfoTooltip text="Saldo inicial de tu cuenta bancaria" />
                        </div>
                        <div className="text-lg font-bold text-foreground mt-1">$ {formatAmount(Number(reconciliation.previous_balance))}</div>
                    </div>
                    <div className="p-4">
                        <div className="flex items-center gap-1.5 text-sm text-emerald-600">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            Entradas
                        </div>
                        <div className="text-lg font-bold text-foreground mt-1">$ {formatAmount(Number(reconciliation.total_in))}</div>
                    </div>
                    <div className="p-4">
                        <div className="flex items-center gap-1.5 text-sm text-destructive">
                            <ArrowDownRight className="w-3.5 h-3.5" />
                            Salidas
                        </div>
                        <div className="text-lg font-bold text-foreground mt-1">$ {formatAmount(Number(reconciliation.total_out))}</div>
                    </div>
                    <div className="hidden sm:flex absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border border-border bg-white items-center justify-center text-muted-foreground text-xs">+</div>
                    <div className="hidden sm:flex absolute left-2/3 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border border-border bg-white items-center justify-center text-muted-foreground text-xs">−</div>
                </div>

                <div className="bg-white rounded-lg border border-border grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
                    <div className="p-4 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            Saldo bancario
                            <InfoTooltip text={`Saldo bancario de ${accountName} al ${formatDate(reconciliation.period_end)}`} />
                        </div>
                        <div className={bankBalanceError ? moneyWrapperErrorClass : moneyWrapperClass}>
                            <span className={moneyPrefixClass}>$</span>
                            <input
                                type="number"
                                value={bankBalance}
                                onChange={(e) => setBankBalance(e.target.value)}
                                onBlur={() => markTouched("bankBalance")}
                                disabled={isCompleted}
                                className={moneyInputClass}
                                placeholder="0"
                            />
                            {bankBalanceError && <AlertCircle className="w-4 h-4 text-destructive mr-2 shrink-0" />}
                        </div>
                        {bankBalanceError && <p className="text-xs text-destructive">{bankBalanceError}</p>}
                    </div>
                    <div className="p-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            Saldo Total
                            <InfoTooltip text="Saldo anterior + Entradas - Salidas" />
                        </div>
                        <div className="text-lg font-bold text-foreground mt-1">$ {formatAmount(liveTotalBalance)}</div>
                    </div>
                    <div className="p-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            Diferencia
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-lg font-bold text-foreground">
                                {liveDifference === null ? "-" : `$ ${formatAmount(liveDifference)}`}
                            </span>
                            {liveDifference !== null && (
                                Math.abs(liveDifference) <= 0.01
                                    ? (
                                        <span className="relative w-6 h-6 flex items-center justify-center shrink-0">
                                            <span className="absolute -inset-1 rounded-full bg-emerald-100" />
                                            <span className="absolute inset-0 rounded-full border-2 border-emerald-500" />
                                            <Check className="relative w-3.5 h-3.5 text-emerald-600" strokeWidth={3} />
                                        </span>
                                    )
                                    : (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="relative w-6 h-6 flex items-center justify-center shrink-0 cursor-help">
                                                        <span className="absolute -inset-1 rounded-full bg-red-100" />
                                                        <span className="absolute inset-0 rounded-full border-2 border-destructive" />
                                                        <X className="relative w-3.5 h-3.5 text-destructive" strokeWidth={3} />
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-[240px] text-xs">
                                                    La diferencia entre el saldo bancario y el saldo total debe de ser 0
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-border overflow-hidden">
                    <div className="p-4 border-b border-border">
                        <h3 className="text-sm font-bold text-foreground">Información adicional</h3>
                    </div>
                    <p className="text-xs text-muted-foreground px-4 pt-4">Completa estos valores una vez seleccionadas todas las transacciones que deseas conciliar.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Gastos bancarios</label>
                            <div className={bankChargesError ? moneyWrapperErrorClass : moneyWrapperClass}>
                                <span className={moneyPrefixClass}>$</span>
                                <input
                                    type="number"
                                    value={bankCharges}
                                    onChange={(e) => setBankCharges(e.target.value)}
                                    onBlur={() => markTouched("bankCharges")}
                                    disabled={isCompleted}
                                    className={moneyInputClass}
                                />
                                {bankChargesError && <AlertCircle className="w-4 h-4 text-destructive mr-2 shrink-0" />}
                            </div>
                            {bankChargesError && <p className="text-xs text-destructive">{bankChargesError}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Impuestos bancarios</label>
                            <div className={bankTaxesError ? moneyWrapperErrorClass : moneyWrapperClass}>
                                <span className={moneyPrefixClass}>$</span>
                                <input
                                    type="number"
                                    value={bankTaxes}
                                    onChange={(e) => setBankTaxes(e.target.value)}
                                    onBlur={() => markTouched("bankTaxes")}
                                    disabled={isCompleted}
                                    className={moneyInputClass}
                                />
                                {bankTaxesError && <AlertCircle className="w-4 h-4 text-destructive mr-2 shrink-0" />}
                            </div>
                            {bankTaxesError && <p className="text-xs text-destructive">{bankTaxesError}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Entradas bancarias</label>
                            <div className={bankOtherEntriesError ? moneyWrapperErrorClass : moneyWrapperClass}>
                                <span className={moneyPrefixClass}>$</span>
                                <input
                                    type="number"
                                    value={bankOtherEntries}
                                    onChange={(e) => setBankOtherEntries(e.target.value)}
                                    onBlur={() => markTouched("bankOtherEntries")}
                                    disabled={isCompleted}
                                    className={moneyInputClass}
                                />
                                {bankOtherEntriesError && <AlertCircle className="w-4 h-4 text-destructive mr-2 shrink-0" />}
                            </div>
                            {bankOtherEntriesError && <p className="text-xs text-destructive">{bankOtherEntriesError}</p>}
                        </div>
                    </div>
                </div>

                <ReconciliationMovementsTable
                    movements={movements}
                    checkedIds={checkedIds}
                    onToggleLine={toggleLine}
                    isCompleted={isCompleted}
                    currentReconciliationId={reconciliation.id}
                    loading={isLoading}
                    onRefresh={() => refetch()}
                />

                {!isCompleted && (
                    <div className="flex justify-end gap-3 pb-6">
                        <Button variant="outline" onClick={handlePostpone} disabled={updateMutation.isPending} className="cursor-pointer">
                            Posponer
                        </Button>
                        <Button
                            onClick={handleReconcile}
                            disabled={completeMutation.isPending || bankBalance === "" || !differenceIsZero || hasFieldErrors}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {completeMutation.isPending ? "Conciliando..." : "Conciliar"}
                        </Button>
                    </div>
                )}
            </div>

            <Dialog open={!!pendingDraft} onOpenChange={() => {}}>
                <DialogContent
                    className="sm:max-w-[420px] bg-white"
                    hideClose
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle>¡Retoma tu conciliación!</DialogTitle>
                        <DialogDescription>
                            Encontramos un borrador guardado automáticamente el{" "}
                            <span className="font-semibold text-foreground">
                                {pendingDraft ? new Date(pendingDraft.savedAt).toLocaleString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }) : ""}
                            </span>
                            . ¿Deseas continuar donde lo dejaste?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleDiscardDraft} className="cursor-pointer">Descartar</Button>
                        <Button onClick={handleContinueDraft} className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                            Sí, seguir editando
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
