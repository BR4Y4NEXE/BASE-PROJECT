import React from 'react';
import { useData } from '../../hooks/useData';
import { formatCurrency } from '../../utils/format';

const BudgetProgress: React.FC = () => {
    const { categories, expenses } = useData();

    const getUsage = (catId: string) => {
        return expenses
            .filter(e => e.categoryId === catId)
            .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
    };

    return (
        <div className="bg-obsidian border-4 border-stone p-4 shadow-pixel col-span-1 md:col-span-2">
            <h3 className="text-diamond mb-6 font-bold text-sm">BUDGET_OVERVIEW</h3>
            <div className="space-y-6">
                {categories.map(cat => {
                    if (cat.budgetLimit <= 0) return null;
                    const spent = Math.abs(getUsage(cat.id)); // Use abs to ensure positive bar width
                    const percent = Math.min((spent / cat.budgetLimit) * 100, 100);

                    return (
                        <div key={cat.id}>
                            <div className="flex justify-between text-xs font-mono mb-1">
                                <span className="text-white">{cat.name}</span>
                                <span className="text-white">
                                    {formatCurrency(spent)} / {formatCurrency(cat.budgetLimit)}
                                </span>
                            </div>
                            <div className="h-4 w-full bg-stone/20 border-2 border-stone relative">
                                <div
                                    className="h-full transition-all duration-500"
                                    style={{
                                        width: `${percent}%`,
                                        backgroundColor: cat.color
                                    }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default BudgetProgress;
