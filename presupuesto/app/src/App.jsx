import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import TripForm from "./components/TripForm";
import TransportForm from "./components/TransportForm";
import { StayForm, FoodForm } from "./components/StayFoodForm";
import { LocalTransportForm, ExtrasForm } from "./components/LocalExtrasForm";
import SummaryPanel from "./components/SummaryPanel";
import SavingsPlanCard from "./components/SavingsPlanCard";
import ExportBar from "./components/ExportBar";
import { createInitialBudget } from "./lib/initialBudget";
import { computeBreakdown, computeSavingsPlan } from "./lib/calculations";
import { exportBudgetPdf } from "./lib/exportPdf";
import { exportBudgetExcel } from "./lib/exportExcel";

const STORAGE_KEY = "presupuesto-viaje";

function loadBudget() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialBudget();
    const parsed = JSON.parse(raw);
    return { ...createInitialBudget(), ...parsed };
  } catch {
    return createInitialBudget();
  }
}

export default function App() {
  const [budget, setBudget] = useState(loadBudget);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(budget));
    } catch {
      // almacenamiento no disponible, se ignora
    }
  }, [budget]);

  const breakdown = useMemo(() => computeBreakdown(budget), [budget]);
  const savings = useMemo(
    () => ({ ...computeSavingsPlan(breakdown.total, budget.targetSaveDate), total: breakdown.total }),
    [breakdown.total, budget.targetSaveDate]
  );

  const currencySymbol = budget.currency === "USD" ? "US$" : "$";

  return (
    <div className="app-shell">
      <Header />
      <main className="container">
        <div className="layout-grid">
          <div className="forms-col">
            <TripForm budget={budget} onUpdate={setBudget} />
            <TransportForm budget={budget} onUpdate={setBudget} currencySymbol={currencySymbol} />
            <StayForm budget={budget} onUpdate={setBudget} currencySymbol={currencySymbol} />
            <FoodForm budget={budget} onUpdate={setBudget} currencySymbol={currencySymbol} />
            <LocalTransportForm budget={budget} onUpdate={setBudget} currencySymbol={currencySymbol} />
            <ExtrasForm budget={budget} onUpdate={setBudget} currencySymbol={currencySymbol} />
          </div>

          <div className="summary-col">
            <SummaryPanel budget={budget} breakdown={breakdown} />
            <SavingsPlanCard budget={budget} savings={savings} />
            <ExportBar
              onExportPdf={() => exportBudgetPdf(budget, breakdown, savings)}
              onExportExcel={() => exportBudgetExcel(budget, breakdown, savings)}
            />
          </div>
        </div>
      </main>
      <footer className="footer">
        Tus datos se guardan solo en este navegador. Hecho con alegra design system.
      </footer>
    </div>
  );
}
