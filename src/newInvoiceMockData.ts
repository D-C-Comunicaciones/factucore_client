export const newInvoiceMockData = {
    documentTypes: [
        { value: "CC", label: "Cédula" },
        { value: "NIT", label: "NIT" },
        { value: "CE", label: "Cédula de extranjería" },
    ],
    warehouseOptions: [
        { value: "principal", label: "Principal" },
        { value: "secundaria", label: "Secundaria" },
    ],
    priceListOptions: [
        { value: "general", label: "General" },
        { value: "mayorista", label: "Mayorista" },
    ],
    sellerOptions: [
        { value: "andres", label: "Andrés Leones" },
        { value: "maria", label: "María Gómez" },
    ],
    paymentMethods: [
        { value: "efectivo", label: "Efectivo" },
        { value: "transferencia", label: "Transferencia" },
        { value: "tarjeta", label: "Tarjeta" },
    ],
    paymentForms: [
        { value: "contado", label: "Contado" },
        { value: "credito", label: "Crédito" },
    ],
    invoiceItems: [
        { id: 1, item: "", referencia: "", precio: "", descuento: "", impuesto: "", descripcion: "", cantidad: 0, total: 0 },
        { id: 2, item: "", referencia: "", precio: "", descuento: "", impuesto: "", descripcion: "", cantidad: 0, total: 0 },
        { id: 3, item: "", referencia: "", precio: "", descuento: "", impuesto: "", descripcion: "", cantidad: 0, total: 0 },
    ],
    logo: "/img/logo.png",
    company: {
        name: "LEONES PALACIO ANDRES FELIPE",
        nit: "1143263398",
        email: "leones1997@live.com",
    },
    invoiceType: "Factura electrónica",
    invoiceNumber: "LTCH-2",
};
