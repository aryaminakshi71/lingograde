"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { courses } from "@/lib/data"
import { Star, Users, Clock, Play, BookOpen } from "lucide-react"

export function CourseGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.id} className="group overflow-hidden border-border transition-all hover:border-primary/50 hover:shadow-lg">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={course.thumbnail || "/placeholder.svg"}
              alt={course.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            {course.isFree && (
              <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">
                Free
              </Badge>
            )}
            {course.progress !== undefined && course.progress > 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <div className="flex items-center gap-2">
                  <Progress value={course.progress} className="h-1.5 flex-1" />
                  <span className="text-xs font-medium text-white">{course.progress}%</span>
                </div>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
              <Button size="sm" className="gap-1">
                <Play className="h-4 w-4" />
                {course.progress ? "Continue" : "Preview"}
              </Button>
            </div>
          </div>

          <CardContent className="p-4">
            {/* Category & Level */}
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary">{course.category}</Badge>
              <Badge variant="outline">{course.level}</Badge>
            </div>

            {/* Title */}
            <h3 className="line-clamp-2 font-semibold text-foreground group-hover:text-primary">
              {course.title}
            </h3>

            {/* Instructor */}
            <div className="mt-2 flex items-center gap-2">
              <Image
                src={course.instructorAvatar || "/placeholder.svg"}
                alt={course.instructor}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="text-sm text-muted-foreground">{course.instructor}</span>
            </div>

            {/* Stats */}
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-chart-3 text-chart-3" />
                <span className="font-medium text-foreground">{course.rating}</span>
                ({course.reviewsCount.toLocaleString()})
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {course.studentsCount.toLocaleString()}
              </span>
            </div>

            {/* Duration & Lessons */}
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                {course.lessonsCount} lessons
              </span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              {course.isFree ? (
                <span className="text-lg font-bold text-accent">Free</span>
              ) : (
                <span className="text-lg font-bold text-foreground">${course.price}</span>
              )}
              <Button size="sm" variant={course.progress ? "outline" : "default"}>
                {course.progress ? "Continue" : "Enroll Now"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
