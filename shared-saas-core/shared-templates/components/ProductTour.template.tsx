'use client'

import { useState, useEffect } from 'react'
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride'

interface ProductTourProps {
  steps: Step[]
  run?: boolean
  continuous?: boolean
  showProgress?: boolean
  showSkipButton?: boolean
}

export default function ProductTour({ 
  steps, 
  run = true, 
  continuous = true,
  showProgress = true,
  showSkipButton = true
}: ProductTourProps) {
  const [runTour, setRunTour] = useState(false)

  useEffect(() => {
    // Check if user has seen the tour
    const hasSeenTour = localStorage.getItem('hasSeenTour')
    if (!hasSeenTour && run) {
      // Delay to ensure page is loaded
      setTimeout(() => setRunTour(true), 1000)
    }
  }, [run])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data
    
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      localStorage.setItem('hasSeenTour', 'true')
      setRunTour(false)
    }
  }

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous={continuous}
      showProgress={showProgress}
      showSkipButton={showSkipButton}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#3b82f6',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 8,
        },
        buttonNext: {
          backgroundColor: '#3b82f6',
          borderRadius: 6,
        },
        buttonBack: {
          color: '#6b7280',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip tour',
      }}
    />
  )
}

