import React from "react";
import { FactucoreLogo } from "@/components/brand/FactucoreLogo";

export function LogoHorizontal({ className = "", ...props }: React.HTMLProps<HTMLImageElement>) {
    return (
        <FactucoreLogo
            variant="horizontal"
            className={`${className}`}
            {...props as any}
        />
    );
}