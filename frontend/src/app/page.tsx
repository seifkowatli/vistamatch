'use client'
import { useState } from 'react'

export default function Page() {
  const [carsJson, setCarsJson] = useState('[]')
  const [customerJson, setCustomerJson] = useState('{}')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleMatch = async () => {
    setLoading(true)
    setResult('')

    // parse user input
    let cars, customer
    try {
      cars = JSON.parse(carsJson)
      customer = JSON.parse(customerJson)
    } catch {
      setResult('Error: Invalid JSON')
      setLoading(false)
      return
    }

    // call your OpenAI-backed API
    const res = await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cars, customer })
    })

    // unwrap the doubly-encoded JSON string
    const raw = await res.text()
    let data
    try {
      data = JSON.parse(raw)
      if (typeof data === 'string') {
        data = JSON.parse(data)
      }
    } catch (e) {
      console.error('Invalid JSON from API:', e)
      data = raw
    }

    // log the real object/array
    console.log('result is', data)

    // pretty-print in your <pre>
    setResult(typeof data === 'object'
      ? JSON.stringify(data, null, 2)
      : String(data)
    )
    setLoading(false)
  }

  return (
    <div className="p-6 grid grid-cols-2 gap-4">
      <textarea
        className="w-full h-64 border p-2 rounded"
        value={carsJson}
        onChange={e => setCarsJson(e.target.value)}
        placeholder="Paste car identities array (JSON)"
      />
      <textarea
        className="w-full h-64 border p-2 rounded"
        value={customerJson}
        onChange={e => setCustomerJson(e.target.value)}
        placeholder="Paste customer identity object (JSON)"
      />
      <button
        className="col-span-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={handleMatch}
        disabled={loading}
      >
        {loading ? 'Finding…' : 'Find Best match'}
      </button>
      {result && (
        <pre className="col-span-2 bg-gray-100 dark:bg-gray-800 p-4 rounded shadow font-mono text-sm whitespace-pre-wrap">
          {result}
        </pre>
      )}
    </div>
  )
}
