import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { X, Save } from 'lucide-react';

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose }) => {
    const { categories, addExpense } = useData();
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !categoryId || !date) return;

        addExpense({
            amount: parseFloat(amount),
            categoryId,
            date,
            description,
        });

        // Reset and close
        setAmount('');
        setDescription('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-obsidian border-4 border-white shadow-pixel p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-stone hover:text-redstone transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-xl text-diamond mb-6 font-bold drop-shadow-md">ADD_EXPENSE</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-stone text-xs mb-2 font-mono">AMOUNT ($)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-obsidian border-2 border-stone focus:border-diamond p-3 text-white font-mono outline-none shadow-pixel"
                            placeholder="0.00"
                            step="0.01"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-stone text-xs mb-2 font-mono">CATEGORY</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full bg-obsidian border-2 border-stone focus:border-diamond p-3 text-white font-mono outline-none shadow-pixel appearance-none"
                            required
                        >
                            <option value="" disabled>SELECT_CATEGORY</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-stone text-xs mb-2 font-mono">DATE</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-obsidian border-2 border-stone focus:border-diamond p-3 text-white font-mono outline-none shadow-pixel"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-stone text-xs mb-2 font-mono">DESCRIPTION</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-obsidian border-2 border-stone focus:border-diamond p-3 text-white font-mono outline-none shadow-pixel resize-none"
                            rows={3}
                            placeholder="What was it for?"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-grass text-obsidian font-bold py-3 mt-4 border-2 border-white shadow-pixel active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                        <Save size={18} />
                        CONFIRM_TRANSACTION
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseModal;
