"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import type { TestDriveRequest, SalesFilter, RequestStatus } from "@/types/sales"

export default function SalesDashboardPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<TestDriveRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<SalesFilter>({ period: "all", status: "all" })

  useEffect(() => {
    async function fetchRequests() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/sales/requests?period=${filter.period}&status=${filter.status || "all"}`)

        if (!response.ok) {
          throw new Error("Failed to fetch requests")
        }

        const data = await response.json()
        setRequests(data)
      } catch (error) {
        console.error("Error fetching requests:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [filter])

  const handleViewDetails = (requestId: string) => {
    router.push(`/sales/${requestId}`)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <header className="p-6 border-b border-gray-800">
        <div className="text-sm uppercase tracking-widest mb-2 text-blue-400">VISTA SALES PORTAL</div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-playfair">Test Drive Requests</h1>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter({ ...filter, period: "today" })}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter.period === "today" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilter({ ...filter, period: "week" })}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter.period === "week" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setFilter({ ...filter, period: "all" })}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter.period === "all" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              All
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-2">Filter by status</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter({ ...filter, status: "all" })}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filter.status === "all" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter({ ...filter, status: "pending" })}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filter.status === "pending" ? "bg-yellow-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter({ ...filter, status: "contacted" })}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filter.status === "contacted" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Contacted
            </button>
            <button
              onClick={() => setFilter({ ...filter, status: "completed" })}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filter.status === "completed"
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter({ ...filter, status: "sold" })}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filter.status === "sold" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Sold
            </button>
            <button
              onClick={() => setFilter({ ...filter, status: "follow-up" })}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filter.status === "follow-up"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Follow-up
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No requests found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {requests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-800">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium">{request.customerPersona.personaType}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {request.carPersona.year} {request.carPersona.model}
                    </p>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between mb-4">
                      <div>
                        <div className="text-xs text-gray-500">Date</div>
                        <div className="text-sm">{formatDate(request.appointmentDate)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Time</div>
                        <div className="text-sm">{request.appointmentTime}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Match</div>
                        <div className="text-sm font-medium text-blue-400">{request.carPersona.matchScore}%</div>
                      </div>
                    </div>

                    {request.notes && (
                      <div className="mb-4">
                        <div className="text-xs text-gray-500 mb-1">Notes</div>
                        <p className="text-sm text-gray-300 line-clamp-2">{request.notes}</p>
                      </div>
                    )}

                    <button
                      onClick={() => handleViewDetails(request.id)}
                      className="w-full py-2 px-4 bg-blue-600/20 border border-blue-600/30 rounded-lg text-blue-400 hover:bg-blue-600/30 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  )
}
