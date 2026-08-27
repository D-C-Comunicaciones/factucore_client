const DAY_MS = 24 * 60 * 60 * 1000;
const AVG_MONTH_DAYS = 30.4368;
const MAX_REVERSE_MONTHS = 1200; // 100 años: por encima de esto el plan no es realista

export function parseDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(`${dateStr}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function daysBetween(startDate, endDate) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (!start || !end) return 0;
  const diff = Math.round((end.getTime() - start.getTime()) / DAY_MS) + 1;
  return diff > 0 ? diff : 0;
}

export function nightsFromDays(days) {
  return days > 0 ? days - 1 : 0;
}

export function itemTotal(item, days, travelers) {
  const base = Number(item.amount) || 0;
  const mult =
    (item.perDay ? Math.max(days, 1) : 1) *
    (item.perTraveler ? Math.max(travelers, 1) : 1);
  return base * mult;
}

export function computeBreakdown(budget) {
  const days = Math.max(Number(budget.days) || 0, 0);
  const nights = Math.max(Number(budget.nights) || 0, 0);
  const travelers = Math.max(Number(budget.travelers) || 1, 1);

  const flightsTotal =
    ((Number(budget.transport.flightOut) || 0) +
      (Number(budget.transport.flightReturn) || 0)) *
    travelers;

  const otherTransportItems = budget.transport.other.map((it) => ({
    label: it.label || "Transporte",
    amount: itemTotal(it, days, travelers),
  }));
  const otherTransportTotal = otherTransportItems.reduce(
    (s, it) => s + it.amount,
    0
  );

  const stayTotal = (Number(budget.stay.costPerNight) || 0) * nights;

  const mealTotalPerPersonDay =
    (Number(budget.food.breakfast) || 0) +
    (Number(budget.food.lunch) || 0) +
    (Number(budget.food.dinner) || 0);
  const foodTotal = mealTotalPerPersonDay * days * travelers;

  const localTransportTotal =
    (Number(budget.localTransport.perDay) || 0) * days;

  const extrasItems = budget.extras.map((it) => ({
    label: it.label || "Otro gasto",
    amount: itemTotal(it, days, travelers),
  }));
  const extrasTotal = extrasItems.reduce((s, it) => s + it.amount, 0);

  const categories = [
    { key: "flights", label: "Vuelos", amount: flightsTotal },
    { key: "otherTransport", label: "Otros transportes", amount: otherTransportTotal },
    { key: "stay", label: "Estadía", amount: stayTotal },
    { key: "food", label: "Alimentación", amount: foodTotal },
    { key: "localTransport", label: "Transporte en destino", amount: localTransportTotal },
    { key: "extras", label: "Otros gastos", amount: extrasTotal },
  ];

  const total = categories.reduce((s, c) => s + c.amount, 0);

  const lineItems = [
    ...(Number(budget.transport.flightOut) > 0
      ? [{ category: "Vuelos", label: "Vuelo de ida (x" + travelers + ")", amount: (Number(budget.transport.flightOut) || 0) * travelers }]
      : []),
    ...(Number(budget.transport.flightReturn) > 0
      ? [{ category: "Vuelos", label: "Vuelo de regreso (x" + travelers + ")", amount: (Number(budget.transport.flightReturn) || 0) * travelers }]
      : []),
    ...otherTransportItems.map((it) => ({ category: "Otros transportes", label: it.label, amount: it.amount })),
    ...(stayTotal > 0
      ? [{ category: "Estadía", label: `${nights} noche(s) x ${formatMoneyPlain(budget.stay.costPerNight)}`, amount: stayTotal }]
      : []),
    ...(foodTotal > 0
      ? [{ category: "Alimentación", label: `Desayuno, almuerzo y cena x ${days} día(s) x ${travelers} persona(s)`, amount: foodTotal }]
      : []),
    ...(localTransportTotal > 0
      ? [{ category: "Transporte en destino", label: `${days} día(s) en ${budget.destination || "destino"}`, amount: localTransportTotal }]
      : []),
    ...extrasItems.filter((it) => it.amount > 0).map((it) => ({ category: "Otros gastos", label: it.label, amount: it.amount })),
  ];

  return { days, nights, travelers, categories, total, lineItems };
}

function formatMoneyPlain(v) {
  return new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(Number(v) || 0);
}

export function computeSavingsPlan(total, targetDateStr) {
  const target = parseDate(targetDateStr);
  const today = parseDate(todayISOInternal());
  let daysLeft = 1;
  if (target && today) {
    daysLeft = Math.round((target.getTime() - today.getTime()) / DAY_MS);
  }
  daysLeft = Math.max(daysLeft, 1);
  const weeksLeft = Math.max(daysLeft / 7, 1 / 7);
  const monthsLeft = Math.max(daysLeft / AVG_MONTH_DAYS, 1 / AVG_MONTH_DAYS);

  return {
    daysLeft,
    weeksLeft,
    monthsLeft,
    daily: total / daysLeft,
    weekly: total / weeksLeft,
    monthly: total / monthsLeft,
  };
}

export function addMonthsIso(dateStr, months) {
  const base = parseDate(dateStr) || new Date();
  const result = new Date(base.getTime());
  result.setMonth(result.getMonth() + months);
  const tz = result.getTimezoneOffset() * 60000;
  return new Date(result.getTime() - tz).toISOString().slice(0, 10);
}

const PERIOD_DAYS = { daily: 1, weekly: 7, monthly: AVG_MONTH_DAYS };
const MAX_REVERSE_DAYS = MAX_REVERSE_MONTHS * AVG_MONTH_DAYS;

export function reverseSavingsDate(total, capacityAmount, deadlineIso, cadence = "monthly") {
  const capacity = Number(capacityAmount) || 0;
  if (capacity <= 0 || total <= 0) return null;

  const periodDays = PERIOD_DAYS[cadence] || PERIOD_DAYS.monthly;
  const dailyRate = capacity / periodDays;
  const daysNeeded = total / dailyRate;

  if (!Number.isFinite(daysNeeded) || daysNeeded > MAX_REVERSE_DAYS) {
    return { daysNeeded, targetDate: null, tooFar: true, insufficient: false };
  }

  const today = parseDate(todayISOInternal());
  const target = new Date(today.getTime() + Math.round(daysNeeded) * DAY_MS);

  if (Number.isNaN(target.getTime())) {
    return { daysNeeded, targetDate: null, tooFar: true, insufficient: false };
  }

  const deadline = parseDate(deadlineIso);
  const insufficient = deadline ? target.getTime() > deadline.getTime() : false;

  return { daysNeeded, targetDate: target, tooFar: false, insufficient };
}

function todayISOInternal() {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}
