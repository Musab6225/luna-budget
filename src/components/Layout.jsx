import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import ThemeSwitcher from './ThemeSwitcher'
import { 
  Home, 
  Receipt, 
  Target, 
  Sparkles, 
  User, 
  Menu, 
  X,
  Star,
  Flame,
  Coins
} from 'lucide-react'

const NAV_ITEMS = [
  { path: '/', label: 'Galaxy', icon: Home },
  { path: '/expenses', label: 'Expenses', icon: Receipt },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/advisor', label: 'Stella', icon: Sparkles },
  { path: '/profile', label: 'Profile', icon: User },
]

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { state } = useApp()
  const location = useLocation()
  
  const { user } = state
  
  return (
    <div className="min-h-screen bg-space-900 text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-space-800/80 backdrop-blur-md border-b border-space-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🌙</span>
              <span className="font-display font-bold text-xl text-moon-200">
                Luna's Galaxy
              </span>
            </Link>
            
            {/* Stats - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-space-700/50 px-3 py-1.5 rounded-full">
                <Flame className="w-4 h-4 text-star-400" />
                <span className="text-sm font-medium">{user.streak}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-space-700/50 px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 text-moon-300" />
                <span className="text-sm font-medium">Lv.{user.level}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-space-700/50 px-3 py-1.5 rounded-full">
                <Coins className="w-4 h-4 text-star-300" />
                <span className="text-sm font-medium">{user.coins}</span>
              </div>
              <ThemeSwitcher />
            </div>
            
            {/* Mobile: Theme + Menu */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeSwitcher />
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-space-700 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-moon-500/20 text-moon-200 border border-moon-500/30' 
                      : 'text-gray-400 hover:bg-space-700/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.path === '/advisor' && (
                    <span className="ml-auto text-xs bg-moon-500/20 text-moon-300 px-2 py-0.5 rounded-full">
                      AI
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
          
          {/* XP Progress */}
          <div className="mt-8 p-4 bg-space-800 rounded-xl border border-space-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Level {user.level}</span>
              <span className="text-sm text-moon-300">{user.xp}/{user.totalXp} XP</span>
            </div>
            <div className="w-full bg-space-700 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-moon-400 to-moon-300 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${(user.xp / user.totalXp) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {user.totalXp - user.xp} XP to next level
            </p>
          </div>
        </aside>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-space-900/95 backdrop-blur-sm pt-16">
            <nav className="p-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-moon-500/20 text-moon-200' 
                        : 'text-gray-400 hover:bg-space-700/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
        
        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}