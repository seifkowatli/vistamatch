"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { sendChatMessage } from "@/lib/api"
import type { CustomerPersona, ChatMessage } from "@/types"
import { toast } from "react-hot-toast"

interface SalesChatProps {
  isOpen: boolean
  onClose: () => void
  customerPersona: CustomerPersona
  onLeadStatusChange?: (status: "sold" | "follow-up") => void
}

export default function SalesChat({ isOpen, onClose, customerPersona, onLeadStatusChange }: SalesChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [willingnessToBuy, setWillingnessToBuy] = useState(50) // Start at neutral 50%
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Initialize with a welcome message
      setMessages([
        {
          id: "1",
          role: "sales",
          content: `Hello! I'm your Mercedes-Benz sales advisor. How can I assist you with your interest in our vehicles today?`,
          timestamp: new Date(),
        },
      ])
      setWillingnessToBuy(50) // Reset willingness to buy score
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !customerPersona) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: newMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")
    setIsTyping(true)

    try {
      // Send message to API
      const response = await sendChatMessage("sales", customerPersona, newMessage)

      // Add response message
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "sales",
        content: response.reply,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, responseMessage])

      // Update willingness to buy score based on response content
      updateWillingnessToBuy(response.reply)
    } catch (error) {
      console.error("Error sending message:", error)

      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "sales",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
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

    // Negative signals
    const negativeSignals = [
      "i'm not sure",
      "too expensive",
      "need more time",
      "think about it",
      "not convinced",
      "too much",
      "can't afford",
      "other options",
      "compare with",
      "not ready",
      "maybe later",
      "hesitant",
    ]

    // Check for positive signals
    for (const signal of positiveSignals) {
      if (lowerCaseMessage.includes(signal)) {
        setWillingnessToBuy((prev) => Math.min(100, prev + 10))
        return
      }
    }

    // Check for negative signals
    for (const signal of negativeSignals) {
      if (lowerCaseMessage.includes(signal)) {
        setWillingnessToBuy((prev) => Math.max(0, prev - 15))
        return
      }
    }

    // Small positive bias for continued conversation
    setWillingnessToBuy((prev) => Math.min(100, prev + 2))
  }

  const getWillingnessLabel = () => {
    if (willingnessToBuy >= 80) return "High Intent"
    if (willingnessToBuy >= 50) return "Moderate"
    if (willingnessToBuy >= 20) return "Low"
    return "Lost Interest"
  }

  const getWillingnessColor = () => {
    if (willingnessToBuy >= 80) return "bg-green-500"
    if (willingnessToBuy >= 50) return "bg-blue-500"
    if (willingnessToBuy >= 20) return "bg-yellow-500"
    return "bg-red-500"
  }

  const handleMarkLeadStatus = (status: "sold" | "follow-up") => {
    if (onLeadStatusChange) {
      onLeadStatusChange(status)
      toast.success(`Lead marked as ${status === "sold" ? "Sold" : "Follow-up"}`)
      onClose()
    }
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-gray-900 rounded-xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
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
                    className="text-blue-400"
                  >
                    <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <circle cx="12" cy="10" r="2" />
                    <line x1="8" x2="8" y1="2" y2="4" />
                    <line x1="16" x2="16" y1="2" y2="4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Chat with {customerPersona.personaType}</h3>
                  <p className="text-xs text-gray-400">Customer Persona Simulation</p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Willingness to Buy Score */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-medium">Willingness to Buy</h4>
                <div className="flex items-center">
                  <span
                    className={`text-sm font-medium ${
                      willingnessToBuy >= 80
                        ? "text-green-400"
                        : willingnessToBuy >= 50
                          ? "text-blue-400"
                          : willingnessToBuy >= 20
                            ? "text-yellow-400"
                            : "text-red-400"
                    }`}
                  >
                    {getWillingnessLabel()}
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

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === "sales" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex flex-col max-w-[80%]">
                      <div
                        className={`p-3 rounded-lg ${
                          message.role === "sales"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-gray-800 text-white rounded-bl-none"
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 self-end">{formatTime(message.timestamp)}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-gray-800 p-3 rounded-lg rounded-bl-none">
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

            <div className="p-4 border-t border-gray-800">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => handleMarkLeadStatus("sold")}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Mark as Sold
                </button>
                <button
                  onClick={() => handleMarkLeadStatus("follow-up")}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Schedule Follow-up
                </button>
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isTyping}
                  className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
