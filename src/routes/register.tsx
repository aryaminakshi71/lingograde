import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { RegisterPage } from '@shared/saas-core'
import { useMutation } from '@tanstack/react-query'
import { orpc } from '../lib/orpc-query'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/register')({
  component: Register,
})

function Register() {
  const navigate = useNavigate()

  const registerMutation = useMutation(
    orpc.auth.register.mutationOptions({
      onSuccess: (data) => {
        toast.success('Registration successful!')
        navigate({ to: '/dashboard' })
      },
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : 'Registration failed'
        console.error('Registration error:', error)
        toast.error(errorMessage)
      },
    })
  )

  const handleRegister = async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    await registerMutation.mutateAsync({
      email: data.email,
      password: data.password,
      fullName: `${data.firstName} ${data.lastName}`.trim(),
    })
    return true
  }

  return (
    <RegisterPage
      appName="LingoGrade"
      themeColor="#10b981"
      themeColorSecondary="#14b8a6"
      dashboardHref="/dashboard"
      loginHref="/login"
      demoHref="/demo"
      onRegister={handleRegister}
    />
  )
}
