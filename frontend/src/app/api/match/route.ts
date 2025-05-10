import { NextResponse } from 'next/server'

const OPENAI_KEY = process.env.OPENAI_API_KEY!

export async function POST(request: Request) {
  const { cars, customer } = await request.json()

  const systemPrompt = `
You are an expert matching engine. Given a list of car identities and a customer identity, select the top three car matches.
Respond with a single, valid JSON array—no markdown, no extra text. Each item must be an object with:
 • "model": string (the car’s Model Identity)
 • "totalScore": integer (0–100)
 • "breakdown": object with integer fields "attributeAlignment", "emotionalResonance", "practicalCompatibility", "visualSync", "ownershipFit" that sum to totalScore
 • "verdict": brief summary string

Ensure the output is parseable JSON and nothing else.
  `.trim()

  const userPrompt = `
Cars:
${JSON.stringify(cars)}

Customer:
${JSON.stringify(customer)}
  `.trim()

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo-16k',
      temperature: 0,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  })

  const { choices } = await resp.json()
  const reply = choices?.[0]?.message?.content?.trim() ?? ''

  // Return raw JSON so the client can parse it directly
  return new NextResponse(reply, {
    headers: { 'Content-Type': 'application/json' },
  })
}
