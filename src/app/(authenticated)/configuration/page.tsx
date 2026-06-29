"use client"

import { CompanySummaryCard } from '@/components/configuration/CompanySummaryCard';
import { ConfigurationGrid } from '@/components/configuration/ConfigurationGrid';

export default function ConfigurationPage() {
  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto py-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
      </div>
      <CompanySummaryCard />
      <ConfigurationGrid />
    </div>
  );
}
