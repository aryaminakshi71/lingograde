import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { courses } from "@/lib/data"
import { ArrowRight, Clock, Star, Users, Sparkles } from "lucide-react"

export function RecommendedCourses() {
  // Get courses that haven't been started
  const recommendedCourses = courses.filter((c) => !c.progress).slice(0, 3)

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-chart-3" />
          Recommended for You
        </CardTitle>
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link href="/courses">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedCourses.map((course) => (
            <Link key={course.id} href="/courses" className="group block">
              <div className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-md">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {course.isFree && (
                    <Badge className="absolute left-2 top-2 bg-accent text-accent-foreground">
                      Free
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <Badge variant="secondary" className="mb-2">
                    {course.category}
                  </Badge>
                  <h3 className="line-clamp-2 font-semibold text-foreground group-hover:text-primary">
                    {course.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{course.instructor}</p>
                  
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-chart-3 text-chart-3" />
                      {course.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {course.studentsCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {course.duration}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    {course.isFree ? (
                      <span className="font-semibold text-accent">Free</span>
                    ) : (
                      <span className="font-semibold text-foreground">${course.price}</span>
                    )}
                    <Badge variant="outline">{course.level}</Badge>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
