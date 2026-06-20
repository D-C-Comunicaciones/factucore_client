"use client";

import * as React from 'react';
import { Plus, ChevronDown, FileEdit, Upload, Download, Trash2, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ContactTable } from '@/components/contact/ContactTable';
import { useContactsList } from '@/hooks/contacts/useContacts';
import { AddContactModal } from "@/components/contact/new/AddContactModal";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useDebounce } from '@/hooks/useDebounce';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getCoreRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { getContactColumns } from "@/components/contact/table/columns";

type ContactType = 'all' | 'customer' | 'provider';

interface Contact {
  id: number;
  name: string;
  identification: string;
  phone: string;
  type: 'customer' | 'provider';
}

export default function ContactPage() {
  const [activeTab, setActiveTab] = React.useState<ContactType>('all');
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [fetchKey, setFetchKey] = React.useState(0);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const catalogData = useCatalogs();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const debouncedSearch = useDebounce(search, 600);

  const params = React.useMemo(() => {
    const obj: Record<string, any> = {
      current_page: page,
      per_page: perPage,
    };

    if (activeTab !== 'all') {
      obj.role = activeTab; // 'customer' or 'provider'
    }

    if (debouncedSearch) {
      obj.search = debouncedSearch;
    }

    return obj;
  }, [activeTab, debouncedSearch, page, perPage]);

  const { data, isLoading, isFetching, refetch } = useContactsList({
    params,
    enabled: true,
    fetchKey
  });

  const rawContacts = data?.contacts ?? data?.data ?? [];
  const contactsData = rawContacts.map((c: any) => {
    const isCustomer = c.type_contact_ids?.includes(1) || c.type_contacts?.some((tc: any) => tc.id === 1);
    return {
      id: c.id,
      name: c.registration_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || c.identification_number || "Sin nombre",
      identification: c.identification_number || "",
      phone: c.phone1 || c.phone2 || "",
      type: isCustomer ? "customer" : "provider"
    };
  });
  const serverPagination = data?.pagination ?? data?.meta ?? {
    current_page: 1,
    per_page: perPage,
    total: 0,
    last_page: 1,
    from: 0,
    to: 0,
  };

  const handleDelete = React.useCallback((id: number) => {
    console.log('Delete contact:', id);
  }, []);

  const columns = React.useMemo(() => getContactColumns(handleDelete), [handleDelete]);

  const table = useReactTable({
    data: contactsData,
    columns,
    getRowId: (row) => String(row.id),
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRefreshTable = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const tabs = [
    { key: 'all' as ContactType, label: 'Todos' },
    { key: 'customer' as ContactType, label: 'Clientes' },
    { key: 'provider' as ContactType, label: 'Proveedores' },
  ];

  return (
    <div className="w-full min-h-screen text-foreground">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">

        {/* HEADER */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">

            <h1 className="page-title mb-0">
              Contactos
            </h1>

            <div className="flex items-center gap-2">

              {/* Papelera */}
              <Button
                variant="outline"
                className="btn-base border-border text-foreground hover:bg-primary/10 hover:text-foreground"
              >
                <Trash2 className="w-4 h-4 mr-1 text-foreground" />
                Papelera
              </Button>

              {/* Más acciones */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="btn-base border-border bg-white text-foreground hover:bg-primary/10 hover:text-foreground"
                  >
                    Más acciones
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-popover text-popover-foreground border border-border"
                >
                  <DropdownMenuItem
                    className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors text-base py-2"
                  >
                    <Upload className="w-4 h-4 mr-2 text-primary" />
                    Importar Contactos
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors text-base py-2"
                  >
                    <Download className="w-4 h-4 mr-2 text-primary" />
                    Exportar a Excel
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors text-base py-2"
                  >
                    <Download className="w-4 h-4 mr-2 text-primary" />
                    Exportar personas asociadas a Excel
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors text-base py-2"
                  >
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    Historial de operaciones masivas
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Nuevo contacto */}
              <Button
                onClick={() => setIsModalOpen(true)}
                className="btn-base bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-1" />
                Nuevo contacto
              </Button>
            </div>
          </div>

          <p className="page-subtitle mb-0">
            Crea tus clientes, proveedores y demás contactos para asociarlos en tus documentos.
          </p>
        </div>

        {/* TABS */}
        <div className="border-b border-border mb-4">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setFetchKey(k => k + 1);
                }}
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* TABLE */}
        <div className="w-full">
          <ContactTable
            contacts={contactsData}
            loading={isLoading || isFetching || isRefreshing}
            refreshing={isRefreshing}
            onRefresh={handleRefreshTable}
            activeTab={activeTab}
            search={search}
            setSearch={setSearch}
            page={page}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
            pagination={serverPagination}
            onDelete={handleDelete}
          />
        </div>

      </div>

      <AddContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        catalogData={catalogData}
        onCustomerCreated={() => {
          refetch();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}