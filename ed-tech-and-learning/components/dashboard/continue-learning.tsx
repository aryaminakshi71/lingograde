import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { courses, languages } from "@/lib/data"
import { ArrowRight, BookOpen, Globe, Play } from "lucide-react"

export function ContinueLearning() {
  const inProgressCourses = courses.filter((c) => c.progress && c.progress > 0 && c.progress < 100)
  const inProgressLanguages = languages.filter((l) => l.progress > 0 && l.progress < 100)

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5 text-primary" />
          Continue Learning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Languages in Progress */}
        {inProgressLanguages.slice(0, 2).map((language) => (
          <Link key={language.id} href="/languages" className="block">
            <div className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Globe className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary">
                      {language.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{language.currentUnit}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={language.progress} className="h-2 flex-1" />
                  <span className="text-sm font-medium text-muted-foreground">{language.progress}%</span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* Courses in Progress */}
        {inProgressCourses.slice(0, 2).map((course) => (
          <Link key={course.id} href="/courses" className="block">
            <div className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm">
              <div className="relative h-14 w-20 overflow-hidden rounded-lg">
                <Image
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{course.instructor}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={course.progress} className="h-2 flex-1" />
                  <span className="text-sm font-medium text-muted-foreground">{course.progress}%</span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {inProgressCourses.length === 0 && inProgressLanguages.length === 0 && (
          <div className="py-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2 text-muted-foreground">No courses in progress</p>
            <Button asChild className="mt-4">
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
