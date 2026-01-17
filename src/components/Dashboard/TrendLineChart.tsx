import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useData } from '../../hooks/useData';
import { formatCurrency } from '../../utils/format';
import { startOfMonth, subMonths, format, endOfMonth, isWithinInterval } from 'date-fns';

const TrendLineChart: React.FC = () => {
    const { expenses } = useData();

    // Generate last 6 months
    const months = Array.from({ length: 6 }, (_, i) => {
        const d = subMonths(new Date(), 5 - i);
        return {
            name: format(d, 'MMM'),
            start: startOfMonth(d),
            end: endOfMonth(d),
            amount: 0
        };
    });

    // Aggregate
    expenses.forEach(e => {
        const date = new Date(e.date);
        const month = months.find(m => isWithinInterval(date, { start: m.start, end: m.end }));
        if (month) {
            month.amount += e.amount;
        }
    });

    return (
        <div className="bg-obsidian border-4 border-stone p-4 shadow-pixel">
            <h3 className="text-diamond mb-4 font-bold text-sm">MONTHLY_TREND</h3>
            <div className="h-64 w-full text-xs font-mono">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={months}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#9E9E9E" tick={{ fill: '#9E9E9E' }} />
                        <YAxis stroke="#9E9E9E" tick={{ fill: '#9E9E9E' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1D1D21', border: '2px solid #9E9E9E' }}
                            formatter={(value: number | undefined) => formatCurrency(value || 0)}
                        />
                        <Line
                            type="step"
                            dataKey="amount"
                            stroke="#00BFFF"
                            strokeWidth={3}
                            dot={{ stroke: '#fff', strokeWidth: 2, r: 4, fill: '#1D1D21' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TrendLineChart;
