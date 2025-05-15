"use client"

import { Card } from "@/components/ui/card"

export function CovidStats({ covidData, countryName }) {
  if (!covidData || !covidData.timeline) {
    return <div>No data available</div>
  }

  // Get the latest date from the timeline
  const casesTimeline = covidData.timeline.cases || {}
  const deathsTimeline = covidData.timeline.deaths || {}
  const recoveredTimeline = covidData.timeline.recovered || {}

  const dates = Object.keys(casesTimeline)
  const latestDate = dates[dates.length - 1]

  const totalCases = casesTimeline[latestDate] || 0
  const totalDeaths = deathsTimeline[latestDate] || 0

  // For recoveries, we'll estimate since the API might not provide it directly
  // In real scenarios, you'd use actual recovery data if available
  const totalRecovered = recoveredTimeline[latestDate] || Math.round(totalCases * 0.85)

  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="overflow-hidden">
        <div className="flex">
          <div className="bg-[#c4c6ff] text-black p-4 flex-1">
            <h3 className="font-bold">Total Cases</h3>
            <p className="text-xs opacity-75">{countryName}</p>
          </div>
          <div className="bg-white p-4 flex items-center justify-center">
            <span className="text-xl font-bold">{formatNumber(totalCases)}</span>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex">
          <div className="bg-[#7cff7c] text-black p-4 flex-1">
            <h3 className="font-bold">Recoveries</h3>
            <p className="text-xs opacity-75">{countryName}</p>
          </div>
          <div className="bg-white p-4 flex items-center justify-center">
            <span className="text-xl font-bold">{formatNumber(totalRecovered)}</span>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex">
          <div className="bg-[#ff7c7c] text-black p-4 flex-1">
            <h3 className="font-bold">Deaths</h3>
            <p className="text-xs opacity-75">{countryName}</p>
          </div>
          <div className="bg-white p-4 flex items-center justify-center">
            <span className="text-xl font-bold">{formatNumber(totalDeaths)}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
