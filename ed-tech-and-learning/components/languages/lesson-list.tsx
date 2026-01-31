"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { spanishLessons, languages } from "@/lib/data"
import {
  BookOpen,
  MessageSquare,
  Headphones,
  Mic,
  FileText,
  Play,
  Lock,
  Check,
  Clock,
  Zap,
} from "lucide-react"

const lessonTypeIcons: Record<string, typeof BookOpen> = {
  vocabulary: BookOpen,
  grammar: MessageSquare,
  listening: Headphones,
  speaking: Mic,
  reading: FileText,
}

const lessonTypeColors: Record<string, string> = {
  vocabulary: "bg-primary/10 text-primary",
  grammar: "bg-chart-3/10 text-chart-3",
  listening: "bg-accent/10 text-accent",
  speaking: "bg-chart-5/10 text-chart-5",
  reading: "bg-chart-4/10 text-chart-4",
}

export function LessonList() {
  const [activeLesson, setActiveLesson] = useState<string | null>(null)
  const currentLanguage = languages[0]

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {currentLanguage.name} Lessons
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{currentLanguage.currentUnit}</p>
          </div>
          <Badge variant="outline" className="gap-1">
            <Check className="h-3 w-3" />
            {spanishLessons.filter((l) => l.isCompleted).length}/{spanishLessons.length} Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {spanishLessons.map((lesson, index) => {
            const Icon = lessonTypeIcons[lesson.type]
            const colorClass = lessonTypeColors[lesson.type]
            const isActive = activeLesson === lesson.id

            return (
              <div
                key={lesson.id}
                className={`relative flex items-center gap-4 rounded-xl border p-4 transition-all ${
                  lesson.isLocked
                    ? "border-border bg-muted/30 opacity-60"
                    : lesson.isCompleted
                    ? "border-accent/50 bg-accent/5"
                    : isActive
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                {/* Connector Line */}
                {index < spanishLessons.length - 1 && (
                  <div className="absolute left-[2.35rem] top-[4.5rem] h-3 w-0.5 bg-border" />
                )}

                {/* Icon */}
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorClass}`}>
                  {lesson.isLocked ? (
                    <Lock className="h-5 w-5" />
                  ) : lesson.isCompleted ? (
                    <Check className="h-5 w-5 text-accent" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">{lesson.title}</h3>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {lesson.type}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {lesson.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      +{lesson.xpReward} XP
                    </span>
                  </div>
                </div>

                {/* Action */}
                {!lesson.isLocked && (
                  <Button
                    size="sm"
                    variant={lesson.isCompleted ? "outline" : "default"}
                    className="gap-1"
                    onClick={() => setActiveLesson(lesson.id)}
                  >
                    {lesson.isCompleted ? (
                      "Review"
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" />
                        Start
                      </>
                    )}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
