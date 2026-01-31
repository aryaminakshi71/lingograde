"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { quizzes } from "@/lib/data"
import { QuizPlayer } from "./quiz-player"
import { ClipboardList, Clock, HelpCircle, Zap, Play, ChevronRight } from "lucide-react"

const difficultyColors = {
  Easy: "bg-accent/10 text-accent border-accent/30",
  Medium: "bg-chart-3/10 text-chart-3 border-chart-3/30",
  Hard: "bg-destructive/10 text-destructive border-destructive/30",
}

export function QuizList() {
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null)

  const selectedQuiz = quizzes.find((q) => q.id === activeQuiz)

  if (selectedQuiz) {
    return <QuizPlayer quiz={selectedQuiz} onClose={() => setActiveQuiz(null)} />
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          Available Quizzes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="group flex flex-col gap-4 rounded-xl border border-border p-4 transition-all hover:border-primary/50 hover:bg-muted/30 sm:flex-row sm:items-center"
          >
            {/* Icon */}
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <HelpCircle className="h-7 w-7 text-primary" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-foreground">{quiz.title}</h3>
                <Badge variant="secondary">{quiz.category}</Badge>
                <Badge variant="outline" className={difficultyColors[quiz.difficulty]}>
                  {quiz.difficulty}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{quiz.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <HelpCircle className="h-3.5 w-3.5" />
                  {quiz.questionsCount} questions
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {quiz.timeLimit} min
                </span>
                <span className="flex items-center gap-1 text-primary">
                  <Zap className="h-3.5 w-3.5" />
                  +{quiz.xpReward} XP
                </span>
              </div>
            </div>

            {/* Action */}
            <Button
              className="gap-1 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
              onClick={() => setActiveQuiz(quiz.id)}
            >
              <Play className="h-4 w-4" />
              Start Quiz
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
