import { makeId } from "./id";
import { addMonthsIso } from "./calculations";

export function createInitialBudget() {
  return {
    tripName: "",
    origin: "",
    destination: "",
    startDate: "",
    endDate: "",
    days: 5,
    nights: 4,
    travelers: 1,
    currency: "COP",
    targetSaveDate: addMonthsIso(null, 3),
    transport: {
      flightOut: 0,
      flightReturn: 0,
      other: [{ id: makeId(), label: "Traslado aeropuerto ⇄ hotel", amount: 0, perDay: false, perTraveler: true }],
    },
    stay: {
      costPerNight: 0,
    },
    food: {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
    },
    localTransport: {
      perDay: 0,
    },
    extras: [
      { id: makeId(), label: "Mecatos y snacks", amount: 0, perDay: true, perTraveler: true },
      { id: makeId(), label: "Agua", amount: 0, perDay: true, perTraveler: true },
      { id: makeId(), label: "Helados y antojos", amount: 0, perDay: true, perTraveler: true },
      { id: makeId(), label: "Salidas a comer / bares", amount: 0, perDay: false, perTraveler: true },
      { id: makeId(), label: "Entradas y turismo", amount: 0, perDay: false, perTraveler: true },
      { id: makeId(), label: "Souvenirs y regalos", amount: 0, perDay: false, perTraveler: false },
      { id: makeId(), label: "Seguro de viaje", amount: 0, perDay: false, perTraveler: true },
      { id: makeId(), label: "Imprevistos", amount: 0, perDay: false, perTraveler: false },
    ],
  };
}
