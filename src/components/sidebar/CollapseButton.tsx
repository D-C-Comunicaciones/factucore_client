import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CollapseButtonProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  className?: string
}

export function CollapseButton({
  isCollapsed,
  onToggleCollapse,
  className = ""
}: CollapseButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse?.();
          }}
          className={`
            p-2 rounded-lg hidden lg:flex ml-2
            items-center justify-center
            hover:bg-gray-100 transition-colors
            ${className}
          `}
          aria-label={isCollapsed ? "Mostrar menú" : "Ocultar menú"}
          type="button"
        >
          {isCollapsed ? (
            <PanelLeftClose className="w-5 h-5 text-gray-500" />
          ) : (
            <PanelLeftOpen className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </TooltipTrigger>

      <TooltipContent
        side="bottom"
        className="
      bg-foreground text-white
      text-xs font-semibold
      shadow-lg px-3 py-1 rounded z-50 border-none
  "
      >
        {isCollapsed ? "Mostrar menú" : "Ocultar menú"}
      </TooltipContent>
    </Tooltip>
  );
}