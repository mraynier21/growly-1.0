import React, { useState } from "react";
import { Goal } from "../types";
import { COLORS } from "../constants";
import { Plus, Target, Trash2, Edit2, Trophy } from "lucide-react";
import { Button } from "./ui/Button";

interface GoalListProps {
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
  onUpdateGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
}

export const GoalList: React.FC<GoalListProps> = ({
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
}) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: Goal = {
      id: isEditing ? isEditing : crypto.randomUUID(),
      name,
      targetAmount: parseFloat(target),
      currentAmount: parseFloat(current) || 0,
      color: selectedColor,
    };

    if (isEditing) {
      onUpdateGoal(newGoal);
      setIsEditing(null);
    } else {
      onAddGoal(newGoal);
    }
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setTarget("");
    setCurrent("");
    setSelectedColor(COLORS[0]);
    setFormVisible(false);
    setIsEditing(null);
  };

  const startEdit = (goal: Goal) => {
    setName(goal.name);
    setTarget(goal.targetAmount.toString());
    setCurrent(goal.currentAmount.toString());
    setSelectedColor(goal.color || COLORS[0]);
    setIsEditing(goal.id);
    setFormVisible(true);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Metas de Ahorro</h2>
        {!formVisible && (
          <Button onClick={() => setFormVisible(true)} size="sm" variant="secondary">
            <Plus size={20} />
            Nueva Meta
          </Button>
        )}
      </div>

      {formVisible && (
        <div className="bg-white dark:bg-darkSurface p-4 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 animate-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
            {isEditing ? "Editar Meta" : "Crear Nueva Meta"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Nombre de la meta</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Viaje a Cusco"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-none text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Meta (S/)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-none text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Actual (S/)</label>
                <input
                  type="number"
                  min="0"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-none text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Color identificativo</label>
              <div className="flex flex-wrap gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                      selectedColor === c ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-darkSurface scale-110" : ""
                    }`}
                    style={{ backgroundColor: c, boxShadow: selectedColor === c ? `0 0 10px ${c}80` : 'none' }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={resetForm} className="flex-1">Cancelar</Button>
              <Button type="submit" variant="primary" className="flex-1">
                {isEditing ? "Actualizar" : "Guardar"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {goals.length === 0 && !formVisible && (
          <div className="text-center py-10 text-slate-400">
            <Target className="mx-auto mb-2 opacity-50" size={48} />
            <p>No tienes metas activas.</p>
            <p className="text-sm">¡Empieza a ahorrar para tus sueños!</p>
          </div>
        )}

        {goals.map((goal) => {
          const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
          const goalColor = goal.color || COLORS[0];
          
          return (
            <div key={goal.id} className="bg-white dark:bg-darkSurface p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: goalColor }}
                  >
                    <Trophy size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white leading-tight">{goal.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Falta: S/ {(goal.targetAmount - goal.currentAmount).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(goal)} className="p-2 text-slate-400 hover:text-primary rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => onDeleteGoal(goal.id)} className="p-2 text-slate-400 hover:text-danger rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="relative pt-2">
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-500 dark:text-slate-400">S/ {goal.currentAmount.toFixed(2)}</span>
                  <span style={{ color: goalColor }}>{progress.toFixed(0)}%</span>
                  <span className="text-slate-500 dark:text-slate-400">S/ {goal.targetAmount.toFixed(2)}</span>
                </div>
                <div className="relative h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                    style={{ width: `${progress}%`, backgroundColor: goalColor }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};