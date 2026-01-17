import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Plus, Trash2 } from 'lucide-react';

const CategoryManager: React.FC = () => {
    const { categories, addCategory, deleteCategory } = useData();
    const [newCatName, setNewCatName] = useState('');
    const [newCatColor, setNewCatColor] = useState('#00BFFF'); // Default Diamond Blue
    const [budgetLimit, setBudgetLimit] = useState('100');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName) return;

        addCategory({
            name: newCatName,
            color: newCatColor,
            budgetLimit: parseFloat(budgetLimit) || 0,
        });

        setNewCatName('');
        setBudgetLimit('100');
    };

    return (
        <div className="bg-obsidian border-4 border-stone p-6 shadow-pixel mb-8">
            <h3 className="text-xl text-diamond mb-4">CATEGORY_MANAGEMENT</h3>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-3 border-2 border-stone bg-obsidian/50 shadow-sm relative group">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-4 h-4 border-2 border-white shadow-pixel"
                                style={{ backgroundColor: cat.color }}
                            />
                            <div>
                                <span className="font-bold text-sm block">{cat.name}</span>
                                <span className="text-xs text-stone font-mono">Limit: ${cat.budgetLimit}</span>
                            </div>
                        </div>
                        {cat.isCustom && (
                            <button
                                onClick={() => deleteCategory(cat.id)}
                                className="text-stone hover:text-redstone p-1"
                                title="Delete Category"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                        {!cat.isCustom && <span className="text-[10px] text-stone opacity-50 absolute top-1 right-1">DEFAULT</span>}
                    </div>
                ))}
            </div>

            {/* Add Form */}
            <form onSubmit={handleAdd} className="border-t-2 border-stone pt-4 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="text-xs text-stone block mb-1">NAME</label>
                    <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        className="w-full bg-obsidian border-2 border-stone p-2 text-sm focus:border-diamond outline-none"
                        placeholder="New Category"
                        required
                    />
                </div>
                <div className="w-full md:w-32">
                    <label className="text-xs text-stone block mb-1">COLOR</label>
                    <input
                        type="color"
                        value={newCatColor}
                        onChange={(e) => setNewCatColor(e.target.value)}
                        className="w-full h-[38px] bg-obsidian border-2 border-stone p-1 cursor-pointer"
                    />
                </div>
                <div className="w-full md:w-32">
                    <label className="text-xs text-stone block mb-1">LIMIT ($)</label>
                    <input
                        type="number"
                        value={budgetLimit}
                        onChange={(e) => setBudgetLimit(e.target.value)}
                        className="w-full bg-obsidian border-2 border-stone p-2 text-sm focus:border-diamond outline-none"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full md:w-auto bg-diamond text-obsidian font-bold px-6 py-2 border-2 border-white shadow-pixel active:translate-y-1 active:shadow-none h-[38px] flex items-center justify-center gap-2"
                >
                    <Plus size={16} /> ADD
                </button>
            </form>
        </div>
    );
};

export default CategoryManager;
