import { Lock } from 'lucide-react'

export default function AchievementBadge({ achievement }) {
  return (
    <div className={`relative group ${!achievement.unlocked ? 'opacity-50' : ''}`}>
      <div className={`
        w-16 h-16 rounded-2xl flex items-center justify-center text-2xl
        ${achievement.unlocked 
          ? 'bg-gradient-to-br from-moon-500/20 to-star-400/20 border-2 border-moon-500/40' 
          : 'bg-space-700 border-2 border-space-600'
        }
        transition-all duration-300 group-hover:scale-105
      `}>
        {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6 text-gray-500" />}
      </div>
      
      <div className="absolute -bottom-1 -right-1">
        {achievement.unlocked && (
          <div className="w-5 h-5 bg-growth rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        )}
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        <div className="bg-space-700 text-white text-xs rounded-lg py-2 px-3 text-center border border-space-600 shadow-xl">
          <p className="font-semibold">{achievement.name}</p>
          <p className="text-gray-400 mt-0.5">{achievement.description}</p>
          {achievement.date && (
            <p className="text-moon-300 mt-1 text-[10px]">
              Unlocked {new Date(achievement.date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}