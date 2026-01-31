import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { currentUser } from "@/lib/data"
import { Star } from "lucide-react"

export function LevelProgress() {
  const progressPercent = (currentUser.xp / currentUser.xpToNextLevel) * 100
  const xpRemaining = currentUser.xpToNextLevel - currentUser.xp

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="h-5 w-5 text-primary" />
          Level Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              {currentUser.level}
            </div>
            <div>
              <p className="font-semibold text-foreground">Level {currentUser.level}</p>
              <p className="text-sm text-muted-foreground">Rising Star</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{currentUser.xp}</p>
            <p className="text-xs text-muted-foreground">XP earned</p>
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={progressPercent} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{currentUser.xp} XP</span>
            <span>{currentUser.xpToNextLevel} XP</span>
          </div>
        </div>

        <p className="mt-3 text-center text-sm text-muted-foreground">
          <span className="font-semibold text-primary">{xpRemaining} XP</span> to reach Level {currentUser.level + 1}
        </p>
      </CardContent>
    </Card>
  )
}
