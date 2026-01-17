import { useState } from 'react'
import Layout from './components/Layout/Layout'
import { useData } from './hooks/useData'
import ExpenseList from './components/Expenses/ExpenseList'
import AddExpenseModal from './components/Expenses/AddExpenseModal'
import CategoryManager from './components/Settings/CategoryManager'
import ImportTool from './components/Expenses/ImportTool'
import ExpensePieChart from './components/Dashboard/ExpensePieChart'
import TrendLineChart from './components/Dashboard/TrendLineChart'
import BudgetProgress from './components/Dashboard/BudgetProgress'
import { Plus } from 'lucide-react'
import { formatCurrency } from './utils/format'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const { expenses, settings } = useData();

  // Simple Dashboard Stats Calculation
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalBudget = settings.monthlyBudget;
  const remaining = totalBudget - totalSpent;

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <AddExpenseModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} />
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <header className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl text-diamond drop-shadow-md">DASHBOARD</h2>
              <p className="text-stone font-mono text-sm">Overview of household finances.</p>
            </div>
            <button
              onClick={() => setAddModalOpen(true)}
              className="bg-grass text-obsidian font-bold px-4 py-2 border-2 border-white shadow-pixel active:shadow-none active:translate-y-1 flex items-center gap-2"
            >
              <Plus size={18} /> ADD_EXPENSE
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stats Cards */}
            <div className="bg-obsidian border-4 border-stone p-4 shadow-pixel">
              <span className="text-xs text-stone block mb-2">TOTAL SPENT</span>
              <span className="text-2xl text-white font-pixel">{formatCurrency(totalSpent)}</span>
            </div>
            <div className="bg-obsidian border-4 border-stone p-4 shadow-pixel">
              <span className="text-xs text-stone block mb-2">BUDGET REMAINING</span>
              <span className={`text-2xl font-pixel ${remaining < 0 ? 'text-redstone' : 'text-grass'}`}>
                {formatCurrency(remaining)}
              </span>
            </div>
            <div className="bg-obsidian border-4 border-stone p-4 shadow-pixel">
              <span className="text-xs text-stone block mb-2">PROJECTED END</span>
              <span className="text-2xl text-gold font-pixel">
                {formatCurrency(totalSpent)}
                {/* Simplified projection for MVP */}
              </span>
            </div>
            <div className="bg-obsidian border-4 border-stone p-4 shadow-pixel">
              <span className="text-xs text-stone block mb-2">DAILY AVG</span>
              <span className="text-2xl text-diamond font-pixel">
                {formatCurrency(totalSpent / (new Date().getDate() || 1))}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpensePieChart />
            <TrendLineChart />
          </div>

          <BudgetProgress />
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="space-y-6">
          <header className="flex justify-between items-end">
            <h2 className="text-2xl text-diamond">EXPENSES</h2>
            <button
              onClick={() => setAddModalOpen(true)}
              className="bg-grass text-obsidian font-bold px-4 py-2 border-2 border-white shadow-pixel active:shadow-none active:translate-y-1 flex items-center gap-2"
            >
              <Plus size={18} /> ADD_NEW
            </button>
          </header>
          <ExpenseList />
        </div>
      )}

      {activeTab === 'import' && (
        <div className="space-y-6">
          <h2 className="text-2xl text-diamond">IMPORT DATA</h2>
          <ImportTool />
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <h2 className="text-2xl text-diamond mb-4">SETTINGS</h2>
          <CategoryManager />
          <div className="bg-obsidian border-4 border-stone p-4 shadow-pixel">
            <h3 className="text-lg text-white mb-2 font-bold">APP_CONFIG</h3>
            <p className="text-stone text-sm">Dark mode and currency settings coming soon.</p>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default App
