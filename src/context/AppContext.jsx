import { createContext, useContext, useReducer, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const AppContext = createContext()

const CATEGORIES = [
  { id: 'food', name: 'Food & Dining', color: '#e17055', icon: 'utensils', planet: '🍕' },
  { id: 'transport', name: 'Transport', color: '#74b9ff', icon: 'car', planet: '🚗' },
  { id: 'shopping', name: 'Shopping', color: '#fd79a8', icon: 'shopping-bag', planet: '🛍️' },
  { id: 'entertainment', name: 'Entertainment', color: '#a29bfe', icon: 'film', planet: '🎬' },
  { id: 'bills', name: 'Bills & Utilities', color: '#ffeaa7', icon: 'zap', planet: '⚡' },
  { id: 'health', name: 'Health', color: '#00b894', icon: 'heart', planet: '💚' },
  { id: 'education', name: 'Education', color: '#fab1a0', icon: 'book', planet: '📚' },
  { id: 'savings', name: 'Savings', color: '#55efc4', icon: 'piggy-bank', planet: '🐷' },
]

const INITIAL_STATE = {
  user: {
    name: 'Luna',
    level: 1,
    xp: 0,
    totalXp: 100,
    streak: 3,
    coins: 150,
    joinedDate: new Date().toISOString(),
  },
  budget: {
    monthlyIncome: 3000,
    monthlyBudget: 2500,
    categories: {
      food: 400,
      transport: 200,
      shopping: 300,
      entertainment: 150,
      bills: 500,
      health: 100,
      education: 150,
      savings: 700,
    },
  },
  expenses: [],
  goals: [
    {
      id: uuidv4(),
      name: 'New Laptop',
      target: 1200,
      current: 450,
      deadline: '2026-08-01',
      icon: '💻',
      color: '#74b9ff',
    },
    {
      id: uuidv4(),
      name: 'Vacation Fund',
      target: 2000,
      current: 800,
      deadline: '2026-10-01',
      icon: '✈️',
      color: '#fd79a8',
    },
  ],
  achievements: [
    { id: 'first-log', name: 'First Step', description: 'Log your first expense', icon: '🌟', unlocked: true, date: new Date().toISOString() },
    { id: 'streak-3', name: 'On Fire', description: '3-day logging streak', icon: '🔥', unlocked: true, date: new Date().toISOString() },
    { id: 'streak-7', name: 'Week Warrior', description: '7-day logging streak', icon: '⚔️', unlocked: false },
    { id: 'under-budget', name: 'Budget Master', description: 'Stay under budget for a month', icon: '🏆', unlocked: false },
    { id: 'savings-500', name: 'Saver', description: 'Save $500 total', icon: '💰', unlocked: false },
    { id: 'no-spend', name: 'No-Spend Day', description: 'Go a full day without spending', icon: '🚫', unlocked: false },
  ],
  aiPersonality: {
    name: 'Stella',
    avatar: '⭐',
    mood: 'cheerful',
  },
  theme: localStorage.getItem('luna-theme') || 'space',
}

function loadState() {
  try {
    const saved = localStorage.getItem('luna-budget-data')
    if (saved) {
      const parsed = JSON.parse(saved)
      return { ...INITIAL_STATE, ...parsed, expenses: parsed.expenses || [] }
    }
  } catch (e) {
    console.error('Failed to load state:', e)
  }
  return INITIAL_STATE
}

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_EXPENSE': {
      const newExpense = {
        ...action.payload,
        id: uuidv4(),
        date: new Date().toISOString(),
      }
      const newExpenses = [newExpense, ...state.expenses]
      const categoryTotal = newExpenses
        .filter(e => e.category === newExpense.category)
        .reduce((sum, e) => sum + e.amount, 0)
      
      let newAchievements = [...state.achievements]
      let xpGain = 10
      let coinGain = 5
      
      if (newExpenses.length === 1 && !newAchievements.find(a => a.id === 'first-log')?.unlocked) {
        newAchievements = newAchievements.map(a => 
          a.id === 'first-log' ? { ...a, unlocked: true, date: new Date().toISOString() } : a
        )
        xpGain += 50
        coinGain += 20
      }
      
      const budgetLimit = state.budget.categories[newExpense.category]
      if (categoryTotal <= budgetLimit) {
        xpGain += 5
      }
      
      const newXp = state.user.xp + xpGain
      const levelUp = newXp >= state.user.totalXp
      const newLevel = levelUp ? state.user.level + 1 : state.user.level
      const newTotalXp = levelUp ? state.user.totalXp + 100 : state.user.totalXp
      const remainingXp = levelUp ? newXp - state.user.totalXp : newXp
      
      return {
        ...state,
        expenses: newExpenses,
        user: {
          ...state.user,
          level: newLevel,
          xp: remainingXp,
          totalXp: newTotalXp,
          coins: state.user.coins + coinGain,
        },
        achievements: newAchievements,
      }
    }
    
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(e => e.id !== action.payload),
      }
    
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budget: { ...state.budget, ...action.payload },
      }
    
    case 'ADD_GOAL':
      return {
        ...state,
        goals: [...state.goals, { ...action.payload, id: uuidv4() }],
      }
    
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(g => 
          g.id === action.payload.id ? { ...g, ...action.payload.data } : g
        ),
      }
    
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(g => g.id !== action.payload),
      }
    
    case 'ADD_XP':
      return {
        ...state,
        user: {
          ...state.user,
          xp: state.user.xp + action.payload,
        },
      }
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
    
    case 'SET_THEME':
      localStorage.setItem('luna-theme', action.payload)
      return {
        ...state,
        theme: action.payload,
      }
    
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, undefined, loadState)
  
  useEffect(() => {
    localStorage.setItem('luna-budget-data', JSON.stringify(state))
  }, [state])
  
  return (
    <AppContext.Provider value={{ state, dispatch, CATEGORIES }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}