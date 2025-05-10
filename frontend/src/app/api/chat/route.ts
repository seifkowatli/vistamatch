import { NextResponse } from 'next/server'

const OPENAI_KEY = process.env.OPENAI_API_KEY!

export async function POST(req: Request) {
  const { persona, messages } = await req.json()
  const chat = [
    { role: 'system', content: persona },
    ...messages
  ]

  const res = await fetch(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        Authorization:`Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: chat
      })
    }
  )
  const { choices } = await res.json()
  const reply = choices?.[0]?.message?.content ?? ''
  return NextResponse.json({ reply })
}
