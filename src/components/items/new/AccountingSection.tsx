"use client";

import { SectionCard } from "./SectionCard";
import { HelpCircle, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { CreateAccountFlow } from "@/components/accounting/CreateAccountFlow";
import React from "react";

import { useCatalogs } from "@/hooks/useCatalogs";
import { useAccountsList } from "@/hooks/accounting/useAccounting";

type AccountField = "sales" | "inventory" | "cost";

const FIELD_TYPE_NAME: Record<AccountField, string> = {
  sales: "Ingreso",
  inventory: "Activo",
  cost: "Costo",
};

export function AccountingSection({
  salesAccountId,
  setSalesAccountId,
  inventoryAccountId,
  setInventoryAccountId,
  costAccountId,
  setCostAccountId,
}: {
  salesAccountId: number | undefined;
  setSalesAccountId: (id: number | undefined) => void;
  inventoryAccountId: number | undefined;
  setInventoryAccountId: (id: number | undefined) => void;
  costAccountId: number | undefined;
  setCostAccountId: (id: number | undefined) => void;
}) {
  // The catalog's own usage-tagged defaults (Ventas / Inventarios / Costo de venta) drive the
  // auto-selected default below; each picker's *options* are scoped by account type instead —
  // Ingreso for sales, Activo for inventory, Costo for cost — so any real matching account can be
  // assigned, not only the one or two that happen to carry that exact usage tag.
  const { salesAccounts, inventoryAccounts, costAccounts } = useCatalogs();
  const { data: allAccounts } = useAccountsList({ postable_only: true });

  const [newAccountField, setNewAccountField] = React.useState<AccountField | null>(null);

  const optionsFor = (field: AccountField) =>
    (allAccounts || [])
      .filter((a: any) => a.type === FIELD_TYPE_NAME[field])
      .map((a: any) => ({ value: String(a.id), label: a.code ? `${a.code} - ${a.name}` : a.name }));

  const salesAccountOptions = optionsFor("sales");
  const inventoryAccountOptions = optionsFor("inventory");
  const costAccountOptions = optionsFor("cost");

  React.useEffect(() => {
    if (!salesAccountId && salesAccounts.length > 0) {
      setSalesAccountId(salesAccounts[0].id);
    }
    if (!inventoryAccountId && inventoryAccounts.length > 0) {
      setInventoryAccountId(inventoryAccounts[0].id);
    }
    if (!costAccountId && costAccounts.length > 0) {
      setCostAccountId(costAccounts[0].id);
    }
  }, [salesAccounts, inventoryAccounts, costAccounts, salesAccountId, inventoryAccountId, costAccountId, setSalesAccountId, setInventoryAccountId, setCostAccountId]);

  const openNewAccount = (field: AccountField) => setNewAccountField(field);

  const handleAccountCreated = (field: AccountField, account: { id: number }) => {
    if (field === "sales") setSalesAccountId(account.id);
    if (field === "inventory") setInventoryAccountId(account.id);
    if (field === "cost") setCostAccountId(account.id);
  };

  const newAccountFooter = (field: AccountField) => (
    <button
      type="button"
      onClick={() => openNewAccount(field)}
      className="w-full flex items-center gap-1.5 px-2 py-1.5 text-sm text-primary hover:bg-primary/5 rounded-lg cursor-pointer transition-colors"
    >
      <Plus className="w-3.5 h-3.5" />
      Agregar nueva cuenta contable
    </button>
  );

  return (
    <SectionCard title="Configuración contable" defaultOpen={true}>
      <p className="text-sm text-muted-foreground mb-4">
        Configura las cuentas contables en las que se registrarán los movimientos.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">
            Cuenta Contable
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0} className="cursor-help outline-none"><HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" /></span>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-xs">
                Selecciona la cuenta contable en la que se registrarán los valores por ventas del producto.
              </TooltipContent>
            </Tooltip>
          </label>
          <SearchableSelect
            value={salesAccountId?.toString() || ""}
            onValueChange={(val) => setSalesAccountId(val ? Number(val) : undefined)}
            options={salesAccountOptions}
            placeholder="Seleccionar"
            searchPlaceholder="Buscar cuenta..."
            className="h-[34px] w-full"
            footer={newAccountFooter("sales")}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">
            Cuenta de inventario
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0} className="cursor-help outline-none"><HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" /></span>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-xs">
                Selecciona la cuenta contable en la que se registrarán los valores de entradas y salidas del producto.
              </TooltipContent>
            </Tooltip>
          </label>
          <SearchableSelect
            value={inventoryAccountId?.toString() || ""}
            onValueChange={(val) => setInventoryAccountId(val ? Number(val) : undefined)}
            options={inventoryAccountOptions}
            placeholder="Seleccionar"
            searchPlaceholder="Buscar cuenta..."
            className="h-[34px] w-full"
            footer={newAccountFooter("inventory")}
          />
        </div>
      </div>

      <div className="max-w-[50%]">
        <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">
          Cuenta de costo de venta
          <Tooltip>
            <TooltipTrigger asChild>
              <span><HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" /></span>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-xs">
              Selecciona la cuenta contable en la que se registrarán el valor del costo de venta del producto.
            </TooltipContent>
          </Tooltip>
        </label>
        <SearchableSelect
          value={costAccountId?.toString() || ""}
          onValueChange={(val) => setCostAccountId(val ? Number(val) : undefined)}
          options={costAccountOptions}
          placeholder="Seleccionar"
          searchPlaceholder="Buscar cuenta..."
          className="h-[34px] w-full"
          footer={newAccountFooter("cost")}
        />
      </div>

      {newAccountField && (
        <CreateAccountFlow
          open={Boolean(newAccountField)}
          onClose={() => setNewAccountField(null)}
          typeName={FIELD_TYPE_NAME[newAccountField]}
          onCreated={(account) => handleAccountCreated(newAccountField, account)}
        />
      )}
    </SectionCard>
  );
}
