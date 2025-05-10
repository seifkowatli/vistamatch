'use client'
import { useState, useRef, useEffect } from 'react'

type Msg = { role: 'user' | 'bot'; content: string }

type Persona = {
  id: string
  name: string
  modelIdentity: string
  usageHistory: string
  ownershipStyle: string
  serviceBehavior: string
  emotionalTone: string
  visualVibe: string
  interiorEnergy: string
  notableMemories: string[]
  drivingFeel: string
  voice: string
}

export function ChatBox({
  persona,
}: {
  persona: Persona
}) {
  const [history, setHistory] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  const send = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user' as const, content: input }
    setHistory(h => [...h, userMsg])
    setInput('')

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, message: input, persona }),
    })
    const { reply } = await res.json()
    setHistory(h => [...h, { role: 'bot', content: reply }])
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {history.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[70%] px-4 py-2 rounded-lg
                ${m.role === 'user'
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'}
              `}
            >
              {m.content}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex">
        <input
          className="flex-1 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Type your message…"
        />
        <button
          onClick={send}
          className="ml-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          Send
        </button>
      </div>
    </div>
  )
}
