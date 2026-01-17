import React, { useRef, useState } from 'react';
import { useData } from '../../hooks/useData';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle } from 'lucide-react';

interface ImportRow {
    Amount?: unknown;
    amount?: unknown;
    AMOUNT?: unknown;
    Date?: unknown;
    date?: unknown;
    DATE?: unknown;
    Category?: unknown;
    category?: unknown;
    CATEGORY?: unknown;
    Description?: unknown;
    description?: unknown;
    DESCRIPTION?: unknown;
    [key: string]: unknown;
}

const ImportTool: React.FC = () => {
    const { addExpense, categories, addCategory } = useData();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    // Helper for text normalization (Title Case)
    const normalizeText = (text: string): string => {
        if (!text) return 'Uncategorized';
        return text
            .trim()
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    // Helper for random color generation
    const generateColor = (): string => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws) as ImportRow[];

                if (data.length === 0) {
                    setStatus('error');
                    setMessage('File is empty.');
                    return;
                }

                let importedCount = 0;
                // Cache for newly created categories in this batch to avoid duplicates
                // key: normalized category name, value: category id
                const newCategoryCache: Record<string, string> = {};

                data.forEach((row) => {
                    const amountVal = row.Amount || row.amount || row.AMOUNT;
                    const amount = Math.abs(parseFloat(String(amountVal)));
                    let dateStr: any = row.Date || row.date || row.DATE;

                    const rawCatName = String(row.Category || row.category || row.CATEGORY || '');
                    const catName = normalizeText(rawCatName);

                    const desc = String(row.Description || row.description || row.DESCRIPTION || 'Imported Expense');

                    if (!amount || isNaN(amount)) return;

                    // Date parsing
                    if (typeof dateStr === 'number') {
                        const dateObj = XLSX.SSF.parse_date_code(dateStr);
                        dateStr = new Date(dateObj.y, dateObj.m - 1, dateObj.d).toISOString().split('T')[0];
                    } else if (dateStr) {
                        try {
                            dateStr = new Date(dateStr).toISOString().split('T')[0];
                        } catch {
                            dateStr = new Date().toISOString().split('T')[0];
                        }
                    } else {
                        dateStr = new Date().toISOString().split('T')[0];
                    }

                    // Find category ID
                    let categoryId: string;

                    // 1. Check existing categories
                    const existingCategory = categories.find(c => c.name.toLowerCase() === catName.toLowerCase());

                    if (existingCategory) {
                        categoryId = existingCategory.id;
                    }
                    // 2. Check cache of newly created categories
                    else if (newCategoryCache[catName]) {
                        categoryId = newCategoryCache[catName];
                    }
                    // 3. Create new category
                    else {
                        const newColor = generateColor();
                        const newId = addCategory({
                            name: catName,
                            color: newColor,
                            budgetLimit: 0, // Default budget
                        });
                        newCategoryCache[catName] = newId;
                        categoryId = newId;
                    }

                    addExpense({
                        amount,
                        date: dateStr,
                        categoryId,
                        description: desc
                    });
                    importedCount++;
                });

                setStatus('success');
                setMessage(`Successfully imported ${importedCount} expenses.`);

            } catch (error) {
                console.error(error);
                setStatus('error');
                setMessage('Failed to parse file. Ensure it is a valid CSV/Excel.');
            }
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div className="bg-obsidian border-4 border-stone p-8 shadow-pixel flex flex-col items-center justify-center min-h-[300px] text-center">

            {status === 'idle' && (
                <>
                    <FileSpreadsheet size={48} className="text-diamond mb-4" />
                    <h3 className="text-xl text-white mb-2 font-bold">IMPORT_DATA</h3>
                    <p className="text-stone text-sm mb-6 max-w-md">
                        Upload a CSV or Excel file. Columns should be: <br />
                        <code className="bg-stone/20 px-1 text-diamond">Date</code>,
                        <code className="bg-stone/20 px-1 text-diamond">Amount</code>,
                        <code className="bg-stone/20 px-1 text-diamond">Category</code>,
                        <code className="bg-stone/20 px-1 text-diamond">Description</code>.
                    </p>

                    <input
                        type="file"
                        accept=".csv, .xlsx, .xls"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-diamond text-obsidian font-bold px-6 py-3 border-2 border-white shadow-pixel active:shadow-none active:translate-y-1 flex items-center gap-2"
                    >
                        <Upload size={18} /> SELECT_FILE
                    </button>
                </>
            )}

            {status === 'success' && (
                <div className="animate-in fade-in zoom-in duration-300">
                    <CheckCircle size={48} className="text-grass mb-4 mx-auto" />
                    <h3 className="text-xl text-grass font-bold mb-2">SUCCESS</h3>
                    <p className="text-white mb-6">{message}</p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="text-stone hover:text-white underline cursor-pointer"
                    >
                        Import Another File
                    </button>
                </div>
            )}

            {status === 'error' && (
                <div className="animate-in fade-in zoom-in duration-300">
                    <AlertTriangle size={48} className="text-redstone mb-4 mx-auto" />
                    <h3 className="text-xl text-redstone font-bold mb-2">ERROR</h3>
                    <p className="text-white mb-6">{message}</p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="text-stone hover:text-white underline cursor-pointer"
                    >
                        Try Again
                    </button>
                </div>
            )}

        </div>
    );
};

export default ImportTool;
