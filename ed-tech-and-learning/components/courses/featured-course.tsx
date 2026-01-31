import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { courses } from "@/lib/data"
import { Star, Users, Clock, Play } from "lucide-react"

export function FeaturedCourse() {
  const featured = courses[0] // Web Development Bootcamp

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-border">
      <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8 lg:p-10">
        {/* Content */}
        <div className="flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">Featured</Badge>
            <Badge variant="secondary">{featured.category}</Badge>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground md:text-3xl text-balance">
            {featured.title}
          </h2>
          
          <p className="text-muted-foreground line-clamp-2">
            {featured.description}
          </p>

          <div className="flex items-center gap-2">
            <Image
              src={featured.instructorAvatar || "/placeholder.svg"}
              alt={featured.instructor}
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-sm text-foreground">{featured.instructor}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-chart-3 text-chart-3" />
              <span className="font-medium text-foreground">{featured.rating}</span>
              ({featured.reviewsCount.toLocaleString()} reviews)
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {featured.studentsCount.toLocaleString()} students
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {featured.duration}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {featured.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button size="lg" className="gap-2">
              <Play className="h-4 w-4" />
              Start Learning
            </Button>
            <div>
              <span className="text-2xl font-bold text-foreground">${featured.price}</span>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative aspect-video overflow-hidden rounded-xl md:aspect-auto md:h-full">
          <Image
            src={featured.thumbnail || "/placeholder.svg"}
            alt={featured.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-110">
              <Play className="h-6 w-6 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
