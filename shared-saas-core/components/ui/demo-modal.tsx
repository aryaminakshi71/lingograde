'use client'

import * as React from 'react'
import { Button } from './button'

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
  appName: string
  demoContent?: React.ReactNode
}

export const DemoModal: React.FC<DemoModalProps> = ({
  isOpen,
  onClose,
  appName,
  demoContent,
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentStep, setCurrentStep] = React.useState(0)

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  React.useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false)
      setCurrentStep(0)
    }
  }, [isOpen])

  if (!isOpen) return null

  const defaultDemoSteps = [
    {
      title: 'Welcome to ' + appName,
      description: 'Discover the powerful features that make this platform unique.',
      image: '🎯',
    },
    {
      title: 'Real-Time Updates',
      description: 'Experience instant updates and live collaboration features.',
      image: '⚡',
    },
    {
      title: 'Advanced Analytics',
      description: 'Get insights with comprehensive dashboards and reports.',
      image: '📊',
    },
    {
      title: 'AI-Powered Features',
      description: 'Leverage artificial intelligence for smarter workflows.',
      image: '🤖',
    },
  ]

  const steps = demoContent ? [] : defaultDemoSteps

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setCurrentStep(0)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      setCurrentStep(steps.length - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="bg-slate-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">
            {appName} Demo
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close demo"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {demoContent ? (
            demoContent
          ) : (
            <div className="text-center">
              <div className="text-8xl mb-6 animate-bounce">
                {steps[currentStep]?.image}
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                {steps[currentStep]?.title}
              </h3>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {steps[currentStep]?.description}
              </p>
              
              <div className="mt-8 bg-slate-800 rounded-lg p-8 border border-slate-700">
                <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold">Interactive Demo Video</p>
                    <p className="text-white text-sm opacity-75 mt-2">
                      Experience the full power of {appName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-slate-700">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-blue-600' : 'bg-slate-600'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={handlePrev}
              disabled={steps.length === 0}
            >
              Previous
            </Button>
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={steps.length === 0}
            >
              {currentStep === steps.length - 1 ? 'Restart' : 'Next'}
            </Button>
            <Button variant="primary" onClick={onClose}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
