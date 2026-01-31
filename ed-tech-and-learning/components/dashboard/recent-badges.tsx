import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { currentUser } from "@/lib/data"
import { Award, Star, Flame, Zap, Globe } from "lucide-react"

const iconMap: Record<string, typeof Star> = {
  star: Star,
  flame: Flame,
  zap: Zap,
  globe: Globe,
}

export function RecentBadges() {
  const recentBadges = currentUser.badges.slice(0, 4)

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Award className="h-5 w-5 text-chart-3" />
          Recent Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {recentBadges.map((badge) => {
            const Icon = iconMap[badge.icon] || Star
            return (
              <div
                key={badge.id}
                className="flex flex-col items-center rounded-xl bg-muted/50 p-3 text-center transition-colors hover:bg-muted"
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-chart-3/10">
                  <Icon className="h-5 w-5 text-chart-3" />
                </div>
                <p className="text-sm font-medium text-foreground">{badge.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{badge.description}</p>
              </div>
            )
          })}
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Total badges earned: <span className="font-semibold text-foreground">{currentUser.badges.length}</span>
        </p>
      </CardContent>
    </Card>
  )
}
