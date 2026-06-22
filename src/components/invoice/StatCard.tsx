import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export interface InvoiceStats {
  icon: LucideIcon;
  label: string;
  value: number | string;
  iconBgColor?: string;
  iconColor?: string;
}

interface StatCardProps {
  stat: InvoiceStats;
}

export function StatCard({ stat }: StatCardProps) {
  const Icon = stat.icon;

  return (
    <Card
      className="border border-gray-200 transition-all duration-150 hover:border-primary focus-within:border-primary outline-none"
      tabIndex={0}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 ${stat.iconBgColor || 'bg-gray-100'} flex items-center justify-center flex-shrink-0 rounded-full`}
          >
            <Icon className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-0.5">{stat.label}</div>
            <div className="text-lg font-bold text-gray-900">{stat.value}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
