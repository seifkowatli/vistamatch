import type { CarPersona } from "@/types"

export async function fetchCarMatchesFromStrapi(): Promise<CarPersona[]> {
  const carRes = await fetch("http://localhost:1337/api/car-personas")
  const carData = await carRes.json()
  const cars = carData.data.map((entry: any) => ({
    id: entry.id,
    ...entry,
  }))

  const custRes = await fetch("http://localhost:1337/api/customer-personas")
  const custData = await custRes.json()
  const customer = custData.data?.[0]

  if (!customer) throw new Error("No customer persona found")

  const carsForAI = cars.map(({ model, modelIdentity, ...rest }: any) => ({
    model: modelIdentity,
    ...rest,
  }))

  const response = await fetch("/api/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cars: carsForAI, customer }),
  })

  const text = await response.text()
  let matchResults

  try {
    matchResults = JSON.parse(text)
    if (typeof matchResults === "string") {
      matchResults = JSON.parse(matchResults)
    }
  } catch (err) {
    console.error("Failed to parse AI result:", err, text)
    throw new Error("Match result JSON error")
  }

  return matchResults.map((match: any) => {
    const car = cars.find((c: { modelIdentity: any }) => c.modelIdentity === match.model)
    if (!car) return null
    return {
      ...car,
      matchScore: match.totalScore,
      matchExplanation: match.verdict,
    }
  }).filter(Boolean)
}
