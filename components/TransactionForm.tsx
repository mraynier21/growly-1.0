import React, { useState } from "react";
import { PaymentMethod, Transaction, TransactionType } from "../types";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from "../constants";
import { X, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/Button";

interface TransactionFormProps {
  onSave: (t: Transaction) => void;
  onClose: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSave, onClose }) => {
  // State initialization
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");

  const categories = type === TransactionType.EXPENSE ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !paymentMethod) return;

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      category,
      note,
      date: new Date().toISOString(), // Automatic date
      type,
      paymentMethod: paymentMethod as PaymentMethod,
    };

    onSave(transaction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-darkSurface w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-10">
        
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-darkSurface z-10 px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Nueva Transacción</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Type Switcher */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setType(TransactionType.EXPENSE)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                type === TransactionType.EXPENSE
                  ? "bg-white dark:bg-slate-700 text-danger shadow-sm"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Gasto
            </button>
            <button
              type="button"
              onClick={() => setType(TransactionType.INCOME)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                type === TransactionType.INCOME
                  ? "bg-white dark:bg-slate-700 text-primary shadow-sm"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Ingreso
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
              Monto (S/) <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full text-3xl font-bold p-3 bg-transparent border-b-2 border-slate-200 dark:border-slate-700 focus:border-primary focus:outline-none text-slate-900 dark:text-white placeholder-slate-300"
              autoFocus
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              Categoría <span className="text-danger">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-2 text-xs rounded-lg border transition-all ${
                    category === cat
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              Método de Pago <span className="text-danger">*</span>
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.value}
                  type="button"
                  onClick={() => setPaymentMethod(pm.value)}
                  className={`flex flex-col items-center gap-1 min-w-[80px] p-3 rounded-xl border transition-all ${
                    paymentMethod === pm.value
                      ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="text-xl">{pm.icon}</span>
                  <span className="text-xs font-medium">{pm.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
              Nota (Opcional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Detalles adicionales..."
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-none text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="pt-4 pb-2">
            <Button type="submit" fullWidth variant={type === TransactionType.EXPENSE ? "danger" : "primary"}>
              <CheckCircle2 className="mr-2" size={20} />
              Guardar Transacción
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};