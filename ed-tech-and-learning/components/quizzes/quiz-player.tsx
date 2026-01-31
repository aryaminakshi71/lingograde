"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Quiz } from "@/lib/data"
import { ArrowLeft, Clock, CheckCircle, XCircle, Trophy, RotateCcw, Zap } from "lucide-react"

interface QuizPlayerProps {
  quiz: Quiz
  onClose: () => void
}

export function QuizPlayer({ quiz, onClose }: QuizPlayerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60)
  const [isComplete, setIsComplete] = useState(false)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quiz.questions.length).fill(null))

  const question = quiz.questions[currentQuestion]
  const progressPercent = ((currentQuestion + 1) / quiz.questions.length) * 100

  // Timer
  useEffect(() => {
    if (isComplete) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsComplete(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSelectAnswer = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedAnswer
    setAnswers(newAnswers)

    if (selectedAnswer === question.correctAnswer) {
      setScore((prev) => prev + 1)
    }

    setShowResult(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setIsComplete(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setTimeLeft(quiz.timeLimit * 60)
    setIsComplete(false)
    setAnswers(Array(quiz.questions.length).fill(null))
  }

  // Results Screen
  if (isComplete) {
    const percentage = Math.round((score / quiz.questions.length) * 100)
    const xpEarned = Math.round((score / quiz.questions.length) * quiz.xpReward)
    const isPassing = percentage >= 70

    return (
      <Card className="border-border">
        <CardContent className="p-8">
          <div className="mx-auto max-w-md text-center">
            <div
              className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${
                isPassing ? "bg-accent/10" : "bg-chart-3/10"
              }`}
            >
              <Trophy className={`h-10 w-10 ${isPassing ? "text-accent" : "text-chart-3"}`} />
            </div>

            <h2 className="text-2xl font-bold text-foreground">
              {isPassing ? "Congratulations!" : "Nice Try!"}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {isPassing
                ? "You passed the quiz with flying colors!"
                : "Keep practicing and you'll do even better next time!"}
            </p>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="text-3xl font-bold text-foreground">{percentage}%</div>
                <div className="text-xs text-muted-foreground">Score</div>
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="text-3xl font-bold text-foreground">
                  {score}/{quiz.questions.length}
                </div>
                <div className="text-xs text-muted-foreground">Correct</div>
              </div>
              <div className="rounded-xl bg-primary/10 p-4">
                <div className="text-3xl font-bold text-primary">+{xpEarned}</div>
                <div className="text-xs text-muted-foreground">XP Earned</div>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-3">
              <Button variant="outline" onClick={handleRestart} className="gap-2 bg-transparent">
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={onClose}>Back to Quizzes</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Exit Quiz
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatTime(timeLeft)}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Zap className="h-3.5 w-3.5" />
              +{quiz.xpReward} XP
            </Badge>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span>{Math.round(progressPercent)}% complete</span>
          </div>
          <Progress value={progressPercent} className="mt-2 h-2" />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Question */}
        <div className="mb-6">
          <CardTitle className="text-xl">{question.question}</CardTitle>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrect = index === question.correctAnswer
            const showCorrectness = showResult

            let optionClass = "border-border hover:border-primary/50 hover:bg-muted/50"
            if (isSelected && !showCorrectness) {
              optionClass = "border-primary bg-primary/5 ring-2 ring-primary/20"
            } else if (showCorrectness) {
              if (isCorrect) {
                optionClass = "border-accent bg-accent/10"
              } else if (isSelected && !isCorrect) {
                optionClass = "border-destructive bg-destructive/10"
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={showResult}
                className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${optionClass}`}
              >
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-sm font-medium ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-muted text-muted-foreground"
                  } ${showCorrectness && isCorrect ? "border-accent bg-accent text-white" : ""} ${
                    showCorrectness && isSelected && !isCorrect
                      ? "border-destructive bg-destructive text-white"
                      : ""
                  }`}
                >
                  {showCorrectness && isCorrect ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : showCorrectness && isSelected && !isCorrect ? (
                    <XCircle className="h-4 w-4" />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </div>
                <span className="font-medium text-foreground">{option}</span>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div
            className={`mt-4 rounded-xl p-4 ${
              selectedAnswer === question.correctAnswer
                ? "bg-accent/10 border border-accent/30"
                : "bg-chart-3/10 border border-chart-3/30"
            }`}
          >
            <p className="text-sm text-foreground">
              <span className="font-semibold">
                {selectedAnswer === question.correctAnswer ? "Correct! " : "Explanation: "}
              </span>
              {question.explanation}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          {!showResult ? (
            <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              {currentQuestion < quiz.questions.length - 1 ? "Next Question" : "See Results"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
