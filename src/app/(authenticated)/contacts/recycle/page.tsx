"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, Eye, RotateCcw, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarInitials } from "@/components/contact/table/columns";
import { ContactTablePagination } from "@/components/contact/table/ContactTablePagination";
import { useTrashedContactsList } from "@/hooks/contacts/useContacts";
import { useDebounce } from "@/hooks/useDebounce";
import { ContactsService } from "@/lib/contacts";
import { showToast } from "@/components/sonner/CustomToaster";

type ContactType = "all" | "customer" | "provider";

export default function ContactsRecyclePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<ContactType>("all");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [fetchKey, setFetchKey] = React.useState(0);
  const [restoringId, setRestoringId] = React.useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const debouncedSearch = useDebounce(search, 600);

  const params = React.useMemo(() => {
    const obj: Record<string, any> = { current_page: page, per_page: perPage };
    if (activeTab !== "all") obj.role = activeTab;
    if (debouncedSearch) obj.search = debouncedSearch;
    return obj;
  }, [activeTab, debouncedSearch, page, perPage]);

  const { data, isLoading, isFetching, refetch } = useTrashedContactsList({ params, enabled: true, fetchKey });

  const rawContacts = data?.contacts ?? [];
  const contactsData = rawContacts.map((c: any) => {
    const isCustomer = c.type_contacts?.some((tc: any) => tc.id === 1);
    const isProvider = c.type_contacts?.some((tc: any) => tc.id === 2);

    return {
      id: c.id,
      name: c.registration_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || c.identification_number || "Sin nombre",
      identification: c.identification_number || "",
      phone: c.phone1 || c.phone2 || "",
      type: isCustomer && isProvider ? "both" : isProvider ? "provider" : "customer",
    };
  });

  const pagination = data?.pagination ?? { current_page: 1, per_page: perPage, total: 0, last_page: 1, from: 0, to: 0 };
  const hasSearch = Boolean(search.trim());

  const handleRefreshTable = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const handleRestore = async (id: number, name: string) => {
    setRestoringId(id);
    try {
      await ContactsService.restore(id);
      showToast(`"${name}" fue restaurado y ya está disponible en tu lista de contactos.`, "success", "Contacto restaurado");
      await refetch();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Ocurrió un error al restaurar el contacto";
      showToast(`Error: ${msg}`, "error");
    } finally {
      setRestoringId(null);
    }
  };

  const tabs: { key: ContactType; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "customer", label: "Clientes" },
    { key: "provider", label: "Proveedores" },
  ];

  return (
    <div className="w-full min-h-screen text-foreground">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="mb-6">
          <h1 className="page-title mb-0">Papelera de contactos</h1>
          <p className="page-subtitle mb-0">
            Revisa tus contactos eliminados y restaura los que necesites utilizar de nuevo.
          </p>
        </div>

        <div className="border-b border-border mb-4">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setFetchKey((k) => k + 1);
                }}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar"
                className="pl-9 h-9 border-slate-200 focus:border-primary focus:ring-primary"
              />
            </div>
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800 font-medium">
              <Filter className="w-4 h-4 mr-2" /> Filtrar
            </Button>
          </div>

          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-border">
                  <th className="h-9 px-4 text-xs font-medium text-muted-foreground">Nombre</th>
                  <th className="h-9 px-4 text-xs font-medium text-muted-foreground">Identificación</th>
                  <th className="h-9 px-4 text-xs font-medium text-muted-foreground">Teléfono</th>
                  <th className="h-9 px-4 text-xs font-medium text-muted-foreground">Tipo</th>
                  <th className="h-9 px-4 text-xs font-medium text-muted-foreground text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {contactsData.length ? (
                  contactsData.map((contact: any) => (
                    <tr
                      key={contact.id}
                      className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/contacts/${contact.id}`)}
                    >
                      <td className="h-12 px-4">
                        <div className="flex items-center gap-2">
                          <AvatarInitials name={contact.name} />
                          <span className="text-xs text-foreground font-medium">{contact.name}</span>
                        </div>
                      </td>
                      <td className="h-12 px-4 text-xs text-muted-foreground">{contact.identification}</td>
                      <td className="h-12 px-4 text-xs text-muted-foreground">{contact.phone}</td>
                      <td className="h-12 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {(contact.type === "customer" || contact.type === "both") && (
                            <span className="inline-flex px-2 py-0.5 text-[10px] rounded-full font-medium bg-primary/10 text-primary uppercase">
                              Cliente
                            </span>
                          )}
                          {(contact.type === "provider" || contact.type === "both") && (
                            <span className="inline-flex px-2 py-0.5 text-[10px] rounded-full font-medium bg-secondary/20 text-foreground uppercase">
                              Proveedor
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="h-12 px-4">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-gray-100"
                            onClick={() => router.push(`/contacts/${contact.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-gray-100"
                            disabled={restoringId === contact.id}
                            onClick={() => handleRestore(contact.id, contact.name)}
                          >
                            {restoringId === contact.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <RotateCcw className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="hover:bg-transparent">
                    <td colSpan={5} className="h-64 bg-card text-center align-middle">
                      <div className="flex h-full flex-col items-center justify-center py-8 gap-3">
                        <Trash2 className="w-8 h-8 text-muted-foreground/40" />
                        {hasSearch ? (
                          <>
                            <div className="text-lg font-semibold text-foreground">Sin resultados</div>
                            <div className="text-sm text-muted-foreground">La búsqueda no arrojó contactos eliminados</div>
                          </>
                        ) : (
                          <>
                            <div className="text-xl font-semibold text-foreground">Tu papelera está vacía</div>
                            <div className="text-sm text-muted-foreground max-w-sm">
                              No hay contactos eliminados en este momento.
                              <br />
                              Cuando elimines alguno, aquí es donde aparecerán.
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {(isLoading || isFetching || isRefreshing) && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-ring/25 border-t-primary" />
              </div>
            )}
          </div>

          <ContactTablePagination
            page={page}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
            pagination={pagination}
            onRefresh={handleRefreshTable}
            refreshing={isRefreshing}
          />
        </div>
      </div>
    </div>
  );
}
