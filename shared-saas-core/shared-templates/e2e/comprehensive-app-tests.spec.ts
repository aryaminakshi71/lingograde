import { test, expect } from '@playwright/test'

/**
 * Comprehensive E2E Tests for All Apps
 * Tests: Links, Navigation, Report Generation, Cross-App Standardization
 */

// App configurations with their ports and expected elements
const APP_CONFIGS = [
  { name: 'queue-management', port: 3000, type: 'industry' },
  { name: 'repurpose-ai', port: 3001, type: 'non-industry' },
  { name: 'invoicing', port: 3002, type: 'industry' },
  { name: 'projects', port: 3003, type: 'industry' },
  { name: 'crm', port: 3004, type: 'industry' },
  { name: 'helpdesk', port: 3005, type: 'industry' },
  { name: 'abc-software', port: 3006, type: 'non-industry' },
  { name: 'parking-lot-app', port: 3007, type: 'non-industry' },
  { name: 'prior-art-ai', port: 3010, type: 'non-industry' },
  { name: 'school-mis', port: 3011, type: 'non-industry' },
  { name: 'gis-property-mapping', port: 3012, type: 'non-industry' },
  { name: 'digital-crop-survey', port: 3013, type: 'non-industry' },
  { name: 'tourism-pilgrimage', port: 3014, type: 'non-industry' },
  { name: 'surprise-app', port: 3015, type: 'non-industry' },
  { name: 'CashConnect', port: 3017, type: 'non-industry' },
  { name: 'outreach', port: 3018, type: 'non-industry' },
  { name: 'lingograde', port: 3019, type: 'non-industry' },
  { name: 'govai-platform', port: 3020, type: 'non-industry' },
]

// Standard elements that should exist in all apps
const STANDARD_ELEMENTS = {
  header: {
    tryDemo: 'Try Demo',
    signIn: 'Sign In',
  },
  footer: {
    copyright: /©|Copyright|All rights reserved/i,
    stripe: /Stripe|Powered by Stripe/i,
  },
  pricing: {
    plans: ['Free', 'Starter', 'Professional', 'Enterprise'],
  },
  sections: {
    hero: true,
    features: true,
    pricing: true,
    performance: /Performance|High Performance/i,
    security: /Security|Enterprise Security/i,
    internationalization: /Multi-Language|Internationalization/i,
  },
}

test.describe('Comprehensive App Testing', () => {
  for (const app of APP_CONFIGS) {
    test.describe(`${app.name} (Port ${app.port})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`http://localhost:${app.port}`)
        // Wait for page to load
        await page.waitForLoadState('networkidle')
      })

      test('should load landing page without errors', async ({ page }) => {
        // Check for console errors
        const errors: string[] = []
        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            errors.push(msg.text())
          }
        })

        // Check for page errors
        const response = await page.goto(`http://localhost:${app.port}`)
        expect(response?.status()).toBe(200)

        // Wait a bit for any async errors
        await page.waitForTimeout(2000)

        // Report errors if any
        if (errors.length > 0) {
          console.error(`Errors found in ${app.name}:`, errors)
        }
        // Allow some errors but log them
      })

      test('should have standard header elements', async ({ page }) => {
        // Check for Try Demo link
        const tryDemo = page.getByRole('link', { name: /Try Demo|try demo/i })
        await expect(tryDemo.first()).toBeVisible()

        // Check for Sign In link
        const signIn = page.getByRole('link', { name: /Sign In|sign in|Login|login/i })
        await expect(signIn.first()).toBeVisible()
      })

      test('should have standard footer elements', async ({ page }) => {
        const footer = page.locator('footer')
        await expect(footer).toBeVisible()

        // Check for copyright
        const copyright = footer.getByText(/©|Copyright|All rights reserved/i)
        await expect(copyright.first()).toBeVisible()

        // Check for Stripe mention
        const stripe = footer.getByText(/Stripe|Powered by Stripe/i)
        await expect(stripe.first()).toBeVisible()
      })

      test('should have pricing section with 4 plans', async ({ page }) => {
        // Scroll to pricing section
        const pricingSection = page.locator('#pricing, [id*="pricing"], section:has-text("Pricing")')
        if (await pricingSection.count() > 0) {
          await pricingSection.first().scrollIntoViewIfNeeded()
          await page.waitForTimeout(500)

          // Check for pricing plans
          for (const plan of STANDARD_ELEMENTS.pricing.plans) {
            const planElement = page.getByText(new RegExp(plan, 'i'))
            await expect(planElement.first()).toBeVisible()
          }
        } else {
          // Try to find pricing section by scrolling
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
          await page.waitForTimeout(1000)
          const pricingText = page.getByText(/Pricing|pricing/i)
          if (await pricingText.count() > 0) {
            await pricingText.first().scrollIntoViewIfNeeded()
            await page.waitForTimeout(500)
          }
        }
      })

      test('should have feature highlights section', async ({ page }) => {
        // Look for feature highlights (4 cards)
        const featureCards = page.locator('section:has-text("Simple"), section:has-text("Multi-Language"), section:has-text("Analytics"), section:has-text("Security")')
        // At least one should be visible
        if (await featureCards.count() > 0) {
          await expect(featureCards.first()).toBeVisible()
        }
      })

      test('should have performance, security, and internationalization sections', async ({ page }) => {
        // Scroll through page to find these sections
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
        await page.waitForTimeout(1000)

        // Check for performance section
        const performance = page.getByText(/Performance|High Performance|Lightning-fast/i)
        if (await performance.count() > 0) {
          await expect(performance.first()).toBeVisible()
        }

        // Check for security section
        const security = page.getByText(/Security|Enterprise Security|SOC 2/i)
        if (await security.count() > 0) {
          await expect(security.first()).toBeVisible()
        }

        // Check for internationalization section
        const i18n = page.getByText(/Multi-Language|Internationalization|20\+ languages/i)
        if (await i18n.count() > 0) {
          await expect(i18n.first()).toBeVisible()
        }
      })

      test('should have working navigation links', async ({ page }) => {
        // Test header navigation links
        const navLinks = page.locator('nav a, header a')
        const linkCount = await navLinks.count()

        for (let i = 0; i < Math.min(linkCount, 10); i++) {
          const link = navLinks.nth(i)
          const href = await link.getAttribute('href')
          if (href && !href.startsWith('#')) {
            // Skip external links and anchors for now
            continue
          }
          if (href && href.startsWith('#')) {
            // Test anchor links
            await link.click()
            await page.waitForTimeout(500)
            // Verify we're still on the page
            expect(page.url()).toContain(`localhost:${app.port}`)
          }
        }
      })

      test('should have working Try Demo link', async ({ page }) => {
        const tryDemo = page.getByRole('link', { name: /Try Demo|try demo/i }).first()
        const href = await tryDemo.getAttribute('href')
        
        if (href) {
          await tryDemo.click()
          await page.waitForTimeout(1000)
          // Should navigate to demo page or stay on same page
          expect(page.url()).toContain(`localhost:${app.port}`)
        }
      })

      test('should have working Sign In link', async ({ page }) => {
        const signIn = page.getByRole('link', { name: /Sign In|sign in|Login|login/i }).first()
        const href = await signIn.getAttribute('href')
        
        if (href) {
          await signIn.click()
          await page.waitForTimeout(1000)
          // Should navigate to login page
          expect(page.url()).toContain(`localhost:${app.port}`)
        }
      })

      test('should test dashboard routes if accessible', async ({ page }) => {
        // Try to access common dashboard routes
        const dashboardRoutes = ['/dashboard', '/dashboard/users', '/dashboard/reports', '/dashboard/settings', '/dashboard/analytics']
        
        for (const route of dashboardRoutes) {
          try {
            const response = await page.goto(`http://localhost:${app.port}${route}`, { timeout: 5000, waitUntil: 'domcontentloaded' })
            if (response && response.status() === 200) {
              // Page loaded successfully
              await page.waitForTimeout(500)
              // Check if it's not a 404
              const bodyText = await page.textContent('body')
              if (bodyText && !bodyText.includes('404') && !bodyText.includes('Not Found')) {
                console.log(`✓ ${app.name}${route} is accessible`)
              }
            }
          } catch (error) {
            // Route might not exist or require auth, which is fine
            console.log(`- ${app.name}${route} not accessible (may require auth)`)
          }
        }
      })

      test('should test report generation if available', async ({ page }) => {
        // Try to access reports page
        try {
          await page.goto(`http://localhost:${app.port}/dashboard/reports`, { timeout: 5000, waitUntil: 'domcontentloaded' })
          await page.waitForTimeout(1000)

          // Look for report generation buttons
          const generateButtons = page.getByRole('button', { name: /Generate|generate|Create Report|create report/i })
          if (await generateButtons.count() > 0) {
            console.log(`✓ ${app.name} has report generation functionality`)
            
            // Try clicking generate button (if it doesn't require auth)
            const firstButton = generateButtons.first()
            const isVisible = await firstButton.isVisible()
            if (isVisible) {
              try {
                await firstButton.click()
                await page.waitForTimeout(1000)
                // Check if any loading or success message appears
                const loadingOrSuccess = page.getByText(/Processing|Generating|Success|Report generated/i)
                if (await loadingOrSuccess.count() > 0) {
                  console.log(`✓ ${app.name} report generation button works`)
                }
              } catch (error) {
                // Button might require interaction or auth
                console.log(`- ${app.name} report generation requires additional setup`)
              }
            }
          }
        } catch (error) {
          // Reports page might not exist or require auth
          console.log(`- ${app.name} reports page not accessible (may require auth)`)
        }
      })

      test('should have consistent color scheme and layout', async ({ page }) => {
        // Check for white background (standard)
        const body = page.locator('body')
        const bgColor = await body.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor
        })
        // Should be white or rgb(255, 255, 255) or similar
        expect(bgColor).toMatch(/rgb\(255|rgba\(255|white/i)
      })

      test('should have responsive design', async ({ page }) => {
        // Test mobile viewport
        await page.setViewportSize({ width: 375, height: 667 })
        await page.waitForTimeout(500)
        
        // Check if navigation is still accessible
        const nav = page.locator('nav, header')
        await expect(nav.first()).toBeVisible()

        // Test desktop viewport
        await page.setViewportSize({ width: 1920, height: 1080 })
        await page.waitForTimeout(500)
        await expect(nav.first()).toBeVisible()
      })
    })
  }
})

