"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target, Check } from "lucide-react"

const weeklyGoal = {
  target: 5,
  completed: 3,
  unit: "lessons",
}

export function WeeklyGoal() {
  const progressPercent = (weeklyGoal.completed / weeklyGoal.target) * 100
  const isComplete = weeklyGoal.completed >= weeklyGoal.target

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-accent" />
          Weekly Goal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-foreground">
              {weeklyGoal.completed}/{weeklyGoal.target}
            </p>
            <p className="text-sm text-muted-foreground">{weeklyGoal.unit} this week</p>
          </div>
          {isComplete && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
              <Check className="h-5 w-5 text-accent-foreground" />
            </div>
          )}
        </div>

        <Progress value={progressPercent} className="h-3" />

        <p className="mt-3 text-center text-sm text-muted-foreground">
          {isComplete ? (
            <span className="text-accent font-medium">Goal completed! Great job!</span>
          ) : (
            <>
              <span className="font-semibold text-foreground">{weeklyGoal.target - weeklyGoal.completed}</span> more to reach your goal
            </>
          )}
        </p>
      </CardContent>
    </Card>
  )
}
