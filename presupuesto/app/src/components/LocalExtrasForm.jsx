import DynamicList from "./DynamicList";

export function LocalTransportForm({ budget, onUpdate, currencySymbol }) {
  return (
    <div className="card">
      <div className="section-title-row">
        <div className="section-icon">🚕</div>
        <div>
          <div className="section-title">Transporte en destino</div>
          <div className="section-desc">Taxis, metro o buses dentro de {budget.destination || "la ciudad destino"}</div>
        </div>
      </div>

      <div className="form-grid">
        <div className="field">
          <label className="field-label">Costo por día (total del grupo)</label>
          <div className="field-affix">
            <span className="field-affix-symbol">{currencySymbol}</span>
            <input
              className="field-input"
              type="number"
              min="0"
              placeholder="0"
              value={budget.localTransport.perDay === 0 ? "" : budget.localTransport.perDay}
              onChange={(e) =>
                onUpdate({ ...budget, localTransport: { ...budget.localTransport, perDay: Number(e.target.value) } })
              }
            />
          </div>
          <span className="field-hint">× {budget.days} día(s) de viaje</span>
        </div>
      </div>
    </div>
  );
}

export function ExtrasForm({ budget, onUpdate, currencySymbol }) {
  return (
    <div className="card">
      <div className="section-title-row">
        <div className="section-icon">🎒</div>
        <div>
          <div className="section-title">Otros gastos</div>
          <div className="section-desc">Mecatos, agua, helados, salidas, imprevistos y más</div>
        </div>
      </div>

      <DynamicList
        items={budget.extras}
        onChange={(extras) => onUpdate({ ...budget, extras })}
        addLabel="Agregar gasto"
        currencySymbol={currencySymbol}
      />
    </div>
  );
}
