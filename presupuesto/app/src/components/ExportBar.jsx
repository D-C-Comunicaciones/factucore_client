export default function ExportBar({ onExportPdf, onExportExcel }) {
  return (
    <div className="card card-solid">
      <div className="section-title-row">
        <div className="section-icon">📄</div>
        <div>
          <div className="section-title">Exportar reporte</div>
          <div className="section-desc">Descarga tu presupuesto y plan de ahorro</div>
        </div>
      </div>
      <div className="export-bar">
        <button type="button" className="btn-primary btn-block" onClick={onExportPdf}>
          Exportar PDF
        </button>
        <button type="button" className="btn-ghost btn-block" onClick={onExportExcel}>
          Exportar Excel
        </button>
      </div>
    </div>
  );
}
