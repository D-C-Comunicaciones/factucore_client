import { daysBetween, nightsFromDays } from "../lib/calculations";

export default function TripForm({ budget, onUpdate }) {
  function handleDateChange(field, value) {
    const next = { ...budget, [field]: value };
    const days = daysBetween(next.startDate, next.endDate);
    if (days > 0) {
      next.days = days;
      next.nights = nightsFromDays(days);
    }
    if (field === "startDate" && (!budget.targetSaveDate || budget.targetSaveDate === budget.startDate)) {
      next.targetSaveDate = value;
    }
    onUpdate(next);
  }

  return (
    <div className="card">
      <div className="section-title-row">
        <div className="section-icon">🧭</div>
        <div>
          <div className="section-title">Datos del viaje</div>
          <div className="section-desc">Origen, destino y duración</div>
        </div>
      </div>

      <div className="form-grid">
        <div className="field">
          <label className="field-label">Origen</label>
          <input
            className="field-input"
            type="text"
            placeholder="Ej. Bogotá"
            value={budget.origin}
            onChange={(e) => onUpdate({ ...budget, origin: e.target.value })}
          />
        </div>
        <div className="field">
          <label className="field-label">Destino</label>
          <input
            className="field-input"
            type="text"
            placeholder="Ej. Cartagena"
            value={budget.destination}
            onChange={(e) => onUpdate({ ...budget, destination: e.target.value })}
          />
        </div>

        <div className="field">
          <label className="field-label">Fecha de salida</label>
          <input
            className="field-input"
            type="date"
            value={budget.startDate}
            onChange={(e) => handleDateChange("startDate", e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label">Fecha de regreso</label>
          <input
            className="field-input"
            type="date"
            value={budget.endDate}
            onChange={(e) => handleDateChange("endDate", e.target.value)}
          />
        </div>

        <div className="field">
          <label className="field-label">Días de viaje</label>
          <input
            className="field-input"
            type="number"
            min="1"
            value={budget.days}
            onChange={(e) => onUpdate({ ...budget, days: Number(e.target.value) })}
          />
          <span className="field-hint">Se calcula solo si pones ambas fechas</span>
        </div>
        <div className="field">
          <label className="field-label">Viajeros</label>
          <input
            className="field-input"
            type="number"
            min="1"
            value={budget.travelers}
            onChange={(e) => onUpdate({ ...budget, travelers: Number(e.target.value) })}
          />
        </div>

        <div className="field">
          <label className="field-label">Moneda</label>
          <select
            className="field-select"
            value={budget.currency}
            onChange={(e) => onUpdate({ ...budget, currency: e.target.value })}
          >
            <option value="COP">COP — Peso colombiano</option>
            <option value="USD">USD — Dólar</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label">Meta de ahorro (fecha)</label>
          <input
            className="field-input"
            type="date"
            value={budget.targetSaveDate}
            onChange={(e) => onUpdate({ ...budget, targetSaveDate: e.target.value })}
          />
          <span className="field-hint">Fecha límite para tener todo ahorrado</span>
        </div>
      </div>
    </div>
  );
}
