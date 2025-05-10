"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { toast } from "react-hot-toast"
import type { TestDriveRequest } from "@/types/sales"
import type { CustomerPersona, ChatMessage } from "@/types"
import { sendChatMessage } from "@/lib/api"
import PersonaAvatar from "@/components/PersonaAvatar"

// Define persona attribute options
const PURCHASE_CONCERNS_OPTIONS = ["Price sensitivity", "Maintenance", "Resale value", "Performance"]
const DECISION_BEHAVIOR_OPTIONS = ["Impulsive", "Analytical", "Emotional", "Peer-influenced"]
const BRAND_RELATIONSHIP_OPTIONS = ["Lifelong Mercedes fan", "New to luxury", "AMG enthusiast", "Tech enthusiast"]

// Define common questions
const COMMON_QUESTIONS = [
  "What do you think about the performance?",
  "Do you think this car suits your lifestyle?",
  "What features are most important to you?",
  "How do you feel about the price?",
  "What concerns do you have about this vehicle?",
  "How does this compare to other cars you've considered?",
  "What's your timeline for making a decision?",
  "Would you prefer to lease or purchase?",
  "How important is the warranty to you?",
  "What would make this the perfect car for you?",
]

export default function ChatSimulationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [request, setRequest] = useState<TestDriveRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [question, setQuestion] = useState("")
  const [selectedQuestion, setSelectedQuestion] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [willingnessToBuy, setWillingnessToBuy] = useState(50) // Start at neutral 50%
  const [configExpanded, setConfigExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Persona configuration state
  const [modifiedPersona, setModifiedPersona] = useState<CustomerPersona | null>(null)
  const [purchaseConcern, setPurchaseConcern] = useState<string>("")
  const [decisionBehavior, setDecisionBehavior] = useState<string>("")
  const [brandRelationship, setBrandRelationship] = useState<string>("")

  useEffect(() => {
    async function fetchRequest() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/sales/requests/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch request")
        }

        const data = await response.json()
        setRequest(data)

        // Initialize persona configuration
        if (data.customerPersona) {
          const persona = data.customerPersona

          // Set initial values from the persona
          setPurchaseConcern(persona.purchaseConcerns?.[0] || PURCHASE_CONCERNS_OPTIONS[0])
          setDecisionBehavior(persona.decisionBehavior || DECISION_BEHAVIOR_OPTIONS[0])
          setBrandRelationship(persona.brandRelationship || BRAND_RELATIONSHIP_OPTIONS[0])

          // Create a copy of the persona for modifications
          setModifiedPersona(JSON.parse(JSON.stringify(persona)))

          // Initialize with a welcome message
          setMessages([
            {
              id: "1",
              role: "sales",
              content: `Hello! I'm interested in the ${data.carPersona.year} ${data.carPersona.model}. I'm excited to learn more about it.`,
              timestamp: new Date(),
            },
          ])
        }
      } catch (error) {
        console.error("Error fetching request:", error)
        toast.error("Failed to load request data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequest()
  }, [params.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendQuestion = async () => {
    if (!question.trim() && !selectedQuestion.trim()) return
    if (!modifiedPersona || !request) return

    const questionText = selectedQuestion || question

    // Add salesperson question to messages
    const salesMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: questionText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, salesMessage])
    setQuestion("")
    setSelectedQuestion("")
    setIsTyping(true)

    try {
      // Send message to API
      const response = await sendChatMessage("sales", modifiedPersona, questionText)

      // Add response message
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "sales",
        content: response.reply,
        timestamp: new Date(),
      }

      // Delay to simulate typing
      setTimeout(() => {
        setMessages((prev) => [...prev, responseMessage])
        setIsTyping(false)

        // Update willingness to buy score based on response content
        updateWillingnessToBuy(response.reply)
      }, 1500)
    } catch (error) {
      console.error("Error sending message:", error)
      setIsTyping(false)
      toast.error("Failed to generate persona response")
    }
  }

  const updateWillingnessToBuy = (message: string) => {
    const lowerCaseMessage = message.toLowerCase()

    // Positive signals
    const positiveSignals = [
      "sounds like a great deal",
      "i'm interested",
      "tell me more",
      "that's impressive",
      "i like that",
      "when can i",
      "sounds good",
      "perfect",
      "excellent",
      "i'd like to",
      "i want to",
      "definitely",
    ]

    // Hesitant signals
    const hesitantSignals = [
      "i'm not sure",
      "need more time",
      "think about it",
      "not convinced",
      "maybe later",
      "hesitant",
    ]

    // Negative signals
    const negativeSignals = [
      "too expensive",
      "too much",
      "can't afford",
      "other options",
      "compare with",
      "not ready",
      "not interested",
      "don't like",
    ]

    // Check for positive signals
    for (const signal of positiveSignals) {
      if (lowerCaseMessage.includes(signal)) {
        setWillingnessToBuy((prev) => Math.min(100, prev + 10))
        return
      }
    }

    // Check for hesitant signals
    for (const signal of hesitantSignals) {
      if (lowerCaseMessage.includes(signal)) {
        setWillingnessToBuy((prev) => Math.max(0, prev - 5))
        return
      }
    }

    // Check for negative signals
    for (const signal of negativeSignals) {
      if (lowerCaseMessage.includes(signal)) {
        setWillingnessToBuy((prev) => Math.max(0, prev - 20))
        return
      }
    }

    // Small positive bias for continued conversation
    setWillingnessToBuy((prev) => Math.min(100, prev + 2))
  }

  const getWillingnessLabel = () => {
    if (willingnessToBuy >= 80) return "High Intent"
    if (willingnessToBuy >= 50) return "Moderate Interest"
    if (willingnessToBuy >= 20) return "Low Intent"
    return "Disengaged"
  }

  const getWillingnessEmoji = () => {
    if (willingnessToBuy >= 80) return "🟢"
    if (willingnessToBuy >= 50) return "🟡"
    return "🔴"
  }

  const getWillingnessColor = () => {
    if (willingnessToBuy >= 80) return "bg-green-500"
    if (willingnessToBuy >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  const handleUpdatePersona = () => {
    if (!modifiedPersona) return

    // Update the modified persona with the selected values
    const updatedPersona = {
      ...modifiedPersona,
      purchaseConcerns: [purchaseConcern],
      decisionBehavior: decisionBehavior,
      brandRelationship: brandRelationship,
    }

    setModifiedPersona(updatedPersona)
    toast.success("Persona context updated")
  }

  const handleRestartConversation = () => {
    if (!request) return

    // Clear messages and reset willingness to buy
    setMessages([
      {
        id: "1",
        role: "sales",
        content: `Hello! I'm interested in the ${request.carPersona.year} ${request.carPersona.model}. I'm excited to learn more about it.`,
        timestamp: new Date(),
      },
    ])
    setWillingnessToBuy(50)
    toast.success("Conversation restarted with current persona traits")
  }

  const handleMarkAsReadyToBuy = async () => {
    if (!request) return

    try {
      const response = await fetch(`/api/sales/requests/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "sold" }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      toast.success("Lead marked as Ready to Buy")
      router.push(`/sales/${params.id}`)
    } catch (error) {
      console.error("Error updating lead status:", error)
      toast.error("Failed to update lead status")
    }
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <h2 className="text-2xl font-playfair mb-4">Request not found</h2>
          <button onClick={() => router.push("/sales")} className="glow-button">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <header className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/sales/${params.id}`)}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span className="ml-2">Back to Lead</span>
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-lg font-medium">Persona Simulation: {request.customerPersona.personaType}</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1">
            <span className="text-sm text-gray-400">Match:</span>
            <span className="text-sm font-medium text-blue-400">{request.carPersona.matchScore}%</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)]">
        {/* Left Panel - AI Chat Log */}
        <div className="w-full md:w-1/2 border-r border-gray-800 flex flex-col h-full">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                <PersonaAvatar persona={request.customerPersona} type="customer" size="sm" />
              </div>
              <div>
                <h3 className="font-medium">{request.customerPersona.personaType}</h3>
                <div className="flex gap-2 mt-1">
                  {request.customerPersona.emotionalDrivers.slice(0, 2).map((driver, index) => (
                    <span key={index} className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 text-xs">
                      {driver}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Only show user messages as questions */}
                  {message.role === "user" && index > 0 && (
                    <div className="flex justify-center my-4">
                      <div className="px-3 py-1 rounded-full bg-gray-800/50 text-gray-400 text-xs">
                        You asked: {message.content}
                      </div>
                    </div>
                  )}

                  {/* Only show sales messages as persona replies */}
                  {message.role === "sales" && (
                    <div className="flex">
                      <div className="flex flex-col max-w-[90%]">
                        <div className="p-3 rounded-lg bg-gray-800 text-white rounded-tl-none">
                          <p>{message.content}</p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{formatTime(message.timestamp)}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex">
                <div className="bg-gray-800 p-3 rounded-lg rounded-tl-none">
                  <div className="flex space-x-1">
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    >
                      •
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                    >
                      •
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                    >
                      •
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Right Panel - Sales Strategy Panel */}
        <div className="w-full md:w-1/2 flex flex-col h-full">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Sales Strategy Panel</h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-400">Simulation Active</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center">
                <Image
                  src="/images/mercedes-logo.png"
                  alt="Mercedes Logo"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div>
                <h4 className="font-medium">
                  {request.carPersona.year} {request.carPersona.model}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">Match Score:</span>
                  <span className="text-xs font-medium text-blue-400">{request.carPersona.matchScore}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            {/* Persona Configuration */}
            <div className="mb-6 bg-gray-900 rounded-lg border border-gray-800">
              <button
                onClick={() => setConfigExpanded(!configExpanded)}
                className="w-full p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span className="font-medium">🔧 Persona Configuration</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`text-gray-400 transition-transform ${configExpanded ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {configExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4 overflow-hidden"
                >
                  <div className="grid grid-cols-1 gap-4">
                    {/* Purchase Concerns */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Purchase Concerns</label>
                      <div className="flex flex-wrap gap-2">
                        {PURCHASE_CONCERNS_OPTIONS.map((option) => (
                          <button
                            key={option}
                            onClick={() => setPurchaseConcern(option)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                              purchaseConcern === option
                                ? "bg-blue-600 text-white"
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Decision Behavior */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Decision Behavior</label>
                      <div className="flex flex-wrap gap-2">
                        {DECISION_BEHAVIOR_OPTIONS.map((option) => (
                          <button
                            key={option}
                            onClick={() => setDecisionBehavior(option)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                              decisionBehavior === option
                                ? "bg-blue-600 text-white"
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Brand Relationship */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Brand Relationship</label>
                      <div className="flex flex-wrap gap-2">
                        {BRAND_RELATIONSHIP_OPTIONS.map((option) => (
                          <button
                            key={option}
                            onClick={() => setBrandRelationship(option)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                              brandRelationship === option
                                ? "bg-blue-600 text-white"
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleUpdatePersona}
                      className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Update Persona Context
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Question Form */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Ask the Persona a Question</label>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Type a custom question..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isTyping}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Or select a common question:</label>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                    {COMMON_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => setSelectedQuestion(q)}
                        className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedQuestion === q
                            ? "bg-blue-600/30 border border-blue-600/50 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-transparent"
                        }`}
                        disabled={isTyping}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSendQuestion}
                  disabled={(!question.trim() && !selectedQuestion.trim()) || isTyping}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTyping ? "Persona is responding..." : "Send Question"}
                </button>
              </div>
            </div>

            {/* Willingness to Buy Score */}
            <div className="mb-6 bg-gray-900 rounded-lg border border-gray-800 p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Willingness to Buy</h4>
                <div className="flex items-center">
                  <span
                    className={`text-sm font-medium ${
                      willingnessToBuy >= 80
                        ? "text-green-400"
                        : willingnessToBuy >= 50
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {getWillingnessEmoji()} {getWillingnessLabel()}
                  </span>
                  <span className="ml-2 text-sm font-bold">{willingnessToBuy}%</span>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${getWillingnessColor()}`}
                  initial={{ width: "50%" }}
                  animate={{ width: `${willingnessToBuy}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Conversation Lifecycle Controls */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleMarkAsReadyToBuy}
                disabled={willingnessToBuy < 70}
                className="py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-lg">🟢</span>
                Mark as Ready to Buy
                {willingnessToBuy < 70 && <span className="text-xs ml-2">(Requires 70%+ willingness)</span>}
              </button>

              <button
                onClick={handleRestartConversation}
                className="py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-lg">🔄</span>
                Restart Conversation
              </button>

              <button
                onClick={() => router.push(`/sales/${params.id}`)}
                className="py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-lg">🔙</span>
                Back to Lead Overview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
