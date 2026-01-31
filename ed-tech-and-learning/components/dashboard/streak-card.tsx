"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { currentUser } from "@/lib/data"
import { Flame } from "lucide-react"

const weekDays = ["M", "T", "W", "T", "F", "S", "S"]

export function StreakCard() {
  // Simulate which days had activity (current streak of 7 means all days this week)
  const activeDays = Array(7).fill(true).map((_, i) => i < currentUser.streak % 7 || currentUser.streak >= 7)

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flame className="h-5 w-5 text-chart-3" />
          Daily Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-center">
          <div className="text-5xl font-bold text-chart-3">{currentUser.streak}</div>
          <p className="text-sm text-muted-foreground">days in a row</p>
        </div>
        
        <div className="flex justify-between gap-1">
          {weekDays.map((day, index) => (
            <div key={`${day}-${index}`} className="flex flex-col items-center gap-1">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  activeDays[index]
                    ? "bg-chart-3 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {activeDays[index] && <Flame className="h-4 w-4" />}
              </div>
              <span className="text-xs text-muted-foreground">{day}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg bg-muted/50 p-3 text-center">
          <p className="text-xs text-muted-foreground">
            Longest streak: <span className="font-semibold text-foreground">{currentUser.longestStreak} days</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
