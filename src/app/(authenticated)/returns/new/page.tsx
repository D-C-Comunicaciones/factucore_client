"use client";

import * as React from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { NewReturnForm } from '@/components/returns/new/NewReturnForm';
import { NewReturnSettingsDrawer, DEFAULT_RETURN_SEARCH_SETTINGS, type ReturnSearchSettings } from '@/components/returns/new/NewReturnSettingsDrawer';
import { useCatalogs } from '@/hooks/useCatalogs';
import { costCentersApi } from '@/lib/costCenters';

export default function NewReturnPage() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [searchSettings, setSearchSettings] = useState<ReturnSearchSettings>(DEFAULT_RETURN_SEARCH_SETTINGS);

    const catalogData = useCatalogs();
    const { data: costCentersResp } = useQuery({
        queryKey: ['costCenters', { is_active: true }],
        queryFn: async () => await costCentersApi.getCostCenters({ is_active: true }),
    });
    const costCentersData = Array.isArray(costCentersResp?.data?.['cost-centers'])
        ? costCentersResp.data['cost-centers']
        : (Array.isArray(costCentersResp?.data) ? costCentersResp.data : []);

    const warehouseOptions = catalogData.warehouses?.map((w: any) => ({ value: w.id.toString(), label: w.name })) || [];
    const priceListOptions = catalogData.priceLists?.map((pl: any) => ({ value: pl.id.toString(), label: pl.name })) || [];
    const costCenterOptions = costCentersData.map((cc: any) => ({ value: String(cc.id), label: cc.name, description: cc.description || "" }));

    return (
        <div className="w-full min-h-screen pb-20">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-primary mb-6 mt-2 font-medium">
                    <Link href="/returns" className="hover:underline">
                        Devoluciones en ventas
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-1 text-slate-400" />
                    <span className="text-slate-500">Nueva devolución</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                        Nueva devolución
                    </h1>
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="mt-4 md:mt-0 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                    >
                        Más ajustes
                    </button>
                </div>

                <NewReturnForm />
            </div>

            <NewReturnSettingsDrawer
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                settings={searchSettings}
                onSave={setSearchSettings}
                costCenterOptions={costCenterOptions}
                warehouseOptions={warehouseOptions}
                priceListOptions={priceListOptions}
            />
        </div>
    );
}
