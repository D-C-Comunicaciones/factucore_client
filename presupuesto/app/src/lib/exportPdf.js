import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency, formatDate } from "./format";

const INK = [15, 23, 42];
const MUTED = [100, 116, 139];
const ACCENT = [0, 214, 188];
const BORDER = [225, 229, 235];
const SURFACE = [241, 245, 249];

export function exportBudgetPdf(budget, breakdown, savings) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;

  doc.setFillColor(...INK);
  doc.rect(0, 0, pageWidth, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Presupuesto de viaje", margin, 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const route = `${budget.origin || "Origen"} → ${budget.destination || "Destino"}`;
  doc.text(route, margin, 60);
  doc.setTextColor(...ACCENT);
  doc.setFontSize(10);
  const dateRange = `${formatDate(budget.startDate)} — ${formatDate(budget.endDate)}  ·  ${breakdown.days} día(s)  ·  ${breakdown.travelers} viajero(s)`;
  doc.text(dateRange, margin, 76);

  let y = 120;
  doc.setTextColor(...MUTED);
  doc.setFontSize(10);
  doc.text("PRESUPUESTO TOTAL NECESARIO", margin, y);
  y += 26;
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text(formatCurrency(breakdown.total, budget.currency), margin, y);
  doc.setFont("helvetica", "normal");

  y += 30;
  doc.setDrawColor(...BORDER);
  doc.line(margin, y, pageWidth - margin, y);

  autoTable(doc, {
    startY: y + 20,
    head: [["Categoría", "Detalle", "Monto"]],
    body: breakdown.lineItems.length
      ? breakdown.lineItems.map((it) => [it.category, it.label, formatCurrency(it.amount, budget.currency)])
      : [["—", "Sin gastos registrados", formatCurrency(0, budget.currency)]],
    foot: [["", "Total", formatCurrency(breakdown.total, budget.currency)]],
    theme: "plain",
    margin: { left: margin, right: margin },
    styles: {
      font: "helvetica",
      fontSize: 9,
      textColor: INK,
      lineColor: BORDER,
      lineWidth: 0.75,
      cellPadding: 8,
    },
    headStyles: {
      fillColor: ACCENT,
      textColor: INK,
      fontStyle: "bold",
      lineWidth: 0,
    },
    footStyles: {
      fillColor: SURFACE,
      textColor: INK,
      fontStyle: "bold",
      lineWidth: { top: 0.75 },
    },
    columnStyles: {
      2: { halign: "right" },
    },
  });

  let cursorY = doc.lastAutoTable.finalY + 30;
  if (cursorY > 680) {
    doc.addPage();
    cursorY = 60;
  }

  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Plan de ahorro", margin, cursorY);
  cursorY += 8;

  autoTable(doc, {
    startY: cursorY + 12,
    head: [["Frecuencia", "Monto a ahorrar", "Referencia"]],
    body: [
      ["Diario", formatCurrency(savings.daily, budget.currency), `${Math.round(savings.daysLeft)} días restantes`],
      ["Semanal", formatCurrency(savings.weekly, budget.currency), `${savings.weeksLeft.toFixed(1)} semanas restantes`],
      ["Mensual", formatCurrency(savings.monthly, budget.currency), `${savings.monthsLeft.toFixed(1)} meses restantes`],
    ],
    theme: "plain",
    margin: { left: margin, right: margin },
    styles: {
      font: "helvetica",
      fontSize: 9,
      textColor: INK,
      lineColor: BORDER,
      lineWidth: 0.75,
      cellPadding: 8,
    },
    headStyles: {
      fillColor: SURFACE,
      textColor: INK,
      fontStyle: "bold",
      lineWidth: 0,
    },
    columnStyles: {
      1: { halign: "right" },
    },
  });

  const finalY = doc.lastAutoTable.finalY + 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    `Generado el ${formatDate(new Date().toISOString().slice(0, 10))} · Meta de ahorro: ${formatDate(budget.targetSaveDate)}`,
    margin,
    finalY
  );

  const fileName = `presupuesto-viaje-${(budget.destination || "viaje").toLowerCase().replace(/\s+/g, "-")}.pdf`;
  doc.save(fileName);
}
