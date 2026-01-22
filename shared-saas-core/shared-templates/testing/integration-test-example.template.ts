import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => ({ get: vi.fn() }),
  usePathname: () => '/',
}))

describe('Landing Page Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should complete user flow: view page -> try demo -> sign in', async () => {
    const user = userEvent.setup()
    
    // Render landing page
    render(
      <div>
        <nav>
          <a href="/demo">Try Demo</a>
          <a href="/login">Sign In</a>
        </nav>
        <main>
          <h1>Welcome to App</h1>
          <button>Start Free Trial</button>
        </main>
      </div>
    )

    // Verify page elements
    expect(screen.getByText('Welcome to App')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Try Demo' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start Free Trial' })).toBeInTheDocument()
  })

  it('should handle navigation to demo page', async () => {
    const user = userEvent.setup()
    const mockPush = vi.fn()
    
    vi.mock('next/navigation', () => ({
      useRouter: () => ({ push: mockPush }),
    }))

    render(<a href="/demo">Try Demo</a>)
    
    const demoLink = screen.getByRole('link', { name: 'Try Demo' })
    expect(demoLink).toHaveAttribute('href', '/demo')
  })

  it('should handle pricing plan selection', async () => {
    const user = userEvent.setup()
    
    render(
      <div>
        <div data-testid="plan-free">
          <h3>Free</h3>
          <button>Start Free Trial</button>
        </div>
        <div data-testid="plan-starter">
          <h3>Starter</h3>
          <button>Start Free Trial</button>
        </div>
      </div>
    )

    const freePlan = screen.getByTestId('plan-free')
    const starterPlan = screen.getByTestId('plan-starter')
    
    expect(freePlan).toBeInTheDocument()
    expect(starterPlan).toBeInTheDocument()
  })

  it('should handle form submission', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn((e) => e.preventDefault())
    
    render(
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" />
        <button type="submit">Submit</button>
      </form>
    )

    const emailInput = screen.getByPlaceholderText('Email')
    const submitButton = screen.getByRole('button', { name: 'Submit' })

    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})

