"use client";

import * as React from 'react';
import { Plus, ChevronDown, FileEdit, Upload, Download, Trash2, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ContactTable } from '@/components/contact/ContactTable';
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
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [contacts] = React.useState<Contact[]>([]);

  const debouncedSearch = useDebounce(search, 600);

  const handleDelete = React.useCallback((id: number) => {
    console.log('Delete contact:', id);
  }, []);

  const columns = React.useMemo(() => getContactColumns(handleDelete), [handleDelete]);

  const filteredContacts = React.useMemo(() => {
    let result = contacts;

    if (activeTab !== 'all') {
      result = result.filter(c => c.type === activeTab);
    }

    if (debouncedSearch) {
      const lowerSearch = debouncedSearch.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(lowerSearch) ||
        c.identification.includes(lowerSearch) ||
        c.phone.includes(lowerSearch)
      );
    }

    return result;
  }, [contacts, search, activeTab, debouncedSearch]);

  const table = useReactTable({
    data: filteredContacts,
    columns,
    getRowId: (row) => String(row.id),
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
  });

  const pagination = {
    current_page: 1,
    per_page: perPage,
    total: filteredContacts.length,
    last_page: Math.ceil(filteredContacts.length / perPage),
    from: 1,
    to: filteredContacts.length,
  };

  const handleRefreshTable = React.useCallback(() => {
    setIsRefreshing(true);
    setFetchKey((k) => k + 1);

    window.setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  }, []);

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
            contacts={filteredContacts}
            loading={isRefreshing}
            refreshing={isRefreshing}
            onRefresh={handleRefreshTable}
            activeTab={activeTab}
            search={search}
            setSearch={setSearch}
            page={page}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
            pagination={pagination}
            onDelete={handleDelete}
          />
        </div>

      </div>
    </div>
  );
}