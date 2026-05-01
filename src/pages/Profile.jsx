import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { formatCurrency } from '../utils/helpers'
import { 
  User, 
  Settings, 
  Trophy, 
  Flame, 
  Star, 
  Coins, 
  Calendar,
  TrendingUp,
  Award,
  Moon
} from 'lucide-react'

export default function Profile() {
  const { state, dispatch } = useApp()
  const [editMode, setEditMode] = useState(false)
  const [editedName, setEditedName] = useState(state.user.name)
  
  const { user, achievements, expenses, budget } = state
  
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalBudget = Object.values(budget.categories).reduce((sum, b) => sum + b, 0)
  const unlockedCount = achievements.filter(a => a.unlocked).length
  
  const handleSaveName = () => {
    dispatch({ type: 'UPDATE_USER', payload: { name: editedName } })
    setEditMode(false)
  }
  
  const stats = [
    { label: 'Total Spent', value: formatCurrency(totalSpent), icon: <TrendingUp className="w-5 h-5" />, color: 'text-moon-300' },
    { label: 'Monthly Budget', value: formatCurrency(totalBudget), icon: <Coins className="w-5 h-5" />, color: 'text-star-300' },
    { label: 'Current Streak', value: `${user.streak} days`, icon: <Flame className="w-5 h-5" />, color: 'text-warning' },
    { label: 'Level', value: user.level, icon: <Star className="w-5 h-5" />, color: 'text-moon-300' },
  ]
  
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-display text-3xl font-bold">Profile</h1>
      
      {/* Profile Header */}
      <Card className="!p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-moon-500/20 to-star-400/20 rounded-2xl flex items-center justify-center border-2 border-moon-500/30">
            <Moon className="w-10 h-10 text-moon-300" />
          </div>
          <div className="flex-1">
            {editMode ? (
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="bg-space-900 border border-space-600 rounded-xl py-2 px-3 text-xl font-bold focus:outline-none focus:border-moon-400"
                />
                <Button size="sm" onClick={handleSaveName}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => { setEditMode(false); setEditedName(user.name) }}>Cancel</Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <button onClick={() => setEditMode(true)} className="p-1 hover:bg-space-700 rounded-lg">
                  <Settings className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="moon">Level {user.level}</Badge>
              <Badge variant="success">{user.coins} Coins</Badge>
              <Badge variant="warning">{user.streak} Day Streak</Badge>
            </div>
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Member since {new Date(user.joinedDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="!p-4">
            <div className="flex items-center gap-3">
              <div className={`${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* XP Progress */}
      <Card title="Experience" icon="⭐">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">Level {user.level}</span>
          <span className="text-sm font-medium text-moon-300">{user.xp}/{user.totalXp} XP</span>
        </div>
        <div className="w-full bg-space-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-moon-400 to-star-400 h-3 rounded-full transition-all"
            style={{ width: `${(user.xp / user.totalXp) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {user.totalXp - user.xp} XP needed for Level {user.level + 1}
        </p>
      </Card>
      
      {/* Achievements */}
      <Card title="Achievements" icon={<Trophy className="w-5 h-5 text-star-400" />}>
        <div className="space-y-3">
          {achievements.map(achievement => (
            <div 
              key={achievement.id}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                achievement.unlocked ? 'bg-space-700/50' : 'opacity-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                achievement.unlocked 
                  ? 'bg-gradient-to-br from-moon-500/20 to-star-400/20' 
                  : 'bg-space-700'
              }`}>
                {achievement.unlocked ? achievement.icon : <Award className="w-6 h-6 text-gray-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{achievement.name}</h4>
                  {achievement.unlocked && <Badge variant="success" size="sm">Unlocked</Badge>}
                </div>
                <p className="text-sm text-gray-400">{achievement.description}</p>
                {achievement.date && (
                  <p className="text-xs text-moon-300 mt-0.5">
                    Unlocked {new Date(achievement.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          {unlockedCount}/{achievements.length} achievements unlocked
        </p>
      </Card>
      
      {/* Danger Zone */}
      <Card className="border-danger/30">
        <h3 className="text-danger font-medium mb-3">Danger Zone</h3>
        <Button 
          variant="danger" 
          onClick={() => {
            if (confirm('Are you sure? This will reset ALL your data!')) {
              localStorage.removeItem('luna-budget-data')
              window.location.reload()
            }
          }}
        >
          Reset All Data
        </Button>
      </Card>
    </div>
  )
}