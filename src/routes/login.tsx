import { createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router'
import { LoginPage } from '@shared/saas-core'
import { useMutation } from '@tanstack/react-query'
import { orpc } from '../lib/orpc-query'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || undefined,
    }
  },
  component: Login,
})

function Login() {
  const navigate = useNavigate()
  const { redirect } = useSearch({ from: '/login' })

  const loginMutation = useMutation(
    orpc.auth.login.mutationOptions({
      onSuccess: (data) => {
        toast.success('Login successful!')
        navigate({ to: redirect || '/dashboard' })
      },
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.'
        console.error('Login error:', error)
        toast.error(errorMessage)
      },
    })
  )

  const handleLogin = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password })
    return true
  }

  return (
    <LoginPage
      appName="LingoGrade"
      themeColor="#10b981"
      themeColorSecondary="#14b8a6"
      dashboardHref="/dashboard"
      registerHref="/register"
      demoHref="/demo"
      onLogin={handleLogin}
    />
  )
}
