import { Card, CardContent } from "@/components/ui/card";
import type { InvoiceStats } from "@/data/InvoiceMockData";

interface StatCardProps {
  stat: InvoiceStats;
}

export function StatCard({ stat }: StatCardProps) {
  const Icon = stat.icon;

  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${stat.iconBgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${stat.iconColor}`} />
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
