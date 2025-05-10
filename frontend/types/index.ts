export interface CustomerPersona {
  id: string
  lifestyleVibe: string
  emotionalDrivers: string[]
  dailyRoutine: string
  weekendPersonality: string
  socialExpression: string
  preferredCarTraits: string[]
  ownershipStyle: string
  purchaseConcerns: string[]
  decisionBehavior: string
  brandRelationship: string
  personaType: string
  description: string
  avatar?: string
  socialLinks?: {
    instagram?: string
    linkedin?: string
  }
}

export interface QuizResults {
  weekendVibe: string
  aesthetic: string
  decisionStyle: number
  influences: string
  carValues: string[]
  instagramLink?: string
  linkedinLink?: string
}

export interface CarPersona {
  id: string
  model: string
  year: number
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
  matchScore: number
  matchExplanation: string
  image: string
  color: string
}

export interface ChatMessage {
  id: string
  role: "user" | "car" | "sales"
  content: string
  timestamp: Date
}

export interface QuizStep {
  id: string
  question: string
  type: "multiple-choice" | "image-choice" | "slider" | "ranked-list"
  options?: {
    id: string
    label: string
    value: string
    image?: string
  }[]
  sliderConfig?: {
    min: number
    max: number
    step: number
    leftLabel: string
    rightLabel: string
  }
}
