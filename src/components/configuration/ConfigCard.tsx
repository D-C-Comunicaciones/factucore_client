import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import { ReactNode } from 'react';

export interface ConfigLink {
  label: string;
  href: string;
  showHelpIcon?: boolean;
}

interface ConfigCardProps {
  title: string;
  description?: string;
  links?: ConfigLink[];
  customContent?: ReactNode;
}

export function ConfigCard({ title, description, links, customContent }: ConfigCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden border-b-4 border-b-primary">
      <div className="p-6 flex flex-col h-full">
        <h3 className="text-primary text-lg font-medium mb-4">{title}</h3>
        
        {description && (
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            {description}
          </p>
        )}

        {customContent && (
          <div className="mb-6">
            {customContent}
          </div>
        )}

        {links && links.length > 0 && (
          <ul className="space-y-3 mt-auto">
            {links.map((link, idx) => (
              <li key={idx}>
                <Link 
                  href={link.href}
                  className="text-primary hover:underline text-sm flex items-center gap-1.5"
                >
                  {link.label}
                  {link.showHelpIcon && (
                    <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
