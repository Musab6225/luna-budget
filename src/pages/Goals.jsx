import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { formatCurrency } from '../utils/helpers'
import { Plus, Target, Trash2, Gift } from 'lucide-react'

const GOAL_ICONS = ['💻', '✈️', '🚗', '🏠', '🎓', '💍', '🐶', '🎮', '👗', '📱', '💊', '🌴']

export default function Goals() {
  const { state, dispatch } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [newGoal, setNewGoal] = useState({ name: '', target: '', icon: '💻', deadline: '' })
  
  const { goals } = state
  
  const handleAddGoal = (e) => {
    e.preventDefault()
    if (!newGoal.name || !newGoal.target) return
    
    dispatch({
      type: 'ADD_GOAL',
      payload: {
        name: newGoal.name,
        target: parseFloat(newGoal.target),
        current: 0,
        deadline: newGoal.deadline,
        icon: newGoal.icon,
        color: '#74b9ff',
      },
    })
    
    setNewGoal({ name: '', target: '', icon: '💻', deadline: '' })
    setShowForm(false)
  }
  
  const handleContribute = (goalId, amount) => {
    const goal = goals.find(g => g.id === goalId)
    if (!goal) return
    
    dispatch({
      type: 'UPDATE_GOAL',
      payload: {
        id: goalId,
        data: { current: Math.min(goal.current + amount, goal.target) },
      },
    })
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Goals</h1>
          <p className="text-gray-400 mt-1">Save for what matters most</p>
        </div>
        <Button onClick={() => setShowForm(true)} size="lg">
          <Plus className="w-5 h-5" />
          New Goal
        </Button>
      </div>
      
      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => {
          const progress = (goal.current / goal.target) * 100
          const isComplete = progress >= 100
          
          return (
            <Card key={goal.id} className={`${isComplete ? 'border-growth/50' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{goal.icon}</span>
                  <div>
                    <h3 className="font-display font-semibold text-lg">{goal.name}</h3>
                    <p className="text-sm text-gray-400">
                      Target by {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {isComplete && (
                  <div className="bg-growth/20 text-growth px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Gift className="w-3 h-3" /> Complete!
                  </div>
                )}
              </div>
              
              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">{formatCurrency(goal.current)} saved</span>
                  <span className="font-medium">{formatCurrency(goal.target)}</span>
                </div>
                <div className="w-full bg-space-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-700 ${
                      isComplete ? 'bg-growth' : 'bg-moon-400'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1.5">{progress.toFixed(1)}% complete</p>
              </div>
              
              {/* Quick Add */}
              {!isComplete && (
                <div className="flex gap-2">
                  {[10, 25, 50, 100].map(amount => (
                    <button
                      key={amount}
                      onClick={() => handleContribute(goal.id, amount)}
                      className="flex-1 py-2 bg-space-700 hover:bg-space-600 rounded-lg text-sm transition-colors"
                    >
                      +${amount}
                    </button>
                  ))}
                </div>
              )}
              
              <button
                onClick={() => dispatch({ type: 'DELETE_GOAL', payload: goal.id })}
                className="mt-3 text-xs text-gray-500 hover:text-danger flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Remove goal
              </button>
            </Card>
          )
        })}
      </div>
      
      {goals.length === 0 && (
        <Card className="text-center py-16">
          <p className="text-6xl mb-4">🎯</p>
          <h3 className="font-display text-xl font-semibold mb-2">No goals yet</h3>
          <p className="text-gray-400 mb-6">Set your first savings goal and start your journey!</p>
          <Button onClick={() => setShowForm(true)}>
            <Target className="w-4 h-4" />
            Create Goal
          </Button>
        </Card>
      )}
      
      {/* Add Goal Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-space-800 rounded-2xl border border-space-700 w-full max-w-md p-6">
            <h3 className="font-display text-xl font-semibold mb-4">New Goal</h3>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Goal Name</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="e.g., New Laptop"
                  className="w-full bg-space-900 border border-space-600 rounded-xl py-2.5 px-4 focus:outline-none focus:border-moon-400 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Target Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-space-900 border border-space-600 rounded-xl py-2.5 px-4 focus:outline-none focus:border-moon-400 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Target Date</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full bg-space-900 border border-space-600 rounded-xl py-2.5 px-4 focus:outline-none focus:border-moon-400 transition-colors text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {GOAL_ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewGoal({ ...newGoal, icon })}
                      className={`text-2xl p-2 rounded-xl transition-all ${
                        newGoal.icon === icon ? 'bg-moon-500/20 scale-110' : 'hover:bg-space-700'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Goal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}