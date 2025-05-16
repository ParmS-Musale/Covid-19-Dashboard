"use client"

import { Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export function DateRangeSelector({ dateRange, onDateRangeChange }) {
  // Predefined date ranges
  const dateRanges = [
    {
      label: "24-10-2022 - 08-12-2023",
      value: { start: "2022-10-24", end: "2023-12-08" },
    },
    {
      label: "Last 6 months",
      value: {
        start: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        end: new Date().toISOString().split("T")[0],
      },
    },
    {
      label: "Last year",
      value: {
        start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        end: new Date().toISOString().split("T")[0],
      },
    },
    {
      label: "All time",
      value: { start: "2019-01-01", end: new Date().toISOString().split("T")[0] },
    },
  ]

  const handleDateRangeSelect = (value) => {
    const selectedRange = dateRanges.find((range) => range.label === value)
    if (selectedRange) {
      onDateRangeChange(selectedRange.value)
    }
  }

  // Find the current selected range label
  const currentRangeLabel =
    dateRanges.find((range) => range.value.start === dateRange.start && range.value.end === dateRange.end)?.label ||
    dateRanges[0].label

  return (
    <div className="relative">
      <div className="flex items-center text-sm text-gray-500 mb-2">Filter by Date Range:</div>
      <Select onValueChange={handleDateRangeSelect} defaultValue={currentRangeLabel}>
        <SelectTrigger className="w-full bg-white pl-10 h-12 rounded-full">
          <SelectValue placeholder="Select date range" />
        </SelectTrigger>
        <SelectContent>
          {dateRanges.map((range) => (
            <SelectItem key={range.label} value={range.label}>
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Calendar className="absolute left-3 top-[calc(50%+6px)] transform -translate-y-1/2 text-gray-400" size={20} />
    </div>
  )
}
