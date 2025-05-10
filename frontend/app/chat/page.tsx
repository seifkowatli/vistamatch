"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Toaster } from "react-hot-toast"
import type { CarPersona, CustomerPersona, ChatMessage } from "@/types"
import { sendChatMessage } from "@/lib/api"
import ChatBubble from "@/components/ChatBubble"
import TestDriveModal from "@/components/TestDriveModal"
import PersonaAvatar from "@/components/PersonaAvatar"

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const carId = searchParams.get("carId")
  const [car, setCar] = useState<CarPersona | null>(null)
  const [customerPersona, setCustomerPersona] = useState<CustomerPersona | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [chatRole, setChatRole] = useState<"car" | "sales">("car")
  const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Retrieve car and customer persona from localStorage
    const storedCar = localStorage.getItem("selectedCar")
    const storedPersona = localStorage.getItem("customerPersona")

    if (storedCar) {
      const parsedCar = JSON.parse(storedCar)
      if (!carId || parsedCar.id === carId) {
        setCar(parsedCar)
      }
    }

    if (storedPersona) {
      setCustomerPersona(JSON.parse(storedPersona))
    }

    // Initialize with a welcome message
    if (storedCar) {
      const parsedCar = JSON.parse(storedCar)
      setMessages([
        {
          id: "1",
          role: "car",
          content: `Hello! I'm the ${parsedCar.year} ${parsedCar.model}. How can I assist you today?`,
          timestamp: new Date(),
        },
      ])
    }
  }, [carId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !car || !customerPersona) return

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
      const response = await sendChatMessage(chatRole, chatRole === "car" ? car : customerPersona, newMessage)

      // Add response message
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: chatRole,
        content: response.reply,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, responseMessage])
    } catch (error) {
      console.error("Error sending message:", error)

      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: chatRole,
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const toggleChatRole = () => {
    setChatRole((prev) => (prev === "car" ? "sales" : "car"))
  }

  const handleBookTestDrive = () => {
    setIsTestDriveModalOpen(true)
  }

  if (!car || !customerPersona) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-playfair mb-4">Chat not available</h2>
          <button onClick={() => router.push("/match")} className="glow-button">
            Back to Matches
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" />
      <motion.header
        className="p-6 border-b border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-sm uppercase tracking-widest mb-2">VISTA</div>
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back
          </motion.button>

          <div className="text-xl font-playfair">Chat</div>

          <motion.button
            onClick={toggleChatRole}
            className="text-sm px-3 py-1 rounded-full border border-white/20 hover:border-white/40"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {chatRole === "car" ? "Chat with Car" : "Chat with Sales"}
          </motion.button>
        </div>
      </motion.header>

      <main className="flex-1 flex flex-col p-4 md:p-6">
        <div className="flex items-center justify-center space-x-8 mb-6">
          <div className="flex flex-col items-center">
            <PersonaAvatar persona={customerPersona} type="customer" isActive={true} size="sm" />
            <div className="text-sm text-gray-400 mt-1">You</div>
          </div>

          <div className="flex-1 flex justify-center max-w-[100px]">
            <div className="w-full h-px bg-white/20"></div>
          </div>

          <div className="flex flex-col items-center">
            <PersonaAvatar persona={car} type="car" isActive={true} size="sm" />
            <div className="text-sm text-gray-400 mt-1">{chatRole === "car" ? "Car" : "Sales"}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <ChatBubble message={message} />

                {/* Add test drive button after car messages that mention driving or experience */}
                {message.role === "car" &&
                  (message.content.toLowerCase().includes("drive") ||
                    message.content.toLowerCase().includes("experience") ||
                    message.content.toLowerCase().includes("feel")) && (
                    <motion.div
                      className="flex justify-center my-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <button
                        onClick={handleBookTestDrive}
                        className="bg-blue-600/80 backdrop-blur-sm hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors flex items-center space-x-2 shadow-lg"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                          <line x1="16" x2="16" y1="2" y2="6" />
                          <line x1="8" x2="8" y1="2" y2="6" />
                          <line x1="3" x2="21" y1="10" y2="10" />
                          <path d="m9 16 2 2 4-4" />
                        </svg>
                        <span>Book a Test Drive</span>
                      </button>
                    </motion.div>
                  )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              className="chat-bubble-car"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <motion.form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 flex items-center justify-center bg-primary rounded-full text-white"
            disabled={!newMessage.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </motion.button>
        </motion.form>
      </main>

      <TestDriveModal isOpen={isTestDriveModalOpen} onClose={() => setIsTestDriveModalOpen(false)} car={car} />
    </div>
  )
}
