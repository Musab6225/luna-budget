import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Button from './ui/Button'
import { Plus, X } from 'lucide-react'

export default function ExpenseForm({ onClose }) {
  const { dispatch, CATEGORIES } = useApp()
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0].id)
  const [description, setDescription] = useState('')
  const [mood, setMood] = useState('😊')
  
  const moods = ['😊', '😎', '😴', '😤', '😰', '🤩', '🥳', '😋']
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || isNaN(amount)) return
    
    dispatch({
      type: 'ADD_EXPENSE',
      payload: {
        amount: parseFloat(amount),
        category,
        description: description || CATEGORIES.find(c => c.id === category)?.name,
        mood,
      },
    })
    
    setAmount('')
    setDescription('')
    setCategory(CATEGORIES[0].id)
    setMood('😊')
    onClose?.()
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg">New Expense</h3>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-space-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Amount */}
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Amount ($)</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-space-900 border border-space-600 rounded-xl py-3 pl-10 pr-4 text-lg font-semibold focus:outline-none focus:border-moon-400 focus:ring-1 focus:ring-moon-400 transition-colors"
            required
          />
        </div>
      </div>
      
      {/* Category */}
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Category</label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.filter(c => c.id !== 'savings').map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all ${
                category === cat.id
                  ? 'border-moon-400 bg-moon-500/10 text-white'
                  : 'border-space-600 bg-space-900 text-gray-400 hover:border-space-500'
              }`}
            >
              <span>{cat.planet}</span>
              <span className="text-sm">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Description */}
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Description (optional)</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What did you spend on?"
          className="w-full bg-space-900 border border-space-600 rounded-xl py-2.5 px-4 focus:outline-none focus:border-moon-400 focus:ring-1 focus:ring-moon-400 transition-colors"
        />
      </div>
      
      {/* Mood */}
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">How do you feel?</label>
        <div className="flex gap-2">
          {moods.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMood(m)}
              className={`text-2xl p-2 rounded-xl transition-all ${
                mood === m ? 'bg-moon-500/20 scale-110' : 'hover:bg-space-700'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      
      <Button type="submit" className="w-full">
        <Plus className="w-4 h-4" />
        Add Expense (+10 XP)
      </Button>
    </form>
  )
}