"use client";
import { useState } from 'react';
import { MoreHorizontal, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Invoice } from '@/data/InvoiceMockData';

interface InvoiceTableProps {
  invoices: Invoice[];
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSelectAll = () => {
    if (selectedInvoices.size === invoices.length) {
      setSelectedInvoices(new Set());
    } else {
      setSelectedInvoices(new Set(invoices.map(inv => inv.id)));
    }
  };

  const toggleSelectInvoice = (id: string) => {
    const newSelection = new Set(selectedInvoices);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedInvoices(newSelection);
  };

  const getEstadoDianBadge = (estado: Invoice['estadoDian']) => {
    switch (estado) {
      case 'aprobada':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-green-700">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Aprobada
          </span>
        );
      default:
        return null;
    }
  };

  const getEstadoBadge = (estado: Invoice['estado']) => {
    const styles = {
      cobrada: 'bg-green-100 text-green-700',
      parcial: 'bg-yellow-100 text-yellow-700',
      pendiente: 'bg-blue-100 text-blue-700',
      vencida: 'bg-red-100 text-red-700',
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${styles[estado]}`}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar cliente"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedInvoices.size === invoices.length}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-700">Número</TableHead>
              <TableHead className="text-xs font-medium text-gray-700">Cliente</TableHead>
              <TableHead className="text-xs font-medium text-gray-700">Creación</TableHead>
              <TableHead className="text-xs font-medium text-gray-700">Vencimiento</TableHead>
              <TableHead className="text-xs font-medium text-gray-700 text-right">Total</TableHead>
              <TableHead className="text-xs font-medium text-gray-700 text-right">Por cobrar</TableHead>
              <TableHead className="text-xs font-medium text-gray-700">Estado DIAN</TableHead>
              <TableHead className="text-xs font-medium text-gray-700">Estado</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox 
                    checked={selectedInvoices.has(invoice.id)}
                    onCheckedChange={() => toggleSelectInvoice(invoice.id)}
                  />
                </TableCell>
                <TableCell className="text-xs text-gray-900 font-medium">{invoice.numero}</TableCell>
                <TableCell className="text-xs text-gray-900">{invoice.cliente}</TableCell>
                <TableCell className="text-xs text-gray-600">{invoice.fechaCreacion}</TableCell>
                <TableCell className="text-xs text-gray-600">{invoice.fechaVencimiento}</TableCell>
                <TableCell className="text-xs text-gray-900 font-medium text-right">
                  $ {invoice.total.toLocaleString()}
                </TableCell>
                <TableCell className="text-xs text-gray-900 text-right">
                  $ {invoice.porCobrar.toLocaleString()}
                </TableCell>
                <TableCell>{getEstadoDianBadge(invoice.estadoDian)}</TableCell>
                <TableCell>{getEstadoBadge(invoice.estado)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ver</DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Descargar PDF</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
