import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Expense, Category, GlobalSettings, AppContextType } from '../types';

// eslint-disable-next-line react-refresh/only-export-components
export const StorageContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_CATEGORIES: Category[] = [
    { id: '1', name: 'Housing', color: '#00BFFF', budgetLimit: 1000, isCustom: false }, // Diamond Blue
    { id: '2', name: 'Food', color: '#4CFF00', budgetLimit: 500, isCustom: false },    // Grass Green
    { id: '3', name: 'Transport', color: '#FFD700', budgetLimit: 200, isCustom: false }, // Gold
    { id: '4', name: 'Utilities', color: '#9E9E9E', budgetLimit: 300, isCustom: false }, // Stone
    { id: '5', name: 'Entertainment', color: '#FF2E2E', budgetLimit: 150, isCustom: false }, // Redstone
];

const DEFAULT_SETTINGS: GlobalSettings = {
    monthlyBudget: 3000,
    currency: 'USD',
    darkMode: true,
};

interface StorageProviderProps {
    children: ReactNode;
}

export const StorageProvider: React.FC<StorageProviderProps> = ({ children }) => {
    // Load initial state from localStorage or use defaults
    const [expenses, setExpenses] = useState<Expense[]>(() => {
        const stored = localStorage.getItem('expenses');
        return stored ? JSON.parse(stored) : [];
    });

    const [categories, setCategories] = useState<Category[]>(() => {
        const stored = localStorage.getItem('categories');
        return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
    });

    const [settings, setSettings] = useState<GlobalSettings>(() => {
        const stored = localStorage.getItem('settings');
        return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    });

    // Persist changes
    useEffect(() => {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }, [expenses]);

    useEffect(() => {
        localStorage.setItem('categories', JSON.stringify(categories));
    }, [categories]);

    useEffect(() => {
        localStorage.setItem('settings', JSON.stringify(settings));
        // Apply dark mode class to html element
        if (settings.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [settings]);

    // Actions
    const addExpense = (expense: Omit<Expense, 'id'>) => {
        const newExpense = { ...expense, id: uuidv4() };
        setExpenses((prev) => [newExpense, ...prev]);
    };

    const deleteExpense = (id: string) => {
        setExpenses((prev) => prev.filter((e) => e.id !== id));
    };

    const updateExpense = (id: string, updated: Partial<Expense>) => {
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
    };

    const addCategory = (category: Omit<Category, 'id' | 'isCustom'>): string => {
        const id = uuidv4();
        const newCategory = { ...category, id, isCustom: true };
        setCategories((prev) => [...prev, newCategory]);
        return id;
    };

    const updateCategory = (id: string, updated: Partial<Category>) => {
        setCategories((prev) =>
            prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
        );
    };

    const deleteCategory = (id: string) => {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        // Optional: Handle expenses with deleted category? For now, keep them or remap to 'Uncategorized' is better, but simple delete for MVP.
    };

    const updateSettings = (updated: Partial<GlobalSettings>) => {
        setSettings((prev) => ({ ...prev, ...updated }));
    };

    const resetData = () => {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            setExpenses([]);
            setCategories(DEFAULT_CATEGORIES);
            setSettings(DEFAULT_SETTINGS);
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <StorageContext.Provider
            value={{
                expenses,
                categories,
                settings,
                addExpense,
                deleteExpense,
                updateExpense,
                addCategory,
                updateCategory,
                deleteCategory,
                updateSettings,
                resetData,
            }}
        >
            {children}
        </StorageContext.Provider>
    );
};
