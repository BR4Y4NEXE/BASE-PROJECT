import React from 'react';
import { useData } from '../../hooks/useData';
import { formatCurrency } from '../../utils/format';

const BudgetProgress: React.FC = () => {
    const { categories, expenses } = useData();

    const getUsage = (catId: string) => {
        return expenses
            .filter(e => e.categoryId === catId)
            .reduce((acc, curr) => acc + curr.amount, 0);
    };

    return (
        <div className="bg-obsidian border-4 border-stone p-4 shadow-pixel col-span-1 md:col-span-2">
            <h3 className="text-diamond mb-6 font-bold text-sm">BUDGET_OVERVIEW</h3>
            <div className="space-y-6">
                {categories.map(cat => {
                    if (cat.budgetLimit <= 0) return null;
                    const spent = getUsage(cat.id);
                    const percent = Math.min((spent / cat.budgetLimit) * 100, 100);

                    let barColor = 'bg-grass'; // < 80%
                    if (percent >= 100) barColor = 'bg-redstone'; // > 100%
                    else if (percent >= 80) barColor = 'bg-gold'; // > 80%

                    return (
                        <div key={cat.id}>
                            <div className="flex justify-between text-xs font-mono mb-1">
                                <span className="text-white">{cat.name}</span>
                                <span className="text-stone">
                                    {formatCurrency(spent)} / {formatCurrency(cat.budgetLimit)}
                                </span>
                            </div>
                            <div className="h-4 w-full bg-stone/20 border-2 border-stone relative">
                                <div
                                    className={`h-full ${barColor} transition-all duration-500`}
                                    style={{ width: `${percent}%` }}
                                />
                                {/* Pixel pattern overlay optional */}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default BudgetProgress;
