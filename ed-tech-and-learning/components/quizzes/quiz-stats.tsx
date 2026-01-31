import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { quizzes, currentUser } from "@/lib/data"
import { Trophy, Target, Zap, TrendingUp, Award } from "lucide-react"

export function QuizStats() {
  const totalQuizzes = quizzes.length
  const completedQuizzes = 2 // Mock data
  const averageScore = 85 // Mock data
  const totalXpFromQuizzes = 125 // Mock data

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-chart-3" />
            Your Quiz Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{completedQuizzes}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{totalQuizzes - completedQuizzes}</div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">
                {Math.round((completedQuizzes / totalQuizzes) * 100)}%
              </span>
            </div>
            <Progress value={(completedQuizzes / totalQuizzes) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Performance */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Target className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Score</span>
                <span className="font-semibold text-foreground">{averageScore}%</span>
              </div>
              <Progress value={averageScore} className="mt-1 h-1.5" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">+{totalXpFromQuizzes} XP</p>
              <p className="text-xs text-muted-foreground">Earned from quizzes</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
              <Award className="h-5 w-5 text-chart-3" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Quiz Master</p>
              <p className="text-xs text-muted-foreground">5 more quizzes to unlock</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">-</span>
              Read each question carefully before answering
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">-</span>
              Use the timer as a guide, not a stressor
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">-</span>
              Review explanations to learn from mistakes
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">-</span>
              Retake quizzes to improve your score
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
