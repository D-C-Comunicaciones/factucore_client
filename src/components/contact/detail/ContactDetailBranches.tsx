import React from "react";
import { Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ContactDetailBranchesProps {
    contact: any;
}

export function ContactDetailBranches({ contact }: ContactDetailBranchesProps) {
    // Assuming contact.branches might exist in the future, currently we'll show an empty state if none
    const branches = contact.branches || [];

    return (
        <section className="mt-12">
            <h2 className="text-[17px] font-bold text-[#0F2843] mb-1">Sucursales</h2>
            <p className="text-sm text-slate-500 mb-6">
                Registra las sucursales de tu cliente y úsalas para que tus facturas queden asociadas a la sede que corresponde.
            </p>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
                {/* Table Header Controls */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-64">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <Input 
                                type="text" 
                                placeholder="Buscar" 
                                className="pl-9 h-9 border-slate-200 focus:border-primary focus:ring-primary"
                            />
                        </div>
                        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800 h-9 font-medium">
                            <Filter className="w-4 h-4 mr-2" />
                            Filtrar
                        </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90 hover:bg-primary/10 h-9 font-medium">
                        + Agregar sucursal
                    </Button>
                </div>

                {/* Table Content */}
                {branches.length === 0 ? (
                    <div className="bg-slate-50/50 py-24 flex items-center justify-center border-b border-slate-200">
                        <p className="text-slate-500 text-[15px]">No hay contenido disponible</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Nombre</th>
                                    <th className="px-6 py-3 font-medium">Dirección</th>
                                    <th className="px-6 py-3 font-medium">Teléfono</th>
                                </tr>
                            </thead>
                            <tbody>
                                {branches.map((branch: any, idx: number) => (
                                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-6 py-4">{branch.name}</td>
                                        <td className="px-6 py-4">{branch.address}</td>
                                        <td className="px-6 py-4">{branch.phone}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Table Footer */}
                <div className="flex items-center justify-end p-3 bg-white text-sm text-slate-500 gap-4">
                    <span>1-{Math.max(1, branches.length)} de {Math.max(1, branches.length)}</span>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 cursor-not-allowed" disabled>&lt;</Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 cursor-not-allowed" disabled>&gt;</Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
