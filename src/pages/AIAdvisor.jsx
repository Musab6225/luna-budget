import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { getAIResponse } from '../services/aiService'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Send, Sparkles, User, Bot, Lightbulb, TrendingDown, PiggyBank, Target, Loader2 } from 'lucide-react'

const QUICK_PROMPTS = [
  { icon: <TrendingDown className="w-4 h-4" />, text: 'Am I over budget?' },
  { icon: <PiggyBank className="w-4 h-4" />, text: 'How can I save more?' },
  { icon: <Target className="w-4 h-4" />, text: 'How are my goals?' },
  { icon: <Lightbulb className="w-4 h-4" />, text: 'Give me a money tip' },
]

export default function AIAdvisor() {
  const { state } = useApp()
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hey Luna! 🌟 I'm Stella, your AI budget buddy! I can see all your spending data, goals, and progress. Ask me anything — like "How much have I spent on food?" or "When will I reach my laptop goal?"`,
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  const handleSend = async (text = input) => {
    if (!text.trim()) return
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    
    try {
      // Call the REAL AI!
      const aiResponse = await getAIResponse(text, state)
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Oops! Something went wrong with my cosmic connection. Try asking again! 🌌",
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-moon-500/20 to-star-400/20 rounded-2xl flex items-center justify-center border border-moon-500/30">
          <Sparkles className="w-6 h-6 text-moon-300" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Stella</h1>
          <p className="text-sm text-gray-400">Powered by Groq AI (Llama 3.1)</p>
        </div>
      </div>
      
      {/* Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden !p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-moon-500/20' 
                  : 'bg-gradient-to-br from-star-400/20 to-moon-500/20'
              }`}>
                {msg.role === 'user' 
                  ? <User className="w-4 h-4 text-moon-300" />
                  : <Bot className="w-4 h-4 text-star-300" />
                }
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-moon-500/20 text-white'
                  : 'bg-space-700 text-gray-200'
              }`}>
                <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
                <p className="text-[10px] text-gray-500 mt-1.5">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-star-400/20 to-moon-500/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-star-300" />
              </div>
              <div className="bg-space-700 rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-moon-300 animate-spin" />
                <span className="text-sm text-gray-400">Stella is thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick Prompts */}
        <div className="px-4 py-2 border-t border-space-700">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt.text)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-space-700 hover:bg-space-600 rounded-lg text-xs text-gray-300 whitespace-nowrap transition-colors"
              >
                {prompt.icon}
                {prompt.text}
              </button>
            ))}
          </div>
        </div>
        
        {/* Input */}
        <div className="p-4 border-t border-space-700">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Stella anything about your budget..."
              className="flex-1 bg-space-900 border border-space-600 rounded-xl py-3 px-4 focus:outline-none focus:border-moon-400 focus:ring-1 focus:ring-moon-400 transition-colors"
            />
            <Button 
              onClick={() => handleSend()} 
              disabled={!input.trim() || isTyping}
              className="px-4"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}