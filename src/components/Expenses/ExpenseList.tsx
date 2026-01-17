import React from 'react';
import { useData } from '../../hooks/useData';
import { formatCurrency, formatDate } from '../../utils/format';
import { Trash2 } from 'lucide-react';

const ExpenseList: React.FC = () => {
    const { expenses, categories, deleteExpense } = useData();

    const getCategory = (id: string) => categories.find((c) => c.id === id);

    if (expenses.length === 0) {
        return (
            <div className="text-center p-8 border-4 border-stone border-dashed text-stone">
                NO_DATA_FOUND
            </div>
        );
    }

    return (
        <div className="overflow-x-auto border-4 border-stone shadow-pixel">
            <table className="w-full text-left border-collapse">
                <thead className="bg-stone text-obsidian border-b-4 border-obsidian">
                    <tr>
                        <th className="p-3 font-pixel text-xs">DATE</th>
                        <th className="p-3 font-pixel text-xs">CATEGORY</th>
                        <th className="p-3 font-pixel text-xs">DESCRIPTION</th>
                        <th className="p-3 font-pixel text-xs text-right">AMOUNT</th>
                        <th className="p-3 font-pixel text-xs text-center">ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense) => {
                        const cat = getCategory(expense.categoryId);
                        return (
                            <tr key={expense.id} className="border-b border-stone/20 hover:bg-white/5 transition-colors">
                                <td className="p-3 font-mono text-sm">{formatDate(expense.date)}</td>
                                <td className="p-3 font-mono text-sm">
                                    {cat && (
                                        <span
                                            className="px-2 py-1 text-[10px] font-bold border border-current shadow-sm inline-block"
                                            style={{ color: cat.color, borderColor: cat.color }}
                                        >
                                            {cat.name.toUpperCase()}
                                        </span>
                                    )}
                                </td>
                                <td className="p-3 font-mono text-sm text-stone">{expense.description || '-'}</td>
                                <td className="p-3 font-mono text-sm text-right font-bold text-white">
                                    {formatCurrency(expense.amount)}
                                </td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => deleteExpense(expense.id)}
                                        className="text-stone hover:text-redstone transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ExpenseList;
