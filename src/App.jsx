import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Goals from './pages/Goals'
import AIAdvisor from './pages/AIAdvisor'
import Profile from './pages/Profile'

function AppContent() {
  const { state } = useApp()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
  }, [state.theme])

  return (
    <Routes>
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      <Route path="/expenses" element={<Layout><Expenses /></Layout>} />
      <Route path="/goals" element={<Layout><Goals /></Layout>} />
      <Route path="/advisor" element={<Layout><AIAdvisor /></Layout>} />
      <Route path="/profile" element={<Layout><Profile /></Layout>} />
    </Routes>
  )
}

function App() {
  return <AppContent />
}

export default App