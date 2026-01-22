import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Example: Landing Page Component Test
describe('LandingPage Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render landing page title', () => {
    render(<div><h1>App Name</h1></div>)
    expect(screen.getByText('App Name')).toBeInTheDocument()
  })

  it('should render navigation links', () => {
    render(
      <nav>
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
      </nav>
    )
    expect(screen.getByRole('link', { name: 'Features' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Pricing' })).toBeInTheDocument()
  })

  it('should render Try Demo and Sign In buttons', () => {
    render(
      <div>
        <a href="/demo">Try Demo</a>
        <a href="/login">Sign In</a>
      </div>
    )
    expect(screen.getByRole('link', { name: 'Try Demo' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument()
  })

  it('should render pricing plans', () => {
    const plans = ['Free', 'Starter', 'Professional', 'Enterprise']
    render(
      <div>
        {plans.map(plan => <h3 key={plan}>{plan}</h3>)}
      </div>
    )
    plans.forEach(plan => {
      expect(screen.getByText(plan)).toBeInTheDocument()
    })
  })

  it('should handle button clicks', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<button onClick={handleClick}>Click Me</button>)
    await user.click(screen.getByRole('button', { name: 'Click Me' }))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})

// Example: Utility Function Tests
describe('Utility Functions', () => {
  it('should validate email format', () => {
    const validateEmail = (email: string) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }
    
    expect(validateEmail('test@example.com')).toBe(true)
    expect(validateEmail('invalid-email')).toBe(false)
    expect(validateEmail('test@')).toBe(false)
  })

  it('should format currency', () => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
    }
    
    expect(formatCurrency(100)).toBe('$100.00')
    expect(formatCurrency(29.99)).toBe('$29.99')
  })

  it('should sanitize user input', () => {
    const sanitizeInput = (input: string) => {
      return input.replace(/[<>]/g, '')
    }
    
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script')
    expect(sanitizeInput('normal text')).toBe('normal text')
  })
})

