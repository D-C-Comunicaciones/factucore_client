import Link from 'next/link';
import { Search, HelpCircle, DollarSign, BarChart2, Wallet, FileText, ClipboardList, Briefcase, Calculator, Star } from 'lucide-react';
import { CategoryCard } from './CategoryCard';

export function ReportsCategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
      <CategoryCard title="Ventas" count={7} icon={<DollarSign className="w-5 h-5" />} iconColorClass="text-green-600" />
      <CategoryCard title="Administrativos" count={7} icon={<BarChart2 className="w-5 h-5" />} iconColorClass="text-teal-500" />
      <CategoryCard title="Financieros" count={1} icon={<Wallet className="w-5 h-5" />} iconColorClass="text-orange-500" />
      <CategoryCard title="Contables" count={8} icon={<FileText className="w-5 h-5" />} iconColorClass="text-yellow-500" isNew />
      <CategoryCard title="Fiscales" count={4} icon={<ClipboardList className="w-5 h-5" />} iconColorClass="text-red-500" />
      <CategoryCard title="Para trabajar" count={3} icon={<Briefcase className="w-5 h-5" />} iconColorClass="text-indigo-500" />
      <CategoryCard title="Información exógena" count={8} icon={<Calculator className="w-5 h-5" />} iconColorClass="text-purple-600" />
      <CategoryCard title="Favoritos" count={0} icon={<Star className="w-5 h-5" />} iconColorClass="text-gray-400" />
    </div>
  );
}

export function ReportsHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Reportes</h1>
        <p className="text-muted-foreground text-sm">
          Obtén una visión completa de la información contable, administrativa y fiscal de tu empresa.
        </p>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <button className="flex items-center gap-1.5 text-primary text-sm font-medium hover:bg-primary/10 px-3 py-1.5 rounded-md transition-colors cursor-pointer">
          <HelpCircle className="w-4 h-4" /> Ayuda
        </button>
        <Link
          href="/reports/historial"
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2 px-4 rounded-md transition-colors"
        >
          Historial de exportables
        </Link>
      </div>
    </div>
  );
}

export function ReportsSearchBar() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
      <h2 className="text-lg font-semibold text-foreground">Clasificación por categoría</h2>
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar reporte"
          className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white"
        />
      </div>
    </div>
  );
}
