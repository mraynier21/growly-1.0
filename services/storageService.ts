import { AppData, Goal, Transaction } from "../types";

const STORAGE_KEY = "growly_data_v1";

export const getStoredData = (): AppData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading from local storage", e);
  }
  return { transactions: [], goals: [] };
};

export const saveStoredData = (data: AppData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving to local storage", e);
  }
};

export const exportData = (data: AppData) => {
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `growly_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const validateImportData = (data: any): data is AppData => {
  return (
    data &&
    Array.isArray(data.transactions) &&
    Array.isArray(data.goals)
  );
};