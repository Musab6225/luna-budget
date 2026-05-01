import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ExpenseForm from '../components/ExpenseForm'
import { formatCurrency, formatDate } from '../utils/helpers'
import { Plus, Trash2, Filter, Search } from 'lucide-react'

export default function Expenses() {
  const { state, dispatch, CATEGORIES } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  const { expenses } = state
  
  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory
    const matchesSearch = !searchQuery || 
      expense.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })
  
  const totalFiltered = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Expenses</h1>
          <p className="text-gray-400 mt-1">{expenses.length} transactions logged</p>
        </div>
        <Button onClick={() => setShowForm(true)} size="lg">
          <Plus className="w-5 h-5" />
          Add New
        </Button>
      </div>
      
      {/* Filters */}
      <Card className="!p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-space-900 border border-space-600 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-moon-400 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                filterCategory === 'all' ? 'bg-moon-500/20 text-moon-300' : 'bg-space-700 text-gray-400'
              }`}
            >
              All
            </button>
            {CATEGORIES.filter(c => c.id !== 'savings').map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  filterCategory === cat.id ? 'bg-moon-500/20 text-moon-300' : 'bg-space-700 text-gray-400'
                }`}
              >
                {cat.planet} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </Card>
      
      {/* Summary */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">
          Showing {filteredExpenses.length} of {expenses.length} expenses
        </span>
        <span className="font-medium">
          Total: <span className="text-white">{formatCurrency(totalFiltered)}</span>
        </span>
      </div>
      
      {/* Expenses List */}
      <div className="space-y-3">
        {filteredExpenses.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-4xl mb-3">🌌</p>
            <p className="text-gray-400">No expenses found</p>
            <p className="text-sm text-gray-500 mt-1">Start by adding your first expense!</p>
          </Card>
        ) : (
          filteredExpenses.map(expense => {
            const cat = CATEGORIES.find(c => c.id === expense.category)
            return (
              <Card key={expense.id} className="!p-4 hover:border-space-600 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${cat?.color}20` }}
                    >
                      {cat?.planet}
                    </div>
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">{cat?.name}</span>
                        <span className="text-xs text-gray-600">•</span>
                        <span className="text-xs text-gray-500">{formatDate(expense.date)}</span>
                        <span className="text-xs">{expense.mood}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold">{formatCurrency(expense.amount)}</span>
                    <button
                      onClick={() => dispatch({ type: 'DELETE_EXPENSE', payload: expense.id })}
                      className="p-2 hover:bg-danger/20 rounded-lg transition-colors group"
                    >
                      <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-danger" />
                    </button>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
      
      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-space-800 rounded-2xl border border-space-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <ExpenseForm onClose={() => setShowForm(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}