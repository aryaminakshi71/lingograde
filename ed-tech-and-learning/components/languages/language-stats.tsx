import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { languages, currentUser } from "@/lib/data"
import { TrendingUp, Target, Clock, BookOpen, Flame } from "lucide-react"

export function LanguageStats() {
  const currentLanguage = languages[0]
  const totalLessonsAcrossLanguages = languages.reduce((acc, l) => acc + l.lessonsCompleted, 0)
  const averageProgress = Math.round(
    languages.filter((l) => l.progress > 0).reduce((acc, l) => acc + l.progress, 0) /
      languages.filter((l) => l.progress > 0).length
  )

  return (
    <div className="space-y-6">
      {/* Current Language Progress */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            {currentLanguage.name} Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-center">
            <div className="text-4xl font-bold text-primary">{currentLanguage.progress}%</div>
            <p className="text-sm text-muted-foreground">Course completion</p>
          </div>
          <Progress value={currentLanguage.progress} className="h-3" />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <div className="text-xl font-bold text-foreground">{currentLanguage.lessonsCompleted}</div>
              <p className="text-xs text-muted-foreground">Lessons done</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <div className="text-xl font-bold text-foreground">
                {currentLanguage.totalLessons - currentLanguage.lessonsCompleted}
              </div>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Goal */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-accent" />
            Daily Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">15 minutes today</span>
            <span className="text-sm font-semibold text-accent">10/15 min</span>
          </div>
          <Progress value={66} className="h-2" />
          <p className="mt-3 text-center text-xs text-muted-foreground">
            5 more minutes to reach your daily goal!
          </p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
              <Flame className="h-5 w-5 text-chart-3" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{currentUser.streak} Day Streak</p>
              <p className="text-xs text-muted-foreground">Keep it going!</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{totalLessonsAcrossLanguages} Total Lessons</p>
              <p className="text-xs text-muted-foreground">Across all languages</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Clock className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{Math.round(currentUser.totalLearningMinutes / 60)} Hours</p>
              <p className="text-xs text-muted-foreground">Total learning time</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10">
              <TrendingUp className="h-5 w-5 text-chart-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{averageProgress}% Average</p>
              <p className="text-xs text-muted-foreground">Progress across languages</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
