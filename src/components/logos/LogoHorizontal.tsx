export function LogoHorizontal({ className = "", ...props }: React.HTMLProps<HTMLImageElement>) {
    return (
        <img
            src="/img/factucore_logo_horizontal.webp"
            alt="Factucore S.A.S."
            className={`object-contain ${className}`}
            {...props}
        />
    );
}