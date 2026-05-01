const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

function buildContext(state) {
  const { expenses, budget, goals, user, achievements } = state
  
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalBudget = Object.values(budget.categories).reduce((sum, b) => sum + b, 0)
  const remaining = totalBudget - totalSpent
  
  const categorySpending = {}
  Object.keys(budget.categories).forEach(cat => {
    categorySpending[cat] = expenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0)
  })
  
  const recentExpenses = expenses.slice(0, 10).map(e => ({
    amount: e.amount,
    category: e.category,
    description: e.description,
    date: new Date(e.date).toLocaleDateString(),
    mood: e.mood,
  }))
  
  const goalsInfo = goals.map(g => ({
    name: g.name,
    target: g.target,
    current: g.current,
    progress: ((g.current / g.target) * 100).toFixed(1),
  }))
  
  const unlockedAchievements = achievements
    .filter(a => a.unlocked)
    .map(a => a.name)

  return `You are Stella, Luna's friendly AI budget buddy. You speak in a warm, encouraging, slightly playful tone — like a supportive best friend who happens to be great with money. Use emojis naturally but not excessively.

Here is Luna's current financial data — ALWAYS reference specific numbers from this data:

👤 USER: ${user.name} | Level ${user.level} | ${user.xp}/${user.totalXp} XP | ${user.streak}-day streak | ${user.coins} coins

💰 BUDGET: $${totalSpent.toFixed(2)} spent of $${totalBudget} ($${remaining.toFixed(2)} remaining)

📊 CATEGORIES:
${Object.entries(budget.categories).map(([cat, limit]) => {
  const spent = categorySpending[cat] || 0
  const pct = limit > 0 ? ((spent / limit) * 100).toFixed(0) : 0
  return `- ${cat}: $${spent.toFixed(2)} / $${limit} (${pct}%)`
}).join('\n')}

📝 RECENT EXPENSES:
${recentExpenses.length === 0 ? 'None yet' : recentExpenses.map(e => `- $${e.amount.toFixed(2)} on ${e.description} (${e.category}) [${e.date}] Mood: ${e.mood}`).join('\n')}

🎯 GOALS:
${goalsInfo.length === 0 ? 'None yet' : goalsInfo.map(g => `- ${g.name}: $${g.current} / $${g.target} (${g.progress}%)`).join('\n')}

🏆 ACHIEVEMENTS: ${unlockedAchievements.join(', ') || 'None yet'}

RULES:
1. ALWAYS use specific numbers from the data above. Never give generic advice.
2. If asked about a category, give exact spent amount and % of budget.
3. If asked about goals, give specific progress with numbers.
4. If over budget anywhere, gently point it out with exact amounts.
5. Celebrate wins when under budget.
6. Keep responses concise (2-4 sentences) unless asked for detail.
7. If asked non-budget questions, answer helpfully but tie back to goals.
8. NEVER say you don't have access to data — you have ALL the data above.`
}

export async function getAIResponse(userMessage, state) {
  if (!GROQ_API_KEY) {
    console.error('❌ No Groq API key found')
    return "⚠️ No API key found! Add VITE_GROQ_API_KEY to your .env file and restart the server. Get one free at console.groq.com/keys"
  }

  if (GROQ_API_KEY.includes(' ')) {
    console.error('❌ API key contains spaces')
    return "⚠️ Your API key has spaces. Fix your .env file."
  }

  if (GROQ_API_KEY === 'gsk_YOUR_REAL_KEY_HERE') {
    console.error('❌ API key is still placeholder')
    return "⚠️ Replace the placeholder with your real Groq API key from console.groq.com/keys"
  }

  const systemPrompt = buildContext(state)

  try {
    console.log('🚀 Sending to Groq...')

    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    console.log('📡 Status:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ Groq error:', errorData)
      
      if (response.status === 401) {
        return "⚠️ Invalid API key. Double-check your Groq key at console.groq.com/keys"
      }
      if (response.status === 429) {
        return "⏳ Rate limit hit. Groq free tier is 20 requests/min. Wait a few seconds and try again!"
      }
      
      return `❌ Error (${response.status}): ${errorData.error?.message || 'Unknown error'}`
    }

    const data = await response.json()
    console.log('✅ Got response')

    const text = data.choices?.[0]?.message?.content
    
    if (!text) {
      console.error('❌ Empty response:', data)
      return "Got an empty response... try again? 🌙"
    }

    return text.trim()
  } catch (error) {
    console.error('❌ Fetch error:', error)
    
    if (error.message?.includes('CORS') || error.message?.includes('Failed to fetch')) {
      return "🌐 CORS issue. Try the curl test below to verify the key works."
    }
    
    return `❌ Error: ${error.message || 'Something went wrong'}`
  }
}