"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export function CountrySelector({ onCountryChange }) {
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://restcountries.com/v3.1/all")

        if (!response.ok) {
          throw new Error("Failed to fetch countries")
        }

        const data = await response.json()

        // Sort countries by name
        const sortedCountries = data
          .map((country) => ({
            name: country.name.common,
            code: country.cca3?.toLowerCase() || "",
            population: country.population || 0,
          }))
          .sort((a, b) => a.name.localeCompare(b.name))

        setCountries(sortedCountries)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  const handleCountrySelect = (value) => {
    const selectedCountry = countries.find((country) => country.code === value)
    if (selectedCountry) {
      onCountryChange(value, selectedCountry.name)
    }
  }

  return (
    <div className="relative">
      <Select onValueChange={handleCountrySelect} defaultValue="usa">
        <SelectTrigger className="w-full bg-white pl-10 h-12 rounded-full">
          <SelectValue placeholder="Search Country" />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <div className="p-2">Loading countries...</div>
          ) : error ? (
            <div className="p-2 text-red-500">Error: {error}</div>
          ) : (
            countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
    </div>
  )
}
