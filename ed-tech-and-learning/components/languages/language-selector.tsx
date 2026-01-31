"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { languages } from "@/lib/data"
import { Globe, Plus, Check } from "lucide-react"

const flagColors: Record<string, string> = {
  ES: "bg-red-500",
  FR: "bg-blue-500",
  JP: "bg-red-600",
  DE: "bg-foreground",
}

export function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].id)

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Your Languages
        </CardTitle>
        <Button variant="outline" size="sm" className="gap-1 bg-transparent">
          <Plus className="h-4 w-4" />
          Add Language
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {languages.map((language) => {
            const isSelected = selectedLanguage === language.id
            const isStarted = language.progress > 0

            return (
              <button
                key={language.id}
                onClick={() => setSelectedLanguage(language.id)}
                className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${flagColors[language.flag]} text-white font-bold`}>
                  {language.flag}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{language.name}</h3>
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                  </div>
                  {isStarted ? (
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Progress value={language.progress} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground">{language.progress}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {language.lessonsCompleted}/{language.totalLessons} lessons
                      </p>
                    </div>
                  ) : (
                    <Badge variant="secondary" className="mt-1">
                      Start Learning
                    </Badge>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
