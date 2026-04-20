import * as React from "react";

interface LoaderProps {
    text?: string;
    className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ text = "Cargando...", className = "" }) => (
    <span className={`flex items-center justify-center gap-2 text-gray-500 ${className}`}>
        <svg className="animate-spin h-5 w-5 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <circle className="opacity-100" cx="20" cy="12" r="2" fill="currentColor" />
        </svg>
        {text}
    </span>
);
