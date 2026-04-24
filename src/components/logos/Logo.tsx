import React from "react";

export function Logo({ className = "", ...props }: React.HTMLProps<HTMLImageElement>) {
    return (
        <img
            src="/img/factucore_logo.png"
            alt="Factucore S.A.S."
            className={`h-full object-contain ${className}`}
            {...props}
        />
    );
}
