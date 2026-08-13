import React from "react";
import { FactucoreLogo } from "@/components/brand/FactucoreLogo";

export function Logo({ className = "", ...props }: React.HTMLProps<HTMLImageElement>) {
    return (
        <FactucoreLogo
            variant="icon"
            className={`h-full ${className}`}
            {...props as any}
        />
    );
}
