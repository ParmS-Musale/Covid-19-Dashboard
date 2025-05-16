"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

export function PieChartComponent({ covidData, countryName }) {
  const [chartData, setChartData] = useState([])
  const [countryPopulation, setCountryPopulation] = useState(0)
  const [isDataEmpty, setIsDataEmpty] = useState(false)

  useEffect(() => {
    const fetchCountryPopulation = async () => {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        if (!response.ok) throw new Error("Failed to fetch country population")

        const data = await response.json()
        if (data && data.length > 0) {
          setCountryPopulation(data[0].population || 0)
        }
      } catch (error) {
        console.error("Error fetching country population:", error)
        // Fallback population for USA if API fails
        setCountryPopulation(331900000)
      }
    }

    fetchCountryPopulation()
  }, [countryName])

  useEffect(() => {
    if (!covidData || !covidData.timeline || !countryPopulation) {
      setIsDataEmpty(true)
      return
    }

    setIsDataEmpty(false)
    const { cases, deaths, recovered } = covidData.timeline

    // Get the latest date from the timeline
    const dates = Object.keys(cases)
    const latestDate = dates[dates.length - 1]

    const totalCases = cases[latestDate] || 0
    const totalDeaths = deaths[latestDate] || 0
    const totalRecovered = recovered ? recovered[latestDate] : Math.round(totalCases * 0.85)

    // Calculate active cases
    const activeCases = totalCases - totalRecovered - totalDeaths

    // Calculate healthy population
    const healthyPopulation = Math.max(0, countryPopulation - totalCases)

    const data = [
      { name: "Active Cases", value: activeCases, color: "#8884d8" },
      { name: "Recovered", value: totalRecovered, color: "#82ca9d" },
      { name: "Deaths", value: totalDeaths, color: "#ff7c7c" },
      { name: "Healthy Population", value: healthyPopulation, color: "#ffd700" },
    ]

    setChartData(data)
  }, [covidData, countryPopulation])

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value.toLocaleString()}`}</p>
          <p>{`${((payload[0].value / countryPopulation) * 100).toFixed(2)}% of population`}</p>
        </div>
      )
    }
    return null
  }

  // Format the population for the label
  const formatPopulation = (population) => {
    if (population >= 1000000000) {
      return `${(population / 1000000000).toFixed(2)}B`
    }
    if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`
    }
    if (population >= 1000) {
      return `${(population / 1000).toFixed(1)}K`
    }
    return population.toString()
  }

  if (isDataEmpty || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>No data available for the selected country</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={100}
          innerRadius={60}
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend layout="vertical" verticalAlign="middle" align="right" />
        {countryPopulation > 0 && (
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-sm font-medium">
            {`${formatPopulation(countryPopulation)} Total Population`}
          </text>
        )}
      </PieChart>
    </ResponsiveContainer>
  )
}
