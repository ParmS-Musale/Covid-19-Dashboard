"use client"

import { useState, useEffect } from "react"
import { Card } from "./components/ui/card"
import { CovidStats } from "./components/CovidStats"
import { CountrySelector } from "./components/CountrySelector"
import { DateRangeSelector } from "./components/DateRangeSelector"
import { LineChartComponent } from "./components/LineChart"
import { PieChartComponent } from "./components/PieChart"

function App() {
  const [selectedCountry, setSelectedCountry] = useState("usa")
  const [countryName, setCountryName] = useState("USA")
  const [dateRange, setDateRange] = useState({
    start: "2022-10-24",
    end: "2023-12-08",
  })
  const [covidData, setCovidData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCovidData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://disease.sh/v3/covid-19/historical/${selectedCountry}?lastdays=1500`)

        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${selectedCountry}`)
        }

        const data = await response.json()
        setCovidData(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchCovidData()
  }, [selectedCountry])

  const handleCountryChange = (country, name) => {
    setSelectedCountry(country)
    setCountryName(name)
  }

  const handleDateRangeChange = (range) => {
    setDateRange(range)
  }

  return (
    <div className="min-h-screen bg-[#e6f2ff] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">COVID-19 and Population Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <CountrySelector onCountryChange={handleCountryChange} />
          <DateRangeSelector dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />
        </div>

        {loading ? (
          <div className="text-center py-8">Loading COVID-19 data...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">Error: {error}</div>
        ) : (
          <>
            <CovidStats covidData={covidData} countryName={countryName} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="p-4 bg-white">
                <h2 className="text-lg font-medium mb-4">Line Chart</h2>
                <div className="h-[350px] w-full">
                  <LineChartComponent covidData={covidData} dateRange={dateRange} />
                </div>
              </Card>

              <Card className="p-4 bg-white">
                <h2 className="text-lg font-medium mb-4">Pie Chart</h2>
                <div className="h-[350px] w-full">
                  <PieChartComponent covidData={covidData} countryName={countryName} />
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
