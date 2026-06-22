"use client";

import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Software } from "@/lib/softwares";
import { Skeleton } from "@/components/ui/skeleton";

interface SoftwareListProps {
  software: Software | null;
  loading: boolean;
}

export function SoftwareList({ software, loading }: SoftwareListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Nombre</TableHead>
              <TableHead>Identificador</TableHead>
              <TableHead>PIN</TableHead>
              <TableHead>Fecha Creación</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
              <TableCell><Skeleton className="h-6 w-[60px] rounded-full" /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!software) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-8 text-center text-gray-500">
        No tienes ningún software configurado.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Nombre</TableHead>
            <TableHead>Identificador</TableHead>
            <TableHead>PIN</TableHead>
            <TableHead>Fecha Creación</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium text-primary">
              {software.name || "Software Propio"}
            </TableCell>
            <TableCell className="font-mono text-xs">{software.software_identifier}</TableCell>
            <TableCell className="font-mono text-xs tracking-widest">{software.software_pin}</TableCell>
            <TableCell>{software.created_at}</TableCell>
            <TableCell>
              {software.is_active ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none shadow-none font-medium">Activo</Badge>
              ) : (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none shadow-none font-medium">Inactivo</Badge>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
