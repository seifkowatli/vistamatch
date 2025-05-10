"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import type { TestDriveRequest, RequestStatus } from "@/types/sales"
import PremiumCarDisplay from "@/components/PremiumCarDisplay"
import PersonaAvatar from "@/components/PersonaAvatar"

export default function RequestDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [request, setRequest] = useState<TestDriveRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false)
  const [showStatusMessage, setShowStatusMessage] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")

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
      } catch (error) {
        console.error("Error fetching request:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequest()
  }, [params.id])

  const handleStatusUpdate = async (newStatus: RequestStatus) => {
    if (!request) return

    try {
      setStatusUpdateLoading(true)
      const response = await fetch(`/api/sales/requests/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      const data = await response.json()
      setRequest({ ...request, status: newStatus })

      // Show status message
      setStatusMessage(`Status updated to ${newStatus}`)
      setShowStatusMessage(true)

      // Hide status message after 3 seconds
      setTimeout(() => {
        setShowStatusMessage(false)
      }, 3000)
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setStatusUpdateLoading(false)
    }
  }

  const handleLeadStatusChange = async (status: "sold" | "follow-up") => {
    const newStatus = status === "sold" ? "sold" : "follow-up"
    await handleStatusUpdate(newStatus as RequestStatus)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "contacted":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "sold":
        return "bg-purple-500"
      case "lost":
        return "bg-red-500"
      case "follow-up":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
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
      <header className="p-6 border-b border-gray-800">
        <div className="text-sm uppercase tracking-widest mb-2 text-blue-400">VISTA SALES PORTAL</div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/sales")}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>

          <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </div>
        </div>
      </header>

      {/* Status update message */}
      <AnimatePresence>
        {showStatusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          >
            {statusMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-playfair mb-2">Test Drive Request</h1>
            <p className="text-gray-400">Booked on {formatTimestamp(request.bookingTimestamp)}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Customer Persona */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900 rounded-xl border border-gray-800 p-6"
            >
              <h2 className="text-xl font-medium mb-4">Customer Persona</h2>

              <div className="flex flex-col items-center mb-6">
                <PersonaAvatar persona={request.customerPersona} type="customer" size="lg" />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Lifestyle</h3>
                  <p>{request.customerPersona.lifestyleVibe}</p>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Description</h3>
                  <p>{request.customerPersona.description}</p>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Emotional Drivers</h3>
                  <div className="flex flex-wrap gap-2">
                    {request.customerPersona.emotionalDrivers.map((driver, index) => (
                      <span key={index} className="px-3 py-1 rounded-full bg-blue-900/40 text-blue-300 text-sm">
                        {driver}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Car Preferences</h3>
                  <div className="flex flex-wrap gap-2">
                    {request.customerPersona.preferredCarTraits.map((trait, index) => (
                      <span key={index} className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Decision Behavior</h3>
                  <p>{request.customerPersona.decisionBehavior}</p>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Brand Relationship</h3>
                  <p>{request.customerPersona.brandRelationship}</p>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Purchase Concerns</h3>
                  <p>{request.customerPersona.purchaseConcerns?.[0] || "Not specified"}</p>
                </div>
              </div>
            </motion.div>

            {/* Car Persona */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-900 rounded-xl border border-gray-800 p-6"
            >
              <h2 className="text-xl font-medium mb-4">Car Details</h2>

              <div className="mb-6">
                <PremiumCarDisplay car={request.carPersona} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    {request.carPersona.year} {request.carPersona.model}
                  </h3>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {request.carPersona.matchScore}%
                    </div>
                    <div className="ml-2 text-sm text-gray-400">Match</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Emotional Tone</h3>
                  <p>{request.carPersona.emotionalTone}</p>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Match Explanation</h3>
                  <div className="flex flex-wrap gap-2">
                    {request.carPersona.matchExplanation.split(", ").map((reason, index) => (
                      <span key={index} className="px-3 py-1 rounded-full bg-blue-900/40 text-blue-300 text-sm">
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Driving Feel</h3>
                  <p>{request.carPersona.drivingFeel}</p>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Visual Vibe</h3>
                  <p>{request.carPersona.visualVibe}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Test Drive Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8"
          >
            <h2 className="text-xl font-medium mb-4">Test Drive Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Date</h3>
                <p className="text-lg">{formatDate(request.appointmentDate)}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-400 mb-1">Time</h3>
                <p className="text-lg">{request.appointmentTime}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-400 mb-1">Booking Reference</h3>
                <p className="text-lg font-mono">{`TD-${request.id.split("_")[1]}`}</p>
              </div>
            </div>

            {request.notes && (
              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                <h3 className="text-sm text-gray-400 mb-2">Notes</h3>
                <p>{request.notes}</p>
              </div>
            )}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gray-900 rounded-xl border border-gray-800 p-6"
          >
            <h2 className="text-xl font-medium mb-4">Actions</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm text-gray-400 mb-2">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusUpdate("pending")}
                    disabled={request.status === "pending" || statusUpdateLoading}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      request.status === "pending"
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-yellow-600/70 hover:text-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusUpdate("contacted")}
                    disabled={request.status === "contacted" || statusUpdateLoading}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      request.status === "contacted"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-blue-600/70 hover:text-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Contacted
                  </button>
                  <button
                    onClick={() => handleStatusUpdate("completed")}
                    disabled={request.status === "completed" || statusUpdateLoading}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      request.status === "completed"
                        ? "bg-green-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-green-600/70 hover:text-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => handleStatusUpdate("sold")}
                    disabled={request.status === "sold" || statusUpdateLoading}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      request.status === "sold"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-purple-600/70 hover:text-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Sold
                  </button>
                  <button
                    onClick={() => handleStatusUpdate("lost")}
                    disabled={request.status === "lost" || statusUpdateLoading}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      request.status === "lost"
                        ? "bg-red-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-red-600/70 hover:text-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Lost
                  </button>
                  <button
                    onClick={() => handleStatusUpdate("follow-up")}
                    disabled={request.status === "follow-up" || statusUpdateLoading}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      request.status === "follow-up"
                        ? "bg-orange-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-orange-600/70 hover:text-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Follow-up
                  </button>
                </div>
              </div>

              <div>
                <button
                  onClick={() => router.push(`/sales/${params.id}/chat`)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
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
                    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                  </svg>
                  🧠 Begin Persona Conversation
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
