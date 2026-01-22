import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { DemoPage } from '@shared/saas-core'
import { orpc } from '../lib/orpc-query'

export const Route = createFileRoute('/demo')({
  beforeLoad: async () => {
    // Check if user is authenticated
    try {
      const session = await orpc.auth.getSession.query()
      if (!session) {
        throw redirect({ to: '/login', search: { redirect: '/demo' } })
      }
    } catch (error) {
      // If it's a redirect, rethrow it
      if (error && typeof error === 'object' && 'to' in error) {
        throw error
      }
      // Otherwise redirect to login
      throw redirect({ to: '/login', search: { redirect: '/demo' } })
    }
  },
  component: Demo,
})

function Demo() {
  const navigate = useNavigate()

  const handleStartDemo = async () => {
    // Navigate to dashboard - user is already authenticated
    navigate({ to: '/dashboard' })
  }

  return (
    <DemoPage
      appName="LingoGrade"
      appDescription="Explore AI-powered lessons and progress tracking."
      themeColor="#10b981"
      themeColorSecondary="#14b8a6"
      dashboardHref="/dashboard"
      features={[
        'Sample lessons across multiple languages',
        'AI-powered pronunciation feedback',
        'Progress tracking with milestones',
        'Gamified streaks and achievements',
      ]}
      onStartDemo={handleStartDemo}
    />
  )
}
