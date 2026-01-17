export interface Category {
    id: string;
    name: string;
    color: string;
    budgetLimit: number; // Monthly budget for this category
    isCustom: boolean;
}

export interface Expense {
    id: string;
    date: string; // ISO Date string
    amount: number;
    categoryId: string;
    description: string;
}

export interface GlobalSettings {
    monthlyBudget: number;
    currency: string;
    darkMode: boolean;
}

export interface AppContextType {
    expenses: Expense[];
    categories: Category[];
    settings: GlobalSettings;
    addExpense: (expense: Omit<Expense, 'id'>) => void;
    deleteExpense: (id: string) => void;
    updateExpense: (id: string, expense: Partial<Expense>) => void; // Added update
    addCategory: (category: Omit<Category, 'id' | 'isCustom'>) => string;
    updateCategory: (id: string, category: Partial<Category>) => void;
    deleteCategory: (id: string) => void;
    updateSettings: (settings: Partial<GlobalSettings>) => void;
    resetData: () => void;
}
