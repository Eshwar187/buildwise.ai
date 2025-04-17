"use client"

import { useState, useEffect } from "react"
import { MapPin, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

interface RegionSelectorProps {
  onRegionChange: (region: {
    country: string
    countryCode: string
    state: string
    stateCode?: string
    city: string
    region?: string
  }) => void
  defaultValues?: {
    country?: string
    state?: string
    city?: string
    region?: string
  }
}

interface Country {
  country: string
  countryCode: string
}

interface State {
  state: string
  stateCode?: string
}

interface City {
  city: string
}

export function RegionSelector({ onRegionChange, defaultValues }: RegionSelectorProps) {
  const [countries, setCountries] = useState<Country[]>([])
  const [states, setStates] = useState<State[]>([])
  const [cities, setCities] = useState<City[]>([])
  
  const [selectedCountry, setSelectedCountry] = useState<string>(defaultValues?.country || "")
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("")
  const [selectedState, setSelectedState] = useState<string>(defaultValues?.state || "")
  const [selectedStateCode, setSelectedStateCode] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<string>(defaultValues?.city || "")
  const [region, setRegion] = useState<string>(defaultValues?.region || "")
  
  const [isLoadingCountries, setIsLoadingCountries] = useState(true)
  const [isLoadingStates, setIsLoadingStates] = useState(false)
  const [isLoadingCities, setIsLoadingCities] = useState(false)

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/regions?type=countries")
        const data = await response.json()
        
        if (data.countries && Array.isArray(data.countries)) {
          setCountries(data.countries)
          
          // If we have a default country, find its code
          if (defaultValues?.country) {
            const country = data.countries.find(
              (c: Country) => c.country === defaultValues.country
            )
            if (country) {
              setSelectedCountryCode(country.countryCode)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching countries:", error)
      } finally {
        setIsLoadingCountries(false)
      }
    }
    
    fetchCountries()
  }, [defaultValues?.country])

  // Fetch states when country changes
  useEffect(() => {
    if (!selectedCountry) {
      setStates([])
      setSelectedState("")
      setSelectedStateCode("")
      return
    }
    
    const fetchStates = async () => {
      setIsLoadingStates(true)
      try {
        const response = await fetch(`/api/regions?type=states&country=${encodeURIComponent(selectedCountry)}`)
        const data = await response.json()
        
        if (data.states && Array.isArray(data.states)) {
          setStates(data.states)
          
          // If we have a default state, find its code
          if (defaultValues?.state) {
            const state = data.states.find(
              (s: State) => s.state === defaultValues.state
            )
            if (state) {
              setSelectedStateCode(state.stateCode || "")
            }
          }
        }
      } catch (error) {
        console.error("Error fetching states:", error)
      } finally {
        setIsLoadingStates(false)
      }
    }
    
    fetchStates()
  }, [selectedCountry, defaultValues?.state])

  // Fetch cities when state changes
  useEffect(() => {
    if (!selectedCountry || !selectedState) {
      setCities([])
      setSelectedCity("")
      return
    }
    
    const fetchCities = async () => {
      setIsLoadingCities(true)
      try {
        const response = await fetch(
          `/api/regions?type=cities&country=${encodeURIComponent(selectedCountry)}&state=${encodeURIComponent(selectedState)}`
        )
        const data = await response.json()
        
        if (data.cities && Array.isArray(data.cities)) {
          setCities(data.cities)
        }
      } catch (error) {
        console.error("Error fetching cities:", error)
      } finally {
        setIsLoadingCities(false)
      }
    }
    
    fetchCities()
  }, [selectedCountry, selectedState])

  // Update parent component when region changes
  useEffect(() => {
    if (selectedCountry && selectedState && selectedCity) {
      onRegionChange({
        country: selectedCountry,
        countryCode: selectedCountryCode,
        state: selectedState,
        stateCode: selectedStateCode,
        city: selectedCity,
        region: region || undefined
      })
    }
  }, [selectedCountry, selectedCountryCode, selectedState, selectedStateCode, selectedCity, region, onRegionChange])

  // Handle country change
  const handleCountryChange = (value: string) => {
    const country = countries.find(c => c.country === value)
    setSelectedCountry(value)
    setSelectedCountryCode(country?.countryCode || "")
    setSelectedState("")
    setSelectedStateCode("")
    setSelectedCity("")
  }

  // Handle state change
  const handleStateChange = (value: string) => {
    const state = states.find(s => s.state === value)
    setSelectedState(value)
    setSelectedStateCode(state?.stateCode || "")
    setSelectedCity("")
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        {isLoadingCountries ? (
          <Skeleton className="h-10 w-full bg-slate-700" />
        ) : (
          <Select
            value={selectedCountry}
            onValueChange={handleCountryChange}
          >
            <SelectTrigger id="country" className="bg-slate-700 border-slate-600">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 max-h-[300px]">
              {countries.map((country) => (
                <SelectItem key={country.countryCode} value={country.country}>
                  {country.country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="state">State/Province</Label>
        {isLoadingStates ? (
          <Skeleton className="h-10 w-full bg-slate-700" />
        ) : (
          <Select
            value={selectedState}
            onValueChange={handleStateChange}
            disabled={!selectedCountry || states.length === 0}
          >
            <SelectTrigger id="state" className="bg-slate-700 border-slate-600">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 max-h-[300px]">
              {states.map((state) => (
                <SelectItem key={state.stateCode || state.state} value={state.state}>
                  {state.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        {isLoadingCities ? (
          <Skeleton className="h-10 w-full bg-slate-700" />
        ) : (
          <Select
            value={selectedCity}
            onValueChange={setSelectedCity}
            disabled={!selectedState || cities.length === 0}
          >
            <SelectTrigger id="city" className="bg-slate-700 border-slate-600">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 max-h-[300px]">
              {cities.map((city) => (
                <SelectItem key={city.city} value={city.city}>
                  {city.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="region">Region/Area (Optional)</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <Input
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="e.g., Downtown, Suburb, etc."
            className="bg-slate-700 border-slate-600 pl-10"
          />
        </div>
      </div>
    </div>
  )
}
