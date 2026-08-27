import DonutChart, { CATEGORY_COLORS } from "./DonutChart";
import { formatCurrency } from "../lib/format";

export default function SummaryPanel({ budget, breakdown }) {
  const segments = breakdown.categories.map((c) => ({
    key: c.key,
    label: c.label,
    value: c.amount,
    color: CATEGORY_COLORS[c.key],
  }));

  return (
    <>
      <div className="total-card">
        <div className="total-label">Presupuesto total necesario</div>
        <div className="total-value">{formatCurrency(breakdown.total, budget.currency)}</div>
        <div className="total-meta">
          <span>{breakdown.days} día(s)</span>
          <span>{breakdown.nights} noche(s)</span>
          <span>{breakdown.travelers} viajero(s)</span>
        </div>
      </div>

      <div className="card card-solid chart-card">
        <div className="section-title-row" style={{ alignSelf: "flex-start", marginBottom: 0 }}>
          <div className="section-icon">📊</div>
          <div>
            <div className="section-title">Desglose del gasto</div>
            <div className="section-desc">Por categoría</div>
          </div>
        </div>

        <DonutChart segments={segments} total={breakdown.total} />

        <div className="legend">
          {segments.map((s) => (
            <div className="legend-item" key={s.key}>
              <span className="legend-key">
                <span className="legend-dot" style={{ background: s.color }} />
                {s.label}
              </span>
              <span className="legend-value">{formatCurrency(s.value, budget.currency)}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
