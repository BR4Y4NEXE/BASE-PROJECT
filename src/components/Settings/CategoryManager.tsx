import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Plus, Trash2 } from 'lucide-react';

const CategoryManager: React.FC = () => {
    const { categories, addCategory, deleteCategory, updateCategory, resetData } = useData();

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [catName, setCatName] = useState('');
    const [catColor, setCatColor] = useState('#00BFFF'); // Default Diamond Blue
    const [budgetLimit, setBudgetLimit] = useState('100');

    // Load category into form for editing
    const startEditing = (cat: typeof categories[0]) => {
        setEditingId(cat.id);
        setCatName(cat.name);
        setCatColor(cat.color);
        setBudgetLimit(String(cat.budgetLimit));
    };

    const cancelEditing = () => {
        setEditingId(null);
        setCatName('');
        setCatColor('#00BFFF');
        setBudgetLimit('100');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!catName) return;

        if (editingId) {
            // Update
            updateCategory(editingId, {
                name: catName,
                color: catColor,
                budgetLimit: parseFloat(budgetLimit) || 0,
            });
        } else {
            // Add new
            addCategory({
                name: catName,
                color: catColor,
                budgetLimit: parseFloat(budgetLimit) || 0,
            });
        }

        // Reset form
        cancelEditing();
    };

    return (
        <div className="bg-obsidian border-4 border-stone p-6 shadow-pixel mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl text-diamond">CATEGORY_MANAGEMENT</h3>
                <button
                    onClick={resetData}
                    className="text-xs text-redstone border border-redstone px-2 py-1 hover:bg-redstone hover:text-white transition-colors"
                >
                    RESET_DATA
                </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className={`flex items-center justify-between p-3 border-2 ${editingId === cat.id ? 'border-diamond bg-diamond/10' : 'border-stone bg-obsidian/50'} shadow-sm relative group cursor-pointer hover:border-white transition-colors`}
                        onClick={() => startEditing(cat)}
                    >
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

                        <div className="flex gap-2">
                            {cat.isCustom && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteCategory(cat.id); }}
                                    className="text-stone hover:text-redstone p-1"
                                    title="Delete Category"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                        {!cat.isCustom && cat.id !== editingId && <span className="text-[10px] text-stone opacity-50 absolute top-1 right-1">DEFAULT</span>}
                        {editingId === cat.id && <span className="text-[10px] text-diamond font-bold absolute top-1 right-1">EDITING</span>}
                    </div>
                ))}
            </div>

            {/* Add/Edit Form */}
            <form onSubmit={handleSubmit} className="border-t-2 border-stone pt-4 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full relative">
                    <label className="text-xs text-stone block mb-1">
                        {editingId ? `EDITING: ${categories.find(c => c.id === editingId)?.name}` : 'NEW_CATEGORY_NAME'}
                    </label>
                    <input
                        type="text"
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        className="w-full bg-obsidian border-2 border-stone p-2 text-sm focus:border-diamond outline-none"
                        placeholder="Name"
                        required
                    />
                </div>
                <div className="w-full md:w-32">
                    <label className="text-xs text-stone block mb-1">COLOR</label>
                    <input
                        type="color"
                        value={catColor}
                        onChange={(e) => setCatColor(e.target.value)}
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
                <div className="flex gap-2 w-full md:w-auto">
                    {editingId && (
                        <button
                            type="button"
                            onClick={cancelEditing}
                            className="flex-1 md:w-auto bg-stone text-obsidian font-bold px-4 py-2 border-2 border-white shadow-pixel active:translate-y-1 active:shadow-none h-[38px]"
                        >
                            CANCEL
                        </button>
                    )}
                    <button
                        type="submit"
                        className="flex-1 md:w-auto bg-diamond text-obsidian font-bold px-6 py-2 border-2 border-white shadow-pixel active:translate-y-1 active:shadow-none h-[38px] flex items-center justify-center gap-2"
                    >
                        {editingId ? 'UPDATE' : <><Plus size={16} /> ADD</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryManager;
