"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { tutors } from "@/lib/data"
import { Star, MessageSquare, Calendar, Clock, Video } from "lucide-react"

export function TutorList() {
  return (
    <div className="space-y-4">
      {tutors.map((tutor) => (
        <Card key={tutor.id} className="overflow-hidden border-border transition-all hover:border-primary/50 hover:shadow-md">
          <CardContent className="p-0">
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-xl sm:mx-0">
                  <Image
                    src={tutor.avatar || "/placeholder.svg"}
                    alt={tutor.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{tutor.name}</h3>
                    <div className="mt-1 flex flex-wrap justify-center gap-1 sm:justify-start">
                      {tutor.specialty.map((spec) => (
                        <Badge key={spec} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-1 sm:justify-end">
                    <Star className="h-4 w-4 fill-chart-3 text-chart-3" />
                    <span className="font-semibold text-foreground">{tutor.rating}</span>
                    <span className="text-sm text-muted-foreground">({tutor.reviewsCount})</span>
                  </div>
                </div>

                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{tutor.bio}</p>

                <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground sm:justify-start">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {tutor.lessonsCompleted.toLocaleString()} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {tutor.responseTime}
                  </span>
                  <span className="flex items-center gap-1 text-foreground">
                    Speaks: {tutor.languages.join(", ")}
                  </span>
                </div>

                {/* Availability */}
                <div className="mt-3 flex flex-wrap justify-center gap-1 sm:justify-start">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <span
                      key={day}
                      className={`flex h-7 w-7 items-center justify-center rounded text-xs font-medium ${
                        tutor.availability.includes(day)
                          ? "bg-accent/10 text-accent"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {day.charAt(0)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex flex-col items-center justify-center gap-3 border-t border-border pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    ${tutor.hourlyRate}
                  </div>
                  <div className="text-xs text-muted-foreground">per hour</div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" className="gap-1">
                    <Calendar className="h-4 w-4" />
                    Book Session
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                    <Video className="h-4 w-4" />
                    Trial Lesson
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
