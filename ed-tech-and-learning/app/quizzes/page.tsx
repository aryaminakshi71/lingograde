import { Navigation } from "@/components/navigation"
import { QuizList } from "@/components/quizzes/quiz-list"
import { QuizStats } from "@/components/quizzes/quiz-stats"

export default function QuizzesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Quizzes & Assessments</h1>
          <p className="mt-1 text-muted-foreground">
            Test your knowledge and earn XP with interactive quizzes
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <QuizList />
          </div>
          <div>
            <QuizStats />
          </div>
        </div>
      </main>
    </div>
  )
}
