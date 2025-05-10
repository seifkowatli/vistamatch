"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface CustomCalendarProps {
  value: Date
  onChange: (date: Date) => void
  minDate?: Date
  maxDate?: Date
}

export default function CustomCalendar({ value, onChange, minDate, maxDate }: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(value))
  const [calendarDays, setCalendarDays] = useState<Array<{ date: Date | null; isCurrentMonth: boolean }>>([])

  useEffect(() => {
    generateCalendarDays(currentMonth)
  }, [currentMonth])

  const generateCalendarDays = (month: Date) => {
    const year = month.getFullYear()
    const monthIndex = month.getMonth()

    // First day of the month
    const firstDay = new Date(year, monthIndex, 1)
    // Last day of the month
    const lastDay = new Date(year, monthIndex + 1, 0)

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay()

    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek

    // Calculate total days to show (previous month + current month + next month)
    const totalDays = 42 // 6 rows of 7 days

    const days: Array<{ date: Date | null; isCurrentMonth: boolean }> = []

    // Add days from previous month
    const prevMonth = new Date(year, monthIndex - 1, 1)
    const prevMonthLastDay = new Date(year, monthIndex, 0).getDate()

    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i
      days.push({
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day),
        isCurrentMonth: false,
      })
    }

    // Add days from current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push({
        date: new Date(year, monthIndex, day),
        isCurrentMonth: true,
      })
    }

    // Add days from next month
    const remainingDays = totalDays - days.length
    const nextMonth = new Date(year, monthIndex + 1, 1)

    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day),
        isCurrentMonth: false,
      })
    }

    setCalendarDays(days)
  }

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth)
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    setCurrentMonth(prevMonth)
  }

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setCurrentMonth(nextMonth)
  }

  const isDateDisabled = (date: Date): boolean => {
    if (!date) return true

    // Check if date is before minDate
    if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0))) {
      return true
    }

    // Check if date is after maxDate
    if (maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999))) {
      return true
    }

    return false
  }

  const isSelectedDate = (date: Date): boolean => {
    if (!date || !value) return false
    return (
      date.getDate() === value.getDate() &&
      date.getMonth() === value.getMonth() &&
      date.getFullYear() === value.getFullYear()
    )
  }

  const isToday = (date: Date): boolean => {
    if (!date) return false
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return
    onChange(date)
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div className="custom-calendar bg-gray-900 rounded-lg p-4 border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Previous month"
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
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <h3 className="text-lg font-medium">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>

        <button
          onClick={handleNextMonth}
          className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Next month"
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
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div key={day} className="text-center text-xs text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <motion.button
            key={index}
            onClick={() => day.date && handleDateClick(day.date)}
            disabled={!day.date || isDateDisabled(day.date)}
            className={`
              py-2 text-center text-sm rounded-md transition-colors
              ${!day.isCurrentMonth ? "text-gray-600" : "text-white"}
              ${isSelectedDate(day.date) ? "bg-blue-600" : ""}
              ${isToday(day.date) && !isSelectedDate(day.date) ? "bg-blue-900/30 border border-blue-500/30" : ""}
              ${!isDateDisabled(day.date) && !isSelectedDate(day.date) && !isToday(day.date) ? "hover:bg-gray-800" : ""}
              ${isDateDisabled(day.date) ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
            `}
            whileTap={{ scale: isDateDisabled(day.date) ? 1 : 0.95 }}
          >
            {day.date?.getDate()}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
