'use client'
import { useState, useRef, useEffect } from 'react'

type Message = { role: 'user' | 'assistant'; content: string }
type Character = {
  id: string
  name: string
  attributes: Record<string,string>
}

const MODES: Record<'car'|'customer',{ label:string; characters:Character[] }> = {
  car: {
    label: 'Car Mode',
    characters: [
      {
        id: 'gclass',
        name: 'G-Class',
        attributes: {
          'Model Identity': 'Adventurous',
          'Usage History': 'Off-road',
          'Ownership Style': 'Single-owner',
          'Service Behavior': 'Regularly maintained',
          'Emotional Tone': 'Wild Spirit',
          'Visual Vibe': 'Bold',
          'Interior Energy': 'Driver-focused',
          'Notable Memories': 'Long journeys',
          'Driving Feel': 'Responsive',
          'Voice': 'Bold'
        }
      },
      {
        id: 'e200',
        name: 'E-200',
        attributes: {
          'Model Identity': 'Executive',
          'Usage History': 'City-driven',
          'Ownership Style': 'Fleet-owned',
          'Service Behavior': 'Fully documented',
          'Emotional Tone': 'Loyal Companion',
          'Visual Vibe': 'Sleek',
          'Interior Energy': 'Tech-heavy',
          'Notable Memories': 'Corporate events',
          'Driving Feel': 'Smooth',
          'Voice': 'Wise'
        }
      },
      {
        id: 'c63',
        name: 'C-63 AMG',
        attributes: {
          'Model Identity': 'Sporty',
          'Usage History': 'Light use',
          'Ownership Style': 'Collector-owned',
          'Service Behavior': 'Delayed maintenance',
          'Emotional Tone': 'Youthful',
          'Visual Vibe': 'Futuristic',
          'Interior Energy': 'Minimalist',
          'Notable Memories': 'Track days',
          'Driving Feel': 'Aggressive',
          'Voice': 'Playful'
        }
      }
    ]
  },
  customer: {
    label: 'Customer Mode',
    characters: [
      {
        id: 'person1',
        name: 'Person 1',
        attributes: {
          'Lifestyle Vibe': 'Tech-savvy',
          'Emotional Drivers': 'Freedom',
          'Daily Routine': 'Remote worker',
          'Weekend Personality': 'Cafe-hopper',
          'Social Expression': 'Photography',
          'Preferred Car Traits': 'Quiet cabin',
          'Ownership Style': 'Long-term keeper',
          'Purchase Concerns': 'Performance',
          'Decision Behavior': 'Analytical',
          'Brand Relationship': 'New to luxury'
        }
      },
      {
        id: 'person2',
        name: 'Person 2',
        attributes: {
          'Lifestyle Vibe': 'Family-focused',
          'Emotional Drivers': 'Comfort',
          'Daily Routine': 'Commute-heavy',
          'Weekend Personality': 'Chill-at-home',
          'Social Expression': 'Low-profile',
          'Preferred Car Traits': 'Cargo space',
          'Ownership Style': 'Sentimental buyer',
          'Purchase Concerns': 'Resale value',
          'Decision Behavior': 'Emotional',
          'Brand Relationship': 'Lifelong Mercedes fan'
        }
      },
      {
        id: 'person3',
        name: 'Person 3',
        attributes: {
          'Lifestyle Vibe': 'Explorer',
          'Emotional Drivers': 'Sustainability',
          'Daily Routine': 'City errands',
          'Weekend Personality': 'Off-roader',
          'Social Expression': 'Travel blogging',
          'Preferred Car Traits': 'Responsive drive',
          'Ownership Style': 'Flipper',
          'Purchase Concerns': 'Maintenance',
          'Decision Behavior': 'Peer-influenced',
          'Brand Relationship': 'AMG enthusiast'
        }
      }
    ]
  }
}

export default function Page() {
  const [mode, setMode] = useState<'car'|'customer'>('car')
  const [charId, setCharId] = useState(MODES.car.characters[0].id)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const character = MODES[mode].characters.find(c => c.id === charId)!

  useEffect(() => {
    // reset history when persona changes
    setMessages([])
  }, [mode, charId])

  const buildSystemPrompt = () => {
    const lines = Object.entries(character.attributes)
      .map(([k,v]) => `• ${k}: ${v}`)
    return `You are **${character.name}** (${MODES[mode].label}).\n${lines.join('\n')}`
  }

  const handleSend = async () => {
    if (!input) return
    const userMsg = { role: 'user' as const, content: input }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        persona: buildSystemPrompt(),
        messages: next
      })
    })
    const { reply } = await res.json()
    setMessages([...next, { role:'assistant', content:reply }])
    setLoading(false)
    endRef.current?.scrollIntoView({ behavior:'smooth' })
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex gap-2 mb-4">
        <select
          value={mode}
          onChange={e => setMode(e.target.value as any)}
          className="flex-1 border px-2 py-1 rounded"
        >
          {Object.entries(MODES).map(([key,{label}])=>(
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select
          value={charId}
          onChange={e => setCharId(e.target.value)}
          className="flex-1 border px-2 py-1 rounded"
        >
          {MODES[mode].characters.map(c=>(
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col space-y-3 mb-4 h-[60vh] overflow-y-auto">
        {messages.map((m,i)=>(
          <div
            key={i}
            className={`p-2 rounded ${
              m.role==='user'
                ? 'self-end bg-blue-500 text-white'
                : 'self-start bg-gray-200 dark:bg-gray-700'
            }`}
          >{m.content}</div>
        ))}
        {loading && (
          <div className="self-start p-2 rounded bg-gray-200 dark:bg-gray-700">
            Typing…
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="flex">
        <input
          className="flex-1 border rounded-l px-3 py-2 focus:outline-none"
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==='Enter' && handleSend()}
          placeholder="Type your message…"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  )
}
