'use client'

import { useMemo } from 'react'
import { Clock, CalendarDays } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import type { DeliveryTiming } from '@/lib/types'

const demoTimings: DeliveryTiming[] = [
  { id: '1', label: 'Early Morning', start_hour: 7, end_hour: 9, active: true, sort_order: 1, created_at: '' },
  { id: '2', label: 'Morning', start_hour: 9, end_hour: 11, active: true, sort_order: 2, created_at: '' },
  { id: '3', label: 'Midday', start_hour: 11, end_hour: 13, active: true, sort_order: 3, created_at: '' },
  { id: '4', label: 'Afternoon', start_hour: 13, end_hour: 15, active: true, sort_order: 4, created_at: '' },
  { id: '5', label: 'Late Afternoon', start_hour: 15, end_hour: 17, active: true, sort_order: 5, created_at: '' },
  { id: '6', label: 'Evening', start_hour: 17, end_hour: 19, active: true, sort_order: 6, created_at: '' },
]

interface DeliverySlotPickerProps {
  selectedDate: string
  selectedTime: string
  onDateChange: (d: string) => void
  onTimeChange: (t: string) => void
}

function formatHour(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM'
  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${h}:00 ${period}`
}

export default function DeliverySlotPicker({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
}: DeliverySlotPickerProps) {
  const { isDemo } = useAuth()

  // Generate next 7 days starting from tomorrow
  const dates = useMemo(() => {
    const result: { value: string; dayName: string; dateNum: number; monthShort: string }[] = []
    const today = new Date()

    for (let i = 1; i <= 7; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      const value = d.toISOString().split('T')[0]
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
      const dateNum = d.getDate()
      const monthShort = d.toLocaleDateString('en-US', { month: 'short' })
      result.push({ value, dayName, dateNum, monthShort })
    }

    return result
  }, [])

  // Use demo timings in demo mode
  const timings = isDemo ? demoTimings : demoTimings

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays className="w-4 h-4 text-leaf-500" />
          <span className="label mb-0">Delivery Date</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dates.map((date) => {
            const isActive = selectedDate === date.value
            return (
              <button
                key={date.value}
                onClick={() => onDateChange(date.value)}
                className={`flex flex-col items-center px-4 py-3 rounded-xl transition-all duration-300 min-w-[72px] flex-shrink-0 ${
                  isActive
                    ? 'bg-earth-500 text-white shadow-md'
                    : 'bg-sunbeam-50 text-earth-400 hover:bg-sunbeam-100 hover:text-earth-500'
                }`}
              >
                <span className={`text-xs font-body font-medium ${isActive ? 'text-cream-200' : ''}`}>
                  {date.dayName}
                </span>
                <span className={`text-lg font-display font-semibold ${isActive ? 'text-white' : 'text-earth-600'}`}>
                  {date.dateNum}
                </span>
                <span className={`text-[10px] font-body ${isActive ? 'text-cream-200' : 'text-orchard-300'}`}>
                  {date.monthShort}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Time Selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-leaf-500" />
          <span className="label mb-0">Delivery Time</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {timings
            .filter((t) => t.active)
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
            .map((slot) => {
              const slotValue = `${slot.start_hour}-${slot.end_hour}`
              const isActive = selectedTime === slotValue
              return (
                <button
                  key={slot.id}
                  onClick={() => onTimeChange(slotValue)}
                  className={`p-3 rounded-xl text-center transition-all duration-300 ${
                    isActive
                      ? 'border-2 border-leaf-500 bg-leaf-50 shadow-sm'
                      : 'border border-orchard-100 bg-white hover:border-orchard-200 hover:bg-sunbeam-50'
                  }`}
                >
                  <p className={`text-sm font-body font-semibold ${isActive ? 'text-leaf-700' : 'text-earth-500'}`}>
                    {slot.label}
                  </p>
                  <p className={`text-xs font-body mt-0.5 ${isActive ? 'text-leaf-600' : 'text-orchard-400'}`}>
                    {formatHour(slot.start_hour)} - {formatHour(slot.end_hour)}
                  </p>
                </button>
              )
            })}
        </div>
      </div>
    </div>
  )
}
