import React, { useMemo, useState } from "react";
import { Transaction, TransactionType, TimeFilter } from "../types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { COLORS } from "../constants";
import { ArrowDownRight, ArrowUpRight, Calendar, Wallet, Receipt } from "lucide-react";

interface DashboardProps {
  transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const [filter, setFilter] = useState<TimeFilter>("Mensual");

  // Filtering logic
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      if (filter === "Diario") {
        return tDate.getDate() === now.getDate() && 
               tDate.getMonth() === now.getMonth() && 
               tDate.getFullYear() === now.getFullYear();
      }
      if (filter === "Semanal") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return tDate >= oneWeekAgo;
      }
      if (filter === "Mensual") {
        return tDate.getMonth() === now.getMonth() && 
               tDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [transactions, filter]);

  // Calculations
  const totalIncome = filteredTransactions
    .filter((t) => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Chart Data
  const chartData = useMemo(() => {
    const expenses = filteredTransactions.filter(
      (t) => t.type === TransactionType.EXPENSE
    );
    const categoryMap: Record<string, number> = {};
    expenses.forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });
    return Object.keys(categoryMap).map((key) => ({
      name: key,
      value: categoryMap[key],
    }));
  }, [filteredTransactions]);

  return (
    <div className="space-y-6 pb-24">
      {/* Filter Tabs */}
      <div className="bg-white dark:bg-darkSurface p-1 rounded-xl shadow-sm flex">
        {(["Diario", "Semanal", "Mensual"] as TimeFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? "bg-slate-900 dark:bg-primary text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-darkSurface dark:to-slate-950 rounded-2xl p-6 text-white shadow-lg">
        <p className="text-slate-400 text-sm font-medium mb-1">Balance Total</p>
        <h2 className="text-4xl font-bold mb-6">S/ {balance.toFixed(2)}</h2>
        <div className="flex gap-4">
          <div className="flex-1 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <div className="p-1 bg-emerald-400/20 rounded-full">
                <ArrowUpRight size={14} />
              </div>
              <span className="text-xs font-bold">Ingresos</span>
            </div>
            <p className="text-lg font-semibold">S/ {totalIncome.toFixed(2)}</p>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-red-400 mb-1">
              <div className="p-1 bg-red-400/20 rounded-full">
                <ArrowDownRight size={14} />
              </div>
              <span className="text-xs font-bold">Gastos</span>
            </div>
            <p className="text-lg font-semibold">S/ {totalExpense.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      {chartData.length > 0 ? (
        <div className="bg-white dark:bg-darkSurface p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Gastos por Categoría</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `S/ ${value.toFixed(2)}`}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {chartData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-slate-600 dark:text-slate-300 truncate">{entry.name}</span>
                <span className="font-semibold ml-auto dark:text-white">S/ {entry.value.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-darkSurface p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center">
          <div className="inline-flex p-3 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
             <Wallet className="text-slate-400" size={24} />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">No hay gastos registrados en este periodo.</p>
        </div>
      )}

      {/* Recent List */}
      <div>
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 px-1">Movimientos Recientes</h3>
        <div className="space-y-3">
          {filteredTransactions.slice(0, 5).map((t) => (
            <div key={t.id} className="bg-white dark:bg-darkSurface p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${t.type === TransactionType.INCOME ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {t.type === TransactionType.INCOME ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white text-sm">{t.category}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{new Date(t.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{t.paymentMethod}</span>
                  </div>
                </div>
              </div>
              <span className={`font-bold ${t.type === TransactionType.INCOME ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                {t.type === TransactionType.INCOME ? '+' : '-'} S/ {t.amount.toFixed(2)}
              </span>
            </div>
          ))}
          {filteredTransactions.length === 0 && (
             <div className="text-center py-6 text-slate-400 text-sm">
                Sin movimientos recientes
             </div>
          )}
        </div>
      </div>
    </div>
  );
};