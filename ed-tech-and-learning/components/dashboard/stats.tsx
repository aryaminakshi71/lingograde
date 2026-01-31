import { Card, CardContent } from "@/components/ui/card"
import { currentUser } from "@/lib/data"
import { BookOpen, Clock, Award, Target } from "lucide-react"

const stats = [
  {
    label: "Lessons Completed",
    value: currentUser.lessonsCompleted,
    icon: BookOpen,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Learning Minutes",
    value: currentUser.totalLearningMinutes.toLocaleString(),
    icon: Clock,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    label: "Courses Completed",
    value: currentUser.coursesCompleted,
    icon: Award,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    label: "Current Level",
    value: currentUser.level,
    icon: Target,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="border-border">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
