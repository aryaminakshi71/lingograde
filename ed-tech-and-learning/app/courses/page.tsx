import { Navigation } from "@/components/navigation"
import { CourseFilters } from "@/components/courses/course-filters"
import { CourseGrid } from "@/components/courses/course-grid"
import { FeaturedCourse } from "@/components/courses/featured-course"

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Course Marketplace</h1>
          <p className="mt-1 text-muted-foreground">
            Discover skill-based courses from expert instructors
          </p>
        </div>

        <FeaturedCourse />

        <div className="mt-8">
          <CourseFilters />
          <CourseGrid />
        </div>
      </main>
    </div>
  )
}
