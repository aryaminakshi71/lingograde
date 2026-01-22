import { test, expect } from '@playwright/test'

test.describe('Landing Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load landing page', async ({ page }) => {
    await expect(page).toHaveTitle(/./)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should display navigation header', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Try Demo' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible()
  })

  test('should navigate to demo page', async ({ page }) => {
    await page.getByRole('link', { name: 'Try Demo' }).click()
    await expect(page).toHaveURL(/.*demo/)
  })

  test('should navigate to login page', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign In' }).click()
    await expect(page).toHaveURL(/.*login/)
  })

  test('should display pricing plans', async ({ page }) => {
    const plans = ['Free', 'Starter', 'Professional', 'Enterprise']
    
    for (const plan of plans) {
      await expect(page.getByText(plan)).toBeVisible()
    }
  })

  test('should display features section', async ({ page }) => {
    await expect(page.getByText(/features/i)).toBeVisible()
  })

  test('should handle Start Free Trial button', async ({ page }) => {
    const trialButton = page.getByRole('link', { name: /start free trial/i }).first()
    await expect(trialButton).toBeVisible()
    await trialButton.click()
    await expect(page).toHaveURL(/.*register|.*signup/)
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('link', { name: 'Try Demo' })).toBeVisible()
  })
})

test.describe('Authentication Flow E2E Tests', () => {
  test('should complete registration flow', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /start free trial/i }).first().click()
    
    // Fill registration form
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'Test123!@#')
    await page.fill('input[name="firstName"]', 'Test')
    await page.fill('input[name="lastName"]', 'User')
    
    // Submit form
    await page.getByRole('button', { name: /register|sign up/i }).click()
    
    // Should redirect to dashboard or show success message
    await expect(page).toHaveURL(/.*dashboard|.*success/, { timeout: 10000 })
  })

  test('should handle login flow', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'Test123!@#')
    await page.getByRole('button', { name: /sign in|login/i }).click()
    
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 })
  })
})

test.describe('Performance Tests', () => {
  test('should load page within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime
    
    expect(loadTime).toBeLessThan(3000) // 3 seconds
  })

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.goto('/')
    expect(errors).toHaveLength(0)
  })
})

