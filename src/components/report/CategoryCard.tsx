import { ReactNode } from 'react';
import Link from 'next/link';

interface CategoryCardProps {
  title: string;
  count: number;
  icon: ReactNode;
  iconColorClass?: string;
  isNew?: boolean;
  href?: string;
}

export function CategoryCard({ 
  title, 
  count, 
  icon, 
  iconColorClass = "text-primary", 
  isNew,
  href = "#"
}: CategoryCardProps) {
  return (
    <Link 
      href={href}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col items-start gap-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className={`${iconColorClass}`}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-foreground text-base">{title}</h3>
        <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
          {count} {count === 1 ? 'reporte' : 'reportes'}
          {isNew && (
            <span className="text-primary font-medium text-xs">
              ¡Nuevo!
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
