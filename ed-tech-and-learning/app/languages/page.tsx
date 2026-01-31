import { Navigation } from "@/components/navigation"
import { LanguageSelector } from "@/components/languages/language-selector"
import { LessonList } from "@/components/languages/lesson-list"
import { LanguageStats } from "@/components/languages/language-stats"

export default function LanguagesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Language Learning</h1>
          <p className="mt-1 text-muted-foreground">
            Master new languages with interactive lessons and practice
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <LanguageSelector />
            <LessonList />
          </div>
          <div>
            <LanguageStats />
          </div>
        </div>
      </main>
    </div>
  )
}
