import { PaymentMethod } from "./types";

export const EXPENSE_CATEGORIES = [
  "Alimentos",
  "Transporte",
  "Vivienda",
  "Entretenimiento",
  "Salud",
  "Servicios",
  "Ropa",
  "Educación",
  "Otros",
];

export const INCOME_CATEGORIES = [
  "Sueldo",
  "Freelance",
  "Inversiones",
  "Regalos",
  "Ventas",
  "Otros",
];

export const PAYMENT_METHODS = [
  { value: PaymentMethod.CASH, label: "Efectivo", icon: "💵" },
  { value: PaymentMethod.YAPE, label: "Yape", icon: "🟣" },
  { value: PaymentMethod.PLIN, label: "Plin", icon: "🔵" },
  { value: PaymentMethod.TRANSFER, label: "Transferencia", icon: "🏦" },
  { value: PaymentMethod.CARD, label: "Tarjeta", icon: "💳" },
];

export const COLORS = [
  "#10b981", // Emerald
  "#3b82f6", // Blue
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#06b6d4", // Cyan
];