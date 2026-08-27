import DynamicList from "./DynamicList";

export default function TransportForm({ budget, onUpdate, currencySymbol }) {
  const transport = budget.transport;

  function updateTransport(patch) {
    onUpdate({ ...budget, transport: { ...transport, ...patch } });
  }

  return (
    <div className="card">
      <div className="section-title-row">
        <div className="section-icon">✈️</div>
        <div>
          <div className="section-title">Transporte</div>
          <div className="section-desc">Vuelos y traslados hacia el destino</div>
        </div>
      </div>

      <div className="form-grid">
        <div className="field">
          <label className="field-label">Vuelo de ida (por persona)</label>
          <div className="field-affix">
            <span className="field-affix-symbol">{currencySymbol}</span>
            <input
              className="field-input"
              type="number"
              min="0"
              placeholder="0"
              value={transport.flightOut === 0 ? "" : transport.flightOut}
              onChange={(e) => updateTransport({ flightOut: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="field">
          <label className="field-label">Vuelo de regreso (por persona)</label>
          <div className="field-affix">
            <span className="field-affix-symbol">{currencySymbol}</span>
            <input
              className="field-input"
              type="number"
              min="0"
              placeholder="0"
              value={transport.flightReturn === 0 ? "" : transport.flightReturn}
              onChange={(e) => updateTransport({ flightReturn: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 15 }}>
        <label className="field-label">Otros transportes (bus, tren, traslados)</label>
        <DynamicList
          items={transport.other}
          onChange={(other) => updateTransport({ other })}
          addLabel="Agregar transporte"
          currencySymbol={currencySymbol}
        />
      </div>
    </div>
  );
}
