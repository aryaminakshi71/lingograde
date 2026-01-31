"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { categories, levels } from "@/lib/data"
import { Search, SlidersHorizontal, X } from "lucide-react"

export function CourseFilters() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [showFreeOnly, setShowFreeOnly] = useState(false)

  const hasActiveFilters = selectedCategory !== "All" || selectedLevel !== "All" || showFreeOnly || searchQuery

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    setSelectedLevel("All")
    setShowFreeOnly(false)
  }

  return (
    <div className="mb-6 space-y-4">
      {/* Search and Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showFreeOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFreeOnly(!showFreeOnly)}
          >
            Free Courses
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer transition-colors hover:bg-primary/10"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Level Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Level:</span>
        {levels.map((level) => (
          <Badge
            key={level}
            variant={selectedLevel === level ? "default" : "secondary"}
            className="cursor-pointer transition-colors"
            onClick={() => setSelectedLevel(level)}
          >
            {level}
          </Badge>
        ))}
      </div>
    </div>
  )
}
