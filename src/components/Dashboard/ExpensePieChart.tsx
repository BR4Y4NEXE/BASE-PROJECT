import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useData } from '../../hooks/useData';
import { formatCurrency } from '../../utils/format';

const ExpensePieChart: React.FC = () => {
    const { expenses, categories } = useData();

    const data = categories.map(cat => {
        const amount = expenses
            .filter(e => e.categoryId === cat.id)
            .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
        return {
            name: cat.name,
            value: amount,
            color: cat.color
        };
    }).filter(item => item.value > 0);

    if (data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-stone border-4 border-stone border-dashed">
                NODATA
            </div>
        )
    }

    return (
        <div className="bg-obsidian border-4 border-stone p-4 shadow-pixel">
            <h3 className="text-diamond mb-4 font-bold text-sm">SPEND_BY_CATEGORY</h3>
            <div className="h-64 w-full text-xs font-mono">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1D1D21', border: '2px solid #9E9E9E', borderRadius: '0px' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number | undefined) => formatCurrency(value || 0)}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ExpensePieChart;
