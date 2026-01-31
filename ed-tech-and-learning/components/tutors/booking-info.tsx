import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, MessageCircle, Shield, Award, Clock } from "lucide-react"

export function BookingInfo() {
  return (
    <div className="space-y-6">
      {/* How It Works */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              1
            </div>
            <div>
              <p className="font-medium text-foreground">Find Your Tutor</p>
              <p className="text-sm text-muted-foreground">Browse profiles and reviews</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              2
            </div>
            <div>
              <p className="font-medium text-foreground">Book a Session</p>
              <p className="text-sm text-muted-foreground">Choose a time that works for you</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              3
            </div>
            <div>
              <p className="font-medium text-foreground">Start Learning</p>
              <p className="text-sm text-muted-foreground">Connect via video call</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Why Book With Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
              <Video className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">HD Video Calls</p>
              <p className="text-xs text-muted-foreground">Crystal clear sessions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <MessageCircle className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Direct Messaging</p>
              <p className="text-xs text-muted-foreground">Chat with your tutor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-3/10">
              <Shield className="h-4 w-4 text-chart-3" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Money-Back Guarantee</p>
              <p className="text-xs text-muted-foreground">100% satisfaction</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-4/10">
              <Award className="h-4 w-4 text-chart-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Verified Tutors</p>
              <p className="text-xs text-muted-foreground">All tutors are screened</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-5/10">
              <Clock className="h-4 w-4 text-chart-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Flexible Scheduling</p>
              <p className="text-xs text-muted-foreground">Book anytime</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="p-4 text-center">
          <p className="font-semibold text-foreground">Not sure where to start?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a free trial lesson with any tutor
          </p>
          <Button className="mt-4 w-full">Browse Free Trials</Button>
        </CardContent>
      </Card>
    </div>
  )
}
