import React from "react";

export function LogoDC({ className = "", ...props }: React.HTMLProps<HTMLImageElement>) {
    return (
        <img
            src="/img/logo-dc.png"
            alt="D&C IDEM Logo"
            className={`h-7 ${className}`}
            {...props}
        />
    );
}
