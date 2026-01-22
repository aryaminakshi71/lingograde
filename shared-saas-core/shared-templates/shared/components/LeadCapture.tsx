'use client'

import { useState } from 'react'
import { ArrowRight, Check, X, Loader2 } from 'lucide-react'

interface LeadCaptureFormProps {
  title?: string
  subtitle?: string
  buttonText?: string
  placeholder?: string
  successMessage?: string
  variant?: 'inline' | 'popup' | 'sidebar'
  position?: 'bottom-left' | 'bottom-right' | 'center'
  showIcon?: boolean
  onSubmit?: (email: string) => Promise<void>
}

export function LeadCaptureForm({
  title = 'Get Started Free',
  subtitle = 'Join thousands of users and transform your business today.',
  buttonText = 'Start Free Trial',
  placeholder = 'Enter your work email',
  successMessage = 'Thanks! Check your inbox for next steps.',
  variant = 'inline',
  position = 'bottom-right',
  showIcon = true,
  onSubmit,
}: LeadCaptureFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(true)

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setStatus('loading')
    setError('')

    try {
      if (onSubmit) {
        await onSubmit(email)
      } else {
        const response = await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: process.env.NEXT_PUBLIC_MARKETING_EMAIL || 'marketing@example.com',
            subject: `New Lead: ${email}`,
            template: 'marketing',
            data: { email, source: 'landing_page' },
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to submit')
        }
      }

      setStatus('success')
      setEmail('')

      setTimeout(() => {
        setStatus('idle')
        setIsVisible(true)
      }, 5000)
    } catch (err) {
      setStatus('error')
      setError('Something went wrong. Please try again.')
    }
  }

  if (!isVisible && variant === 'popup') {
    return null
  }

  const popupStyles = {
    'bottom-right': 'fixed bottom-6 right-6 z-50',
    'bottom-left': 'fixed bottom-6 left-6 z-50',
    center: 'fixed bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-50',
  }

  if (variant === 'popup') {
    return (
      <div className={`${popupStyles[position]} transition-all duration-300`}>
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 max-w-sm">
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>

          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-900 font-medium">{successMessage}</p>
            </div>
          ) : (
            <>
              {showIcon && (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm mb-4">{subtitle}</p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    disabled={status === 'loading'}
                  />
                  {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {buttonText} <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-3">
                No credit card required. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
      <div className="max-w-2xl mx-auto text-center">
        {showIcon && (
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ArrowRight className="w-8 h-8 text-white" />
          </div>
        )}

        {status === 'success' ? (
          <div className="py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h3>
            <p className="text-gray-600">{successMessage}</p>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">{subtitle}</p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-lg"
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {buttonText} <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-500" /> Free 14-day trial
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-500" /> No credit card
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-500" /> Cancel anytime
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function NewsletterSignup({
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
}: {
  placeholder?: string
  buttonText?: string
}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setStatus('success')
    setEmail('')

    setTimeout(() => setStatus('idle'), 3000)
  }

  if (status === 'success') {
    return (
      <div className="text-center py-4">
        <span className="text-green-600 font-medium">✓ Thanks for subscribing!</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        required
        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
      >
        {status === 'loading' ? '...' : buttonText}
      </button>
    </form>
  )
}
