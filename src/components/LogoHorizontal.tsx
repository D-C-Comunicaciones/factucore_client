import React from "react";

export function LogoHorizontal({ className = "", ...props }: React.HTMLProps<HTMLImageElement>) {
    return (
        <img
            src="/img/logo-horizontal.png"
            alt="D&C IDEM COMUNICACIÓN S.A.S."
            className={`h-7 ${className}`}
            {...props}
        />
    );
}
