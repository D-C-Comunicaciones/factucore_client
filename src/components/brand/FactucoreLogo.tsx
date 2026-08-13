import React from "react";
import { cn } from "@/lib/utils";

export interface FactucoreLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    variant?: "icon" | "horizontal";
}

export function FactucoreLogo({ variant = "icon", className, alt = "Factucore Logo", ...props }: FactucoreLogoProps) {
    const src = variant === "horizontal" 
        ? "/img/factucore_logo_horizontal.webp" 
        : "/img/factucore_logo.webp";

    return (
        <img
            src={src}
            alt={alt}
            className={cn("object-contain", className)}
            {...props}
        />
    );
}
