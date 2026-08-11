import { ConfigCard } from './ConfigCard';
import { CompanySummaryCard } from './CompanySummaryCard';

export function ConfigurationGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ConfigCard
        title="Empresa"
        description="Configura la información de tu empresa y adapta la plataforma a tu negocio."
        links={[
          { label: 'Empresa', href: '/configuration/company' },
          { label: 'Usuarios', href: '/configuration/users' },
          { label: 'Mi perfil', href: '/configuration/profile' },
          { label: 'Centros de costos', href: '/cost-centers' },
          { label: 'Monedas', href: '/configuration/currencies' },
        ]}
      />
      <ConfigCard
        title="Facturación"
        description="Configura la información que se mostrará en tus facturas."
        links={[
          { label: 'Certificado Digital', href: '/certificates' },
          { label: 'Software', href: '/software' },
          { label: 'Términos de pago', href: '/configuration/payment-terms' },
          { label: 'Numeraciones', href: '/resolutions' },
          { label: 'Configuración de documentos', href: '/configuration/configuracion-documentos' },
          { label: 'Vendedores', href: '/configuration/sellers' },
          { label: 'Propinas', href: '/configuration/propinas' },
        ]}
      />
      <ConfigCard
        title="Plantillas de impresión"
        description="Administra las plantillas de impresión de tus documentos."
        links={[{ label: 'Plantillas', href: '/configuration/templates' }]}
      />
      <ConfigCard
        title="Impuestos"
        description="Define aquí los tipos de impuestos y retenciones que aplicas a tus facturas."
        links={[
          { label: 'Impuestos', href: '/configuration/impuestos' },
          { label: 'Retenciones', href: '/configuration/retenciones' },
          { label: 'Configuración avanzada', href: '/configuration/impuestos/avanzada' },
        ]}
      />
      <ConfigCard
        title="Contabilidad"
        description="Define opciones avanzadas para el manejo de tu contabilidad."
        links={[
          { label: 'Actualizar registros contables', href: '/configuration/contabilidad/actualizar' },
          { label: 'Parametrización contable', href: '/configuration/contabilidad/parametrizacion', showHelpIcon: true },
          { label: 'Cierre contable de resultados', href: '/configuration/contabilidad/cierre' },
          { label: 'Configurar información exógena', href: '/configuration/contabilidad/exogena' },
          { label: 'Tipos de Comprobantes Contables', href: '/configuration/contabilidad/comprobantes' },
          { label: 'Numeraciones contables', href: '/configuration/contabilidad/numeraciones' },
        ]}
      />
      <ConfigCard
        title="Notificaciones y correos"
        description="Configura las plantillas, las notificaciones del sistema y las notificaciones de facturas."
        links={[
          { label: 'Notificaciones de cobro', href: '/configuration/notificaciones/cobro' },
          { label: 'Plantillas de correos y WhatsApp', href: '/configuration/notificaciones/plantillas' },
          { label: 'Preferencias de correo', href: '/configuration/notificaciones/preferencias' },
        ]}
      />
      <ConfigCard
        title="Inventario"
        description="Define opciones avanzadas para la creación, venta y gestión de tus productos."
        links={[
          { label: 'Campos adicionales', href: '/configuration/inventario/campos-adicionales', showHelpIcon: true },
          { label: 'Variantes', href: '/configuration/inventario/variantes', showHelpIcon: true },
        ]}
      />
      <ConfigCard
        title="Integraciones"
        description="Encuentra toda la información para que puedas integrar otros sistemas con la plataforma."
        links={[{ label: 'Integraciones', href: '/integrations' }]}
      />
      <ConfigCard
        title="Historial"
        description="Consulta el historial de correos de facturas enviadas a clientes y operaciones realizadas en la cuenta."
        links={[
          { label: 'Historial de correos', href: '/configuration/historial/correos' },
          { label: 'Historial de operaciones', href: '/configuration/historial/operaciones' },
        ]}
      />
      <ConfigCard
        title="Suscripción - Planes"
        customContent={
          <div className="bg-primary text-primary-foreground p-4 rounded-md">
            <p className="text-sm font-medium leading-relaxed">
              Elige el plan que quieres tener en la plataforma y configura cómo quieres pagarlo.
            </p>
          </div>
        }
        links={[
          { label: 'Suscripción', href: '/configuration/suscripcion' },
          { label: 'Métodos de pago', href: '/configuration/metodos-pago' },
        ]}
      />
    </div>
  );
}

export { CompanySummaryCard };
