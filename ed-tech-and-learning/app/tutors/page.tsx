import { Navigation } from "@/components/navigation"
import { TutorFilters } from "@/components/tutors/tutor-filters"
import { TutorList } from "@/components/tutors/tutor-list"
import { BookingInfo } from "@/components/tutors/booking-info"

export default function TutorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Find a Tutor</h1>
          <p className="mt-1 text-muted-foreground">
            Connect with expert tutors for personalized 1-on-1 learning sessions
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <TutorFilters />
            <TutorList />
          </div>
          <div>
            <BookingInfo />
          </div>
        </div>
      </main>
    </div>
  )
}
