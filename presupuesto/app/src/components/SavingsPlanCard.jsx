import { useState, useMemo } from "react";
import { formatCurrency, formatDate } from "../lib/format";
import { reverseSavingsDate, computeSavingsPlan } from "../lib/calculations";

const CADENCES = [
  { key: "daily", label: "Diario", per: "al día", placeholder: "Ej. 20000" },
  { key: "weekly", label: "Semanal", per: "a la semana", placeholder: "Ej. 100000" },
  { key: "monthly", label: "Mensual", per: "al mes", placeholder: "Ej. 400000" },
];

export default function SavingsPlanCard({ budget, savings }) {
  const [selected, setSelected] = useState("monthly");
  const [capacity, setCapacity] = useState("");

  const cadenceMeta = CADENCES.find((c) => c.key === selected);
  const deadlineIso = budget.startDate || budget.targetSaveDate;

  function selectCadence(key) {
    setSelected(key);
    setCapacity("");
  }

  const reverse = useMemo(
    () => reverseSavingsDate(savings.total, capacity, deadlineIso, selected),
    [savings.total, capacity, deadlineIso, selected]
  );

  const minAmount = useMemo(
    () => (reverse && reverse.insufficient ? computeSavingsPlan(savings.total, deadlineIso)[selected] : null),
    [reverse, savings.total, deadlineIso, selected]
  );

  function formatDuration(daysNeeded) {
    if (selected === "daily") return `${Math.round(daysNeeded)} día(s)`;
    if (selected === "weekly") return `${(daysNeeded / 7).toFixed(1)} semana(s)`;
    return `${(daysNeeded / 30.4368).toFixed(1)} mes(es)`;
  }

  return (
    <div className="card card-solid">
      <div className="section-title-row">
        <div className="section-icon">💰</div>
        <div>
          <div className="section-title">Plan de ahorro</div>
          <div className="section-desc">Para tener listo el presupuesto antes de {formatDate(budget.targetSaveDate)}</div>
        </div>
      </div>

      <div className="savings-grid">
        {CADENCES.map((c) => (
          <button
            key={c.key}
            type="button"
            className={`savings-card${selected === c.key ? " active" : ""}`}
            onClick={() => selectCadence(c.key)}
          >
            <div className="savings-period">{c.label}</div>
            <div className="savings-amount">{formatCurrency(savings[c.key], budget.currency)}</div>
            <div className="savings-note">
              {c.key === "daily" && `${Math.round(savings.daysLeft)} días restantes`}
              {c.key === "weekly" && `${savings.weeksLeft.toFixed(1)} semanas restantes`}
              {c.key === "monthly" && `${savings.monthsLeft.toFixed(1)} meses restantes`}
            </div>
          </button>
        ))}
      </div>

      <div className="reverse-box">
        <div className="field-label" style={{ marginBottom: 10 }}>
          ¿Cuánto puedes ahorrar {cadenceMeta.per}?
        </div>
        <div className="reverse-row">
          <div className="field">
            <div className="field-affix">
              <span className="field-affix-symbol">$</span>
              <input
                className="field-input"
                type="number"
                min="0"
                placeholder={cadenceMeta.placeholder}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
          </div>
        </div>
        {reverse && reverse.tooFar && (
          <div className="reverse-result reverse-result--warning">
            Con {formatCurrency(Number(capacity), budget.currency)} {cadenceMeta.per} tardarías más de 100 años en
            completar el presupuesto. Ingresa un monto más alto.
          </div>
        )}

        {reverse && !reverse.tooFar && reverse.insufficient && (
          <div className="reverse-result reverse-result--warning">
            Con {formatCurrency(Number(capacity), budget.currency)} {cadenceMeta.per} no alcanzas a completar el
            presupuesto antes del <strong>{formatDate(deadlineIso)}</strong> (terminarías el{" "}
            {formatDate(reverse.targetDate.toISOString().slice(0, 10))}). Necesitas ahorrar al menos{" "}
            <strong>{formatCurrency(minAmount, budget.currency)}</strong> {cadenceMeta.per}.
          </div>
        )}

        {reverse && !reverse.tooFar && !reverse.insufficient && (
          <div className="reverse-result">
            Ahorrando {formatCurrency(Number(capacity), budget.currency)} {cadenceMeta.per}, tendrás el presupuesto
            completo en <strong>{formatDuration(reverse.daysNeeded)}</strong> — alrededor del{" "}
            <strong>{formatDate(reverse.targetDate.toISOString().slice(0, 10))}</strong>.
          </div>
        )}
      </div>
    </div>
  );
}
