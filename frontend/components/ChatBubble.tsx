"use client"

import { motion } from "framer-motion"
import type { ChatMessage } from "@/types"

interface ChatBubbleProps {
  message: ChatMessage
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (message.role === "user") {
    return (
      <div className="flex flex-col items-end">
        <motion.div
          className="chat-bubble-user"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <p>{message.content}</p>
        </motion.div>
        <span className="text-xs text-gray-500 mt-1">{formatTime(message.timestamp)}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start">
      <motion.div
        className="chat-bubble-car"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <p>{message.content}</p>
      </motion.div>
      <span className="text-xs text-gray-500 mt-1">{formatTime(message.timestamp)}</span>
    </div>
  )
}
