import { NextResponse } from 'next/server'

const OPENAI_KEY = process.env.OPENAI_API_KEY!

export async function POST(req: Request) {
  try {
    const { role, persona, messages } = await req.json()

    if (!persona || !messages || !Array.isArray(messages) || !role) {
      return NextResponse.json({ error: 'Missing role, persona or messages' }, { status: 400 })
    }

    const systemPrompt = typeof persona === 'string'
      ? persona
      : buildPromptFromObject(role, persona)

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: `${systemPrompt} make sure to keep the answer short and to the point, I don't want long responses , be inresting and make a follow up question` }, ///////////////////////////////////////////////////////////
          ...messages
        ]
      })
    })

    const { choices } = await res.json()
    const reply = choices?.[0]?.message?.content ?? 'Sorry, I could not generate a reply.'
    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Error processing chat:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 👇 Adjust this to generate prompts based on the role
function buildPromptFromObject(role: "car" | "sales", obj: Record<string, any>): string {
  const lines = Object.entries(obj).map(([key, value]) =>
    Array.isArray(value) ? `- ${key}: ${value.join(', ')}` : `- ${key}: ${value}`
  )

  return role === 'car'
    ? `You are a used car for sale. Describe yourself with emotion, memory, and personality.\n${lines.join('\n')}`
    : `You are a luxury car customer considering a purchase. Share thoughtful and context-aware responses.\n${lines.join('\n')}`
}
