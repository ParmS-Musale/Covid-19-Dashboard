"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function LineChartComponent({ covidData, dateRange }) {
  const [chartData, setChartData] = useState([])
  const [isDataEmpty, setIsDataEmpty] = useState(false)

  useEffect(() => {
    if (!covidData || !covidData.timeline) {
      setIsDataEmpty(true)
      return
    }

    setIsDataEmpty(false)
    const { cases, deaths, recovered } = covidData.timeline

    // Convert timeline data to chart format
    const formattedData = Object.keys(cases).map((date) => {
      // Parse the date string to a Date object
      const dateObj = new Date(date)

      // Format the date to YYYY-MM-DD for comparison with dateRange
      const formattedDate = dateObj.toISOString().split("T")[0]

      // Get the year for display on the x-axis
      const year = dateObj.getFullYear()

      return {
        date: formattedDate,
        displayDate: year,
        cases: cases[date],
        deaths: deaths[date],
        recovered: recovered ? recovered[date] : Math.round(cases[date] * 0.85), // Estimate if not available
      }
    })

    // Filter data based on date range
    const filteredData = formattedData.filter((item) => {
      return item.date >= dateRange.start && item.date <= dateRange.end
    })

    // Reduce data points for better visualization
    const reducedData = reduceDataPoints(filteredData, 10)

    setChartData(reducedData)
  }, [covidData, dateRange])

  // Function to reduce the number of data points for better visualization
  const reduceDataPoints = (data, targetPoints) => {
    if (data.length <= targetPoints) return data

    const step = Math.floor(data.length / targetPoints)
    return data.filter((_, index) => index % step === 0)
  }

  // Format large numbers for display
  const formatYAxis = (value) => {
    if (value === 0) return "0.0"
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}`
    return value
  }

  // Custom tooltip to display formatted values
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{`${payload[0].payload.displayDate}`}</p>
          <p className="text-[#8884d8]">{`Cases: ${payload[0].value.toLocaleString()}`}</p>
          <p className="text-[#82ca9d]">{`Recovered: ${payload[1].value.toLocaleString()}`}</p>
          <p className="text-[#ff7c7c]">{`Deaths: ${payload[2].value.toLocaleString()}`}</p>
        </div>
      )
    }
    return null
  }

  if (isDataEmpty || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>No data available for the selected period</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="displayDate" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="bottom" height={36} />
        <Line
          type="monotone"
          dataKey="cases"
          name="Cases"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ r: 2 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="recovered"
          name="Recovered"
          stroke="#82ca9d"
          strokeWidth={2}
          dot={{ r: 2 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="deaths"
          name="Deaths"
          stroke="#ff7c7c"
          strokeWidth={2}
          dot={{ r: 2 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
