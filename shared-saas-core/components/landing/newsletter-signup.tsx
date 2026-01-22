// Newsletter Signup Component - Unified across all apps

'use client'

import * as React from 'react'
import {ArrowRight, Loader2, Check, AlertCircle} from 'lucide-react'
import {Button} from '../ui/button'
import {Input} from '../ui/input'
import {Alert, AlertDescription} from '../ui/alert'
import {cn} from '../../lib/index'

interface NewsletterSignupProps {
  title?: string
  description?: string
  placeholder?: string
  buttonText?: string
  themeColor?: string
  showSocialProof?: boolean
  socialProofText?: string
  className?: string
  onSubmit?: (email: string) => Promise<void>
}

export function NewsletterSignup({
  title = 'Stay Updated',
  description = 'Get the latest updates, tips, and insights delivered to your inbox.',
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  themeColor = '#3b82f6',
  showSocialProof = true,
  socialProofText = 'Join 10,000+ subscribers',
  className,
  onSubmit,
}: NewsletterSignupProps) {
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) return

    setStatus('loading')
    setErrorMessage('')

    try {
      if (onSubmit) {
        await onSubmit(email)
      } else {
        // Default behavior - call API
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email}),
        })

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error?.message || 'Failed to subscribe')
        }
      }

      setStatus('success')
      setEmail('')

      // Reset after 5 seconds
      setTimeout(() => setStatus('idle'), 5000)
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className={cn('text-center py-8', className)}>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{backgroundColor: `${themeColor}15`}}
        >
          <Check className="w-8 h-8" style={{color: themeColor}} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Thanks for subscribing!
        </h3>
        <p className="text-gray-600">
          Check your inbox for a confirmation email.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('w-full max-w-lg mx-auto', className)}>
      {/* Title & Description */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          disabled={status === 'loading'}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={status === 'loading'}
          style={{backgroundColor: themeColor}}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Subscribing...
            </>
          ) : (
            <>
              {buttonText}
              <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      {/* Error */}
      {status === 'error' && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p>{errorMessage}</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Social Proof */}
      {showSocialProof && (
        <p className="text-sm text-gray-500 text-center mt-4">
          {socialProofText}
        </p>
      )}

      {/* Privacy note */}
      <p className="text-xs text-gray-400 text-center mt-3">
        No spam, unsubscribe anytime. Read our{' '}
        <a href="/privacy" className="underline hover:text-gray-600">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  )
}
