import React, { useRef, useState } from 'react';
import { useData } from '../../hooks/useData';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle } from 'lucide-react';

const ImportTool: React.FC = () => {
    const { addExpense, categories } = useData();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

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
                const data = XLSX.utils.sheet_to_json(ws);

                if (data.length === 0) {
                    setStatus('error');
                    setMessage('File is empty.');
                    return;
                }

                let importedCount = 0;

                // Simple mapping: looks for 'amount', 'date', 'category', 'description'
                // Case insensitive
                data.forEach((row: any) => {
                    const amount = parseFloat(row.Amount || row.amount || row.AMOUNT);
                    let dateStr = row.Date || row.date || row.DATE;
                    const catName = row.Category || row.category || row.CATEGORY;
                    const desc = row.Description || row.description || row.DESCRIPTION || 'Imported Expense';

                    if (!amount || isNaN(amount)) return;

                    // Date parsing (simplistic)
                    // If excel date number
                    if (typeof dateStr === 'number') {
                        const dateObj = XLSX.SSF.parse_date_code(dateStr);
                        dateStr = new Date(dateObj.y, dateObj.m - 1, dateObj.d).toISOString().split('T')[0];
                    } else if (dateStr) {
                        // Try to parse string
                        try {
                            dateStr = new Date(dateStr).toISOString().split('T')[0];
                        } catch (e) {
                            dateStr = new Date().toISOString().split('T')[0];
                        }
                    } else {
                        dateStr = new Date().toISOString().split('T')[0];
                    }

                    // Find category ID by name, or use first default
                    const category = categories.find(c => c.name.toLowerCase() === (catName || '').toLowerCase());
                    const categoryId = category ? category.id : categories[0].id;

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
