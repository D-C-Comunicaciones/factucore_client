// "Consumidor Final" es el contacto genérico DIAN (identificación 222222222222,
// ver ContactSeeder en el backend) que cada tenant trae por defecto para ventas
// a consumidor final. No se puede editar — mismo criterio que usa el backend
// (Contact::isConsumerFinal(), y ApplicationResponseBuilder/DianDocumentDataBuilder/
// InvoiceXmlTemplateRenderer del lado de la emisión DIAN).
export function isConsumerFinal(identificationNumber?: string | number | null): boolean {
    if (identificationNumber === null || identificationNumber === undefined) return false;
    return String(identificationNumber).replace(/\D+/g, "") === "222222222222";
}
