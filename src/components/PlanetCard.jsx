import { useApp } from '../context/AppContext'
import { formatCurrency } from '../utils/helpers'

export default function PlanetCard({ category }) {
  const { state } = useApp()
  const { expenses, budget } = state
  
  const spent = expenses
    .filter(e => e.category === category.id)
    .reduce((sum, e) => sum + e.amount, 0)
  
  const limit = budget.categories[category.id] || 0
  const percentage = limit > 0 ? (spent / limit) * 100 : 0
  const remaining = limit - spent
  
  const getPlanetSize = () => {
    if (percentage < 30) return 'text-4xl'
    if (percentage < 60) return 'text-5xl'
    if (percentage < 90) return 'text-6xl'
    return 'text-7xl'
  }
  
  const getStatus = () => {
    if (percentage < 50) return { color: 'text-growth', bg: 'bg-growth/20', border: 'border-growth/30' }
    if (percentage < 80) return { color: 'text-star-400', bg: 'bg-star-400/20', border: 'border-star-400/30' }
    if (percentage < 100) return { color: 'text-warning', bg: 'bg-warning/20', border: 'border-warning/30' }
    return { color: 'text-danger', bg: 'bg-danger/20', border: 'border-danger/30' }
  }
  
  const status = getStatus()
  
  return (
    <div className="bg-space-800 rounded-2xl border border-space-700 p-5 hover:border-space-600 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className={`${getPlanetSize()} transition-all duration-500 group-hover:scale-110`}>
          {category.planet}
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} border ${status.border}`}>
          {percentage.toFixed(0)}%
        </div>
      </div>
      
      <h4 className="font-medium text-white mb-1">{category.name}</h4>
      
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Spent</span>
          <span className="font-medium">{formatCurrency(spent)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Budget</span>
          <span className="font-medium">{formatCurrency(limit)}</span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 w-full bg-space-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-700 ${
            percentage > 100 ? 'bg-danger' : percentage > 80 ? 'bg-warning' : 'bg-growth'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      
      <p className={`text-xs mt-2 ${remaining >= 0 ? 'text-gray-500' : 'text-danger'}`}>
        {remaining >= 0 
          ? `${formatCurrency(remaining)} remaining` 
          : `${formatCurrency(Math.abs(remaining))} over budget`
        }
      </p>
    </div>
  )
}