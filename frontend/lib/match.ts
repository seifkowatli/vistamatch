import type { CarPersona } from "@/types"

export async function fetchCarMatchesFromStrapi(): Promise<CarPersona[]> {
  let cars: CarPersona[] = []
  let customer: any = null

  // Step 1: Fallback Cars First
  try {
    const fallbackRes = await fetch("/api/cars")
    if (!fallbackRes.ok) throw new Error("Fallback car API failed")
    cars = await fallbackRes.json()
    localStorage.setItem("carMatches", JSON.stringify(cars))
    console.info("✅ Stored fallback car matches")
  } catch (fallbackErr) {
    console.error("❌ Failed to load fallback car data:", fallbackErr)
    throw new Error("No car data available")
  }

  // Step 2: Try to replace cars with Strapi data
  try {
    const carRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/car-personas`)
    const carData = await carRes.json()
    const strapiCars = carData.data.map((entry: any) => ({
      id: entry.id,
      ...entry,
    }))
    cars = strapiCars
    localStorage.setItem("carMatches", JSON.stringify(strapiCars))
    console.info("✅ Replaced with Strapi car matches")
  } catch (strapiCarErr) {
    console.warn("⚠️ Strapi car fetch failed. Using fallback cars.")
  }

  // Step 3: Fallback Customer First (static fallback object)
  customer = {
    id: "fallback_1",
    name: "Default Customer",
    lifestyleVibe: "Tech-savvy",
    emotionalDrivers: "Freedom",
    dailyRoutine: "Remote worker",
    weekendPersonality: "Cafe-hopper",
    socialExpression: "Photography",
    preferredCarTraits: "Quiet cabin",
    ownershipStyle: "Long-term keeper",
    purchaseConcerns: "Performance",
    decisionBehavior: "Analytical",
    brandRelationship: "New to luxury"
  }
  localStorage.setItem("customerPersona", JSON.stringify(customer))
  console.info("✅ Stored fallback customer persona")

  // Step 4: Try replacing customer with Strapi data
  try {
    const custRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/customer-personas`)
    const custData = await custRes.json()
    const strapiCustomer = custData.data?.[0]
    if (strapiCustomer) {
      customer = strapiCustomer
      localStorage.setItem("customerPersona", JSON.stringify(strapiCustomer))
      console.info("✅ Replaced with Strapi customer persona")
    } else {
      console.warn("⚠️ Strapi returned no customer records. Keeping fallback.")
    }
  } catch (err) {
    console.warn("⚠️ Strapi customer fetch failed. Using fallback.", err)
  }

  // Step 5: Prepare cars for OpenAI
  const carsForAI = cars.map(({ model, modelIdentity, ...rest }: any) => ({
    model: modelIdentity,
    ...rest,
  }))

  // Step 6: Call OpenAI match API
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
    console.error("❌ Failed to parse OpenAI match result:", err, text)
    throw new Error("Match result JSON error")
  }

  const matchedCars = matchResults
    .map((match: any) => {
      const car = cars.find((c: { modelIdentity: string }) => c.modelIdentity === match.model)
      if (!car) return null
      return {
        ...car,
        matchScore: match.totalScore,
        matchExplanation: match.verdict,
      }
    })
    .filter(Boolean)

  localStorage.setItem("carMatches", JSON.stringify(matchedCars))
  return matchedCars
}
