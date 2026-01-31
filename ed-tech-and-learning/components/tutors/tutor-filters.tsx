"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"

const specialties = ["All", "Languages", "Programming", "Design", "Business"]
const priceRanges = ["Any Price", "$0-25", "$25-40", "$40+"]

export function TutorFilters() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("All")
  const [selectedPrice, setSelectedPrice] = useState("Any Price")

  const hasActiveFilters = selectedSpecialty !== "All" || selectedPrice !== "Any Price" || searchQuery

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedSpecialty("All")
    setSelectedPrice("Any Price")
  }

  return (
    <div className="mb-6 space-y-4">
      {/* Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tutors by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
            <X className="h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Specialty Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Specialty:</span>
        {specialties.map((specialty) => (
          <Badge
            key={specialty}
            variant={selectedSpecialty === specialty ? "default" : "outline"}
            className="cursor-pointer transition-colors hover:bg-primary/10"
            onClick={() => setSelectedSpecialty(specialty)}
          >
            {specialty}
          </Badge>
        ))}
      </div>

      {/* Price Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Hourly rate:</span>
        {priceRanges.map((range) => (
          <Badge
            key={range}
            variant={selectedPrice === range ? "default" : "secondary"}
            className="cursor-pointer transition-colors"
            onClick={() => setSelectedPrice(range)}
          >
            {range}
          </Badge>
        ))}
      </div>
    </div>
  )
}
