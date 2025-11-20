export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum PaymentMethod {
  CASH = 'Efectivo',
  YAPE = 'Yape',
  PLIN = 'Plin',
  TRANSFER = 'Transferencia',
  CARD = 'Tarjeta',
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string; // ISO String
  type: TransactionType;
  paymentMethod: PaymentMethod;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  color: string;
}

export type TimeFilter = 'Diario' | 'Semanal' | 'Mensual';

export interface AppData {
  transactions: Transaction[];
  goals: Goal[];
}