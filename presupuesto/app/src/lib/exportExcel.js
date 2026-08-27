import * as XLSX from "xlsx";
import { formatDate } from "./format";

const MONEY_FMT = '"$"#,##0';

export function exportBudgetExcel(budget, breakdown, savings) {
  const wb = XLSX.utils.book_new();

  const resumenRows = [
    ["Presupuesto de viaje"],
    [],
    ["Origen", budget.origin || "—"],
    ["Destino", budget.destination || "—"],
    ["Fecha de salida", formatDate(budget.startDate)],
    ["Fecha de regreso", formatDate(budget.endDate)],
    ["Días de viaje", breakdown.days],
    ["Viajeros", breakdown.travelers],
    ["Moneda", budget.currency],
    [],
    ["Categoría", "Monto"],
    ...breakdown.categories.map((c) => [c.label, c.amount]),
    ["Total presupuesto", breakdown.total],
  ];
  const wsResumen = XLSX.utils.aoa_to_sheet(resumenRows);
  wsResumen["!cols"] = [{ wch: 26 }, { wch: 22 }];
  const catStartRow = 12;
  for (let i = 0; i < breakdown.categories.length + 1; i++) {
    const rowIndex = catStartRow + i;
    const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: 1 });
    if (wsResumen[cellRef] && typeof wsResumen[cellRef].v === "number") {
      wsResumen[cellRef].z = MONEY_FMT;
    }
  }
  XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen");

  const detalleHeader = ["Categoría", "Detalle", "Monto"];
  const detalleRows = breakdown.lineItems.length
    ? breakdown.lineItems.map((it) => [it.category, it.label, it.amount])
    : [["—", "Sin gastos registrados", 0]];
  const wsDetalle = XLSX.utils.aoa_to_sheet([detalleHeader, ...detalleRows, ["", "Total", breakdown.total]]);
  wsDetalle["!cols"] = [{ wch: 22 }, { wch: 40 }, { wch: 16 }];
  for (let r = 1; r <= detalleRows.length + 1; r++) {
    const cellRef = XLSX.utils.encode_cell({ r, c: 2 });
    if (wsDetalle[cellRef] && typeof wsDetalle[cellRef].v === "number") {
      wsDetalle[cellRef].z = MONEY_FMT;
    }
  }
  XLSX.utils.book_append_sheet(wb, wsDetalle, "Detalle de gastos");

  const ahorroRows = [
    ["Frecuencia", "Monto a ahorrar", "Referencia"],
    ["Diario", savings.daily, `${Math.round(savings.daysLeft)} días restantes`],
    ["Semanal", savings.weekly, `${savings.weeksLeft.toFixed(1)} semanas restantes`],
    ["Mensual", savings.monthly, `${savings.monthsLeft.toFixed(1)} meses restantes`],
    [],
    ["Meta de ahorro", formatDate(budget.targetSaveDate)],
  ];
  const wsAhorro = XLSX.utils.aoa_to_sheet(ahorroRows);
  wsAhorro["!cols"] = [{ wch: 20 }, { wch: 20 }, { wch: 26 }];
  [1, 2, 3].forEach((r) => {
    const cellRef = XLSX.utils.encode_cell({ r, c: 1 });
    if (wsAhorro[cellRef] && typeof wsAhorro[cellRef].v === "number") {
      wsAhorro[cellRef].z = MONEY_FMT;
    }
  });
  XLSX.utils.book_append_sheet(wb, wsAhorro, "Plan de ahorro");

  const fileName = `presupuesto-viaje-${(budget.destination || "viaje").toLowerCase().replace(/\s+/g, "-")}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
