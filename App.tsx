import React, { useState, useEffect } from "react";
import { AppData, Goal, Transaction } from "./types";
import { getStoredData, saveStoredData, exportData, validateImportData } from "./services/storageService";
import { Dashboard } from "./components/Dashboard";
import { GoalList } from "./components/GoalList";
import { TransactionForm } from "./components/TransactionForm";
import { LayoutDashboard, Target, Settings, Plus, Download, Upload, RefreshCw } from "lucide-react";
import { Button } from "./components/ui/Button";

type View = "dashboard" | "goals" | "settings";

const App: React.FC = () => {
  const [view, setView] = useState<View>("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [data, setData] = useState<AppData>({ transactions: [], goals: [] });
  const [isLoaded, setIsLoaded] = useState(false);

  // Initial Load
  useEffect(() => {
    const stored = getStoredData();
    setData(stored);
    setIsLoaded(true);
  }, []);

  // Persistence on change
  useEffect(() => {
    if (isLoaded) {
      saveStoredData(data);
    }
  }, [data, isLoaded]);

  // Actions
  const addTransaction = (t: Transaction) => {
    const updatedTransactions = [t, ...data.transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Check if transaction affects a goal (optional logic logic extension could go here)
    
    setData(prev => ({ ...prev, transactions: updatedTransactions }));
  };

  const addGoal = (g: Goal) => {
    setData(prev => ({ ...prev, goals: [...prev.goals, g] }));
  };

  const updateGoal = (updatedGoal: Goal) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === updatedGoal.id ? updatedGoal : g)
    }));
  };

  const deleteGoal = (id: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id)
    }));
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (validateImportData(json)) {
          if(confirm("¿Estás seguro de que deseas restaurar esta copia? Tus datos actuales serán reemplazados.")) {
            setData(json);
            alert("Datos restaurados con éxito.");
          }
        } else {
          alert("El archivo no tiene el formato válido de Growly.");
        }
      } catch (error) {
        alert("Error al leer el archivo.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-darkBackground text-slate-900 dark:text-slate-100 font-sans selection:bg-primary/30">
      
      {/* Main Content Area */}
      <main className="max-w-lg mx-auto min-h-screen relative pb-20 shadow-2xl dark:shadow-none dark:border-x dark:border-slate-800 bg-slate-50 dark:bg-darkBackground">
        
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-darkSurface/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 text-white font-bold text-xl tracking-tighter leading-none select-none">
                GR
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">Growly</h1>
           </div>
           <div className="text-xs text-slate-500 font-medium px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              Perú (S/)
           </div>
        </header>

        <div className="p-4 sm:p-6">
          {view === "dashboard" && (
            <div className="animate-in fade-in">
              <Dashboard transactions={data.transactions} />
            </div>
          )}

          {view === "goals" && (
             <div className="animate-in fade-in">
              <GoalList 
                goals={data.goals} 
                onAddGoal={addGoal} 
                onDeleteGoal={deleteGoal} 
                onUpdateGoal={updateGoal}
              />
            </div>
          )}

          {view === "settings" && (
            <div className="space-y-6 animate-in fade-in pb-24">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Configuración</h2>
              
              {/* Data Management Card */}
              <div className="bg-white dark:bg-darkSurface rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <RefreshCw size={20} className="text-primary" />
                  Copia de Seguridad
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Tus datos se guardan localmente en este dispositivo. Exporta regularmente para no perder tu información.
                </p>
                
                <div className="space-y-3">
                  <Button variant="secondary" fullWidth onClick={() => exportData(data)}>
                    <Download size={18} />
                    Exportar Datos (Backup)
                  </Button>
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="ghost" fullWidth className="border border-dashed border-slate-300 dark:border-slate-600">
                      <Upload size={18} />
                      Restaurar Datos
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl">
                 <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                   Growly v1.0.0 <br/> Hecho con ❤️ para Perú
                 </p>
              </div>
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-24 right-4 sm:right-[calc(50%-240px+1rem)] z-40">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-emerald-600 text-white p-4 rounded-full shadow-xl shadow-primary/40 transition-transform hover:scale-105 active:scale-95"
          >
            <Plus size={28} />
          </button>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-lg bg-white dark:bg-darkSurface border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-30 pb-safe">
          <button
            onClick={() => setView("dashboard")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              view === "dashboard" ? "text-primary" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <LayoutDashboard size={24} strokeWidth={view === "dashboard" ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Inicio</span>
          </button>

          <button
            onClick={() => setView("goals")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              view === "goals" ? "text-primary" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <Target size={24} strokeWidth={view === "goals" ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Metas</span>
          </button>

          <button
            onClick={() => setView("settings")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              view === "settings" ? "text-primary" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <Settings size={24} strokeWidth={view === "settings" ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Ajustes</span>
          </button>
        </nav>

        {/* Modals */}
        {showAddModal && (
          <TransactionForm
            onSave={addTransaction}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </main>
    </div>
  );
};

export default App;