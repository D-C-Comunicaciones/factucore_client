"use client"

import { ReportsCategoryGrid, ReportsHeader, ReportsSearchBar } from "@/components/report/ReportsSections";

export default function ReportesPage() {
  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto py-4">
      <ReportsHeader />
      <ReportsSearchBar />
      <ReportsCategoryGrid />
    </div>
  );
}
