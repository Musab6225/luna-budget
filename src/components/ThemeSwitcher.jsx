import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { Palette } from 'lucide-react'

const THEMES = [
  { id: 'space', name: 'Galaxy', icon: '🌌', color: '#805ad5' },
  { id: 'blossom', name: 'Sakura', icon: '🌸', color: '#e84393' },
  { id: 'ocean', name: 'Ocean', icon: '🌊', color: '#00bcd4' },
]

export default function ThemeSwitcher() {
  const { state, dispatch } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentTheme = THEMES.find(t => t.id === state.theme) || THEMES[0]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-space-700/50 hover:bg-space-700 border border-space-700 transition-all"
        title="Change theme"
      >
        <Palette className="w-4 h-4" style={{ color: currentTheme.color }} />
        <span className="text-sm hidden sm:inline">{currentTheme.icon}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-space-800 border border-space-700 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-2">
            <p className="text-xs text-gray-500 px-3 py-2 uppercase tracking-wider font-medium">
              Choose Theme
            </p>
            {THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => {
                  dispatch({ type: 'SET_THEME', payload: theme.id })
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  state.theme === theme.id
                    ? 'bg-moon-500/20 border border-moon-500/30'
                    : 'hover:bg-space-700'
                }`}
              >
                <span className="text-xl">{theme.icon}</span>
                <div className="text-left">
                  <p className="text-sm font-medium">{theme.name}</p>
                  <div 
                    className="w-8 h-1 rounded-full mt-1"
                    style={{ backgroundColor: theme.color }}
                  />
                </div>
                {state.theme === theme.id && (
                  <span className="ml-auto text-moon-300 text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}