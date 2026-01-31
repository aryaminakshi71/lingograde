import { Navigation } from "@/components/navigation"
import { DashboardStats } from "@/components/dashboard/stats"
import { StreakCard } from "@/components/dashboard/streak-card"
import { LevelProgress } from "@/components/dashboard/level-progress"
import { ContinueLearning } from "@/components/dashboard/continue-learning"
import { RecommendedCourses } from "@/components/dashboard/recommended-courses"
import { RecentBadges } from "@/components/dashboard/recent-badges"
import { WeeklyGoal } from "@/components/dashboard/weekly-goal"
import { currentUser } from "@/lib/data"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {currentUser.name.split(" ")[0]}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            Keep up the great work. You&apos;re making amazing progress.
          </p>
        </div>

        {/* Stats Grid */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="space-y-6 lg:col-span-2">
            <ContinueLearning />
            <RecommendedCourses />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <StreakCard />
            <LevelProgress />
            <WeeklyGoal />
            <RecentBadges />
          </div>
        </div>
      </main>
    </div>
  )
}
