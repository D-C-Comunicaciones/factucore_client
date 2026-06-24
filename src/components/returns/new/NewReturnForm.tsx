"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { HelpCircle, Edit2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { DatePickerSimple } from '@/components/ui/DatePickerSimple';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { AuthService } from '@/lib/auth';
import { ContactsService } from '@/lib/contacts';
import { useResolutions } from '@/hooks/useResolutions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function NewReturnForm() {
    const router = useRouter();
    const [docType, setDocType] = useState('nota-credito');

    const [selectedType, setSelectedType] = useState<string>('Otros');
    const [date, setDate] = useState<Date>(new Date(2026, 5, 23));

    // Company info
    const [companyName, setCompanyName] = useState('...');
    const [companyNit, setCompanyNit] = useState('...');

    const [clientId, setClientId] = useState<string>('');
    const [clientOptions, setClientOptions] = useState<{ value: string, label: string }[]>([]);
    const [loadingCustomers, setLoadingCustomers] = useState(false);

    // Resolutions Modal state
    const [isNumerationModalOpen, setIsNumerationModalOpen] = useState(false);
    const [resolutionsOptions, setResolutionsOptions] = useState<{ value: string, label: string, next_consecutive?: number, prefix?: string }[]>([]);
    const [selectedResolution, setSelectedResolution] = useState<string>('');
    const [nextNumber, setNextNumber] = useState<string>('1');
    const [currentPrefix, setCurrentPrefix] = useState<string>('');

    useEffect(() => {
        // Load company info
        const comp: any = AuthService.getCompany();
        if (comp) {
            setCompanyName(comp.company_name || comp.name || 'Empresa');
            const nit = comp.identification_number || 'NIT';

            // Replicate exactly the logic from invoices/new
            const dvPart = comp.verification_digit != null && comp.verification_digit !== ''
                ? `-${comp.verification_digit}`
                : (comp.dv != null && comp.dv !== '' ? `-${comp.dv}` : '');

            setCompanyNit(`${nit}${dvPart}`);
        }
    }, []);

    const loadCustomers = async () => {
        setLoadingCustomers(true);
        try {
            const res = await ContactsService.list({ role: 'customer' });
            let data = res?.data?.data || [];
            if (!Array.isArray(data) && Array.isArray(res?.data)) {
                data = res.data;
            } else if (!Array.isArray(data) && res?.data?.contacts && Array.isArray(res.data.contacts)) {
                data = res.data.contacts;
            }
            const opts = data.map((c: any) => ({
                value: c.id.toString(),
                label: c.registration_name || `${c.first_name || ''} ${c.last_name || ''}`.trim() || c.identification_number
            }));
            setClientOptions(opts);
        } catch (e) {
            console.error("Error al cargar clientes:", e);
        } finally {
            setLoadingCustomers(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    const { resolutions } = useResolutions({ type_resolution: 3, is_active: true });

    useEffect(() => {
        if (resolutions && resolutions.length > 0) {
            const opts = resolutions.map((r: any) => {
                let displayName = r.name || r.description || r.resolution_text || r.resolution_number || `Resolución ${r.id}`;
                if (r.prefix) {
                    const regex = new RegExp(`^${r.prefix}\\s*[-]?\\s*`, 'i');
                    displayName = displayName.replace(regex, '');
                }
                return {
                    value: r.id.toString(),
                    label: displayName,
                    next_consecutive: r.next_consecutive || r.initial_range || 1,
                    prefix: r.prefix || '',
                    is_main: r.is_main
                };
            });
            setResolutionsOptions(opts);

            if (!selectedResolution) {
                const mainRes = opts.find((o: any) => o.is_main) || opts[0];
                setSelectedResolution(mainRes.value);
                setNextNumber(mainRes.next_consecutive?.toString() || '1');
                setCurrentPrefix(mainRes.prefix || '');
            }
        }
    }, [resolutions]);

    const openNumerationModal = () => {
        setIsNumerationModalOpen(true);
    };

    const handleResolutionChange = (val: string) => {
        setSelectedResolution(val);
        const res = resolutionsOptions.find(r => r.value === val);
        if (res) {
            setNextNumber(res.next_consecutive?.toString() || '1');
            setCurrentPrefix(res.prefix || '');
        }
    };

    const baseInput = "bg-white h-[34px] pl-3 pr-3 text-sm border border-foreground/20 shadow-none text-foreground transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none flex items-center w-full rounded-xl box-border";

    const creditNoteTypes = [
        { value: "Devolución parcial de los bienes y/o no aceptación parcial del servicio", label: "Devolución parcial de los bienes y/o no aceptación parcial del servicio" },
        { value: "Anulación de factura", label: "Anulación de factura" },
        { value: "Rebaja o descuento parcial o total", label: "Rebaja o descuento parcial o total" },
        { value: "Ajuste de precio", label: "Ajuste de precio" },
        { value: "Otros", label: "Otros" },
        { value: "Descuento comercial por pronto pago", label: "Descuento comercial por pronto pago" },
        { value: "Descuento comercial por volumen de ventas", label: "Descuento comercial por volumen de ventas" }
    ];

    const invoiceOptions = [
        { value: "1", label: "Factura 1" },
        { value: "2", label: "Factura 2" }
    ];

    return (
        <div className="w-full">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">

                {/* Section: Document Type */}
                <div className="p-6 border-b border-slate-100">
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                        Tipo de documento <span className="text-primary">*</span>
                    </label>
                    <div className="inline-flex bg-slate-50 p-1 rounded-lg">
                        <button
                            type="button"
                            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${docType === 'nota-credito'
                                ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                            onClick={() => setDocType('nota-credito')}
                        >
                            Nota crédito
                        </button>
                        <button
                            type="button"
                            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${docType === 'nota-ajuste'
                                ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                            onClick={() => setDocType('nota-ajuste')}
                        >
                            Nota ajuste POS
                        </button>
                    </div>
                </div>

                {/* Section: Form fields */}
                <div className="p-6">
                    {/* Header info */}
                    <div className="flex justify-between items-end mb-8">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-bold text-slate-800">{companyName}</h2>
                            <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{companyNit}</span>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <div className="text-lg font-bold text-slate-800 tracking-tight">No. {currentPrefix}-{nextNumber}</div>
                            <div
                                className="text-xs text-slate-500 flex items-center justify-end gap-1 cursor-pointer hover:bg-slate-100 p-1.5 rounded-md transition-colors w-fit mt-0.5"
                                onClick={openNumerationModal}
                            >
                                {docType === 'nota-credito' ? 'Nota crédito' : 'Nota ajuste POS'}
                                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-b border-slate-100 pb-8">
                        {/* Cliente */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Cliente <span className="text-primary">*</span>
                            </label>
                            <SearchableSelect
                                value={clientId}
                                onValueChange={setClientId}
                                options={clientOptions}
                                placeholder={loadingCustomers ? "Cargando..." : "Seleccionar cliente"}
                                searchPlaceholder="Buscar cliente..."
                                emptyMessage={loadingCustomers ? "Cargando..." : "No se encontraron clientes."}
                                className={cn(baseInput, "w-full rounded-md")}
                            />
                        </div>

                        {/* Tipo de nota crédito */}
                        <div className="space-y-2 relative">
                            <div className="flex items-center gap-1">
                                <label className="block text-sm font-medium text-slate-700">
                                    Tipo de nota crédito <span className="text-primary">*</span>
                                </label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <HelpCircle className="w-4 h-4 text-primary cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="bg-[#1e293b] text-white p-3 max-w-xs text-xs font-normal border-0 leading-relaxed shadow-lg">
                                            Indica el motivo por el cual vas a realizar la nota crédito a tu cliente, aquí puedes conocer <a href="#" className="text-primary hover:underline font-medium">más detalles</a>.
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <SearchableSelect
                                value={selectedType}
                                onValueChange={setSelectedType}
                                options={creditNoteTypes}
                                placeholder="Seleccionar tipo..."
                                searchPlaceholder="Buscar tipo..."
                                emptyMessage="No se encontraron tipos."
                                className={cn(baseInput, "w-full rounded-md")}
                            />
                        </div>

                        {/* Fecha de creación */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Fecha de creación <span className="text-primary">*</span>
                            </label>
                            <DatePickerSimple
                                value={date}
                                onChange={setDate}
                            />
                        </div>
                    </div>

                    {/* Factura asociada */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-400">
                                Factura de venta asociada <span className="text-primary/70">*</span>
                            </label>
                            <SearchableSelect
                                value={""}
                                onValueChange={() => { }}
                                options={invoiceOptions}
                                placeholder="Buscar"
                                searchPlaceholder="Buscar factura..."
                                emptyMessage="No se encontraron facturas."
                                className={cn(baseInput, "w-full rounded-md opacity-50 cursor-not-allowed")}
                            />
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer Buttons */}
            <div className="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
                    onClick={() => router.push("/returns")}
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    className="px-6 py-2.5 bg-primary/50 text-primary-foreground rounded-lg text-sm font-medium cursor-not-allowed"
                >
                    Guardar
                </button>
            </div>

            {/* Numeration Modal */}
            <Dialog open={isNumerationModalOpen} onOpenChange={setIsNumerationModalOpen}>
                <DialogContent className="max-w-md p-0 overflow-hidden border-0 rounded-xl shadow-lg bg-white">
                    <DialogHeader className="px-6 py-4 border-b border-slate-100 flex flex-row items-center justify-between">
                        <DialogTitle className="text-base font-semibold text-slate-800">Cambiar numeración</DialogTitle>
                    </DialogHeader>

                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">
                                    Numeración <span className="text-primary">*</span>
                                </label>
                                <SearchableSelect
                                    value={selectedResolution}
                                    onValueChange={handleResolutionChange}
                                    options={resolutionsOptions}
                                    placeholder="Seleccionar..."
                                    searchPlaceholder="Buscar numeración..."
                                    emptyMessage="No se encontraron resoluciones."
                                    className={cn(baseInput, "w-full rounded-md")}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">
                                    Siguiente número <span className="text-primary/50">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={nextNumber}
                                    disabled
                                    className="bg-white h-[34px] pl-3 pr-3 text-sm border border-foreground/10 text-slate-400 outline-none flex items-center w-full rounded-xl box-border opacity-70 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                        <button
                            type="button"
                            onClick={() => setIsNumerationModalOpen(false)}
                            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsNumerationModalOpen(false)}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                            Guardar cambios
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
