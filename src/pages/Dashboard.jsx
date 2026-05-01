import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import PlanetCard from '../components/PlanetCard'
import ExpenseForm from '../components/ExpenseForm'
import AchievementBadge from '../components/AchievementBadge'
import { formatCurrency, getDaysRemaining } from '../utils/helpers'
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target, 
  Plus,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { state, CATEGORIES } = useApp()
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  
  const { expenses, budget, goals, user, achievements } = state
  
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalBudget = Object.values(budget.categories).reduce((sum, b) => sum + b, 0)
  const remaining = totalBudget - totalSpent
  const daysLeft = getDaysRemaining()
  
  const recentExpenses = expenses.slice(0, 5)
  const unlockedAchievements = achievements.filter(a => a.unlocked)
  
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
  <h1 className="font-display text-3xl font-bold text-white">
    Hello, {user.name}! 🌙
  </h1>
  <p className="text-moon-300 text-sm mt-1.5 flex items-center gap-2 animate-pulse-slow">
    <span className="inline-block animate-heartbeat">💖</span>
    Every step you take brings you closer to your dreams — I'm so proud of you, Luna!
    <span className="inline-block animate-heartbeat">💖</span>
  </p>
  <p className="text-gray-400 mt-1">
    {daysLeft} days left in May • Level {user.level} Explorer
  </p>
</div>
        <Button onClick={() => setShowExpenseForm(true)} size="lg">
          <Plus className="w-5 h-5" />
          Add Expense
        </Button>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="!p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Spent</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="w-12 h-12 bg-danger/20 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-danger" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Badge variant={remaining >= 0 ? 'success' : 'danger'}>
              {remaining >= 0 ? 'On Track' : 'Over Budget'}
            </Badge>
          </div>
        </Card>
        
        <Card className="!p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Remaining</p>
              <p className={`text-2xl font-bold mt-1 ${remaining >= 0 ? 'text-growth' : 'text-danger'}`}>
                {formatCurrency(remaining)}
              </p>
            </div>
            <div className="w-12 h-12 bg-growth/20 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-growth" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            {daysLeft} days to go
          </p>
        </Card>
        
        <Card className="!p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Monthly Budget</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalBudget)}</p>
            </div>
            <div className="w-12 h-12 bg-moon-500/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-moon-300" />
            </div>
          </div>
          <div className="mt-3 w-full bg-space-700 rounded-full h-2">
            <div 
              className="bg-moon-400 h-2 rounded-full transition-all"
              style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
            />
          </div>
        </Card>
        
        <Card className="!p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Goals Progress</p>
              <p className="text-2xl font-bold text-star-300 mt-1">
                {goals.length > 0 
                  ? `${((goals.reduce((sum, g) => sum + g.current, 0) / goals.reduce((sum, g) => sum + g.target, 0)) * 100).toFixed(0)}%`
                  : '0%'
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-star-400/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-star-400" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            {goals.length} active goals
          </p>
        </Card>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Planets */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Your Galaxy</h2>
            <Link to="/expenses" className="text-moon-300 text-sm hover:text-moon-200 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CATEGORIES.filter(c => c.id !== 'savings').map(category => (
              <PlanetCard key={category.id} category={category} />
            ))}
          </div>
        </div>
        
        {/* Side Panel */}
        <div className="space-y-6">
          {/* AI Quick Tip */}
          <Card 
            title="Stella's Tip" 
            icon="⭐"
            action={<Sparkles className="w-4 h-4 text-moon-300" />}
          >
            <p className="text-gray-300 text-sm leading-relaxed">
              "Hey Luna! I noticed you've been doing great with your food budget. 
              Want to challenge yourself to a no-spend weekend? It could boost your 
              streak and earn bonus coins! 🌟"
            </p>
            <Link to="/advisor">
              <Button variant="ghost" size="sm" className="mt-3 w-full">
                Chat with Stella <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
          
          {/* Recent Expenses */}
          <Card title="Recent Activity" icon="📋">
            <div className="space-y-3">
              {recentExpenses.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No expenses yet. Start logging!</p>
              ) : (
                recentExpenses.map(expense => {
                  const cat = CATEGORIES.find(c => c.id === expense.category)
                  return (
                    <div key={expense.id} className="flex items-center justify-between py-2 border-b border-space-700 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{cat?.planet}</span>
                        <div>
                          <p className="text-sm font-medium">{expense.description}</p>
                          <p className="text-xs text-gray-500">{cat?.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">{formatCurrency(expense.amount)}</p>
                        <span className="text-xs">{expense.mood}</span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </Card>
          
          {/* Achievements */}
          <Card title="Achievements" icon="🏆">
            <div className="flex flex-wrap gap-3">
              {achievements.map(achievement => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              {unlockedAchievements.length}/{achievements.length} unlocked
            </p>
          </Card>
        </div>
      </div>
      
      {/* Expense Modal */}
      {showExpenseForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-space-800 rounded-2xl border border-space-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <ExpenseForm onClose={() => setShowExpenseForm(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}