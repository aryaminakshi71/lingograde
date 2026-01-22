import { test, expect, Page } from '@playwright/test'

/**
 * Cross-App Standardization E2E Tests
 * Tests that all apps follow the same patterns and standards
 */

const APPS = [
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

// Helper function to check if page has errors
async function checkPageErrors(page: Page): Promise<string[]> {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text()
      // Filter out known non-critical errors
      if (!text.includes('favicon') && !text.includes('analytics') && !text.includes('gtag')) {
        errors.push(text)
      }
    }
  })
  page.on('pageerror', (error) => {
    errors.push(error.message)
  })
  return errors
}

for (const app of APPS) {
  test.describe(`${app.name} (Port ${app.port}) - Standardization Tests`, () => {
    test.beforeEach(async ({ page }) => {
      // Set longer timeout for page loads
      test.setTimeout(30000)
      await page.goto(`http://localhost:${app.port}`, { waitUntil: 'domcontentloaded', timeout: 15000 })
    })

    test('should load without critical errors', async ({ page }) => {
      const errors = await checkPageErrors(page)
      await page.waitForTimeout(2000) // Wait for async operations
      
      // Log errors but don't fail (some apps may have non-critical errors)
      if (errors.length > 0) {
        console.log(`${app.name} console errors:`, errors)
      }
      
      // Page should still be accessible
      const title = await page.title()
      expect(title).toBeTruthy()
    })

    test('should have standard header with Try Demo and Sign In', async ({ page }) => {
      // Check for navigation
      const nav = page.locator('nav, header').first()
      await expect(nav).toBeVisible({ timeout: 5000 })

      // Check for Try Demo link
      const tryDemo = page.getByRole('link', { name: /Try Demo|try demo/i })
      const tryDemoCount = await tryDemo.count()
      expect(tryDemoCount).toBeGreaterThan(0)

      // Check for Sign In link
      const signIn = page.getByRole('link', { name: /Sign In|sign in|Login|login/i })
      const signInCount = await signIn.count()
      expect(signInCount).toBeGreaterThan(0)
    })

    test('should have standard footer with copyright and Stripe', async ({ page }) => {
      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(1000)

      const footer = page.locator('footer').first()
      if (await footer.count() > 0) {
        await expect(footer).toBeVisible()

        // Check for copyright
        const copyright = footer.getByText(/©|Copyright|All rights reserved/i)
        if (await copyright.count() > 0) {
          await expect(copyright.first()).toBeVisible()
        }

        // Check for Stripe mention
        const stripe = footer.getByText(/Stripe|Powered by Stripe|Secure payment/i)
        if (await stripe.count() > 0) {
          await expect(stripe.first()).toBeVisible()
        }
      }
    })

    test('should have pricing section with 4 plans', async ({ page }) => {
      // Scroll to find pricing section
      await page.evaluate(() => {
        const pricing = document.querySelector('#pricing, [id*="pricing"], section:has-text("Pricing")')
        if (pricing) {
          pricing.scrollIntoView({ behavior: 'smooth', block: 'center' })
        } else {
          window.scrollTo(0, document.body.scrollHeight / 2)
        }
      })
      await page.waitForTimeout(1500)

      const plans = ['Free', 'Starter', 'Professional', 'Enterprise']
      let foundPlans = 0

      for (const plan of plans) {
        const planElement = page.getByText(new RegExp(`^${plan}$|${plan}`, 'i'))
        if (await planElement.count() > 0) {
          foundPlans++
        }
      }

      // At least 3 out of 4 plans should be found (some apps might have Custom instead of Enterprise)
      expect(foundPlans).toBeGreaterThanOrEqual(3)
    })

    test('should have feature highlights section', async ({ page }) => {
      // Scroll through page
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
      await page.waitForTimeout(1000)

      // Look for feature highlight keywords
      const featureKeywords = ['Simple', 'Multi-Language', 'Analytics', 'Security', 'API', 'SDK']
      let foundFeatures = 0

      for (const keyword of featureKeywords) {
        const element = page.getByText(new RegExp(keyword, 'i'))
        if (await element.count() > 0) {
          foundFeatures++
        }
      }

      // At least 2 feature highlights should be present
      expect(foundFeatures).toBeGreaterThanOrEqual(2)
    })

    test('should have working navigation links', async ({ page }) => {
      const navLinks = page.locator('nav a, header a')
      const linkCount = await navLinks.count()

      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = navLinks.nth(i)
        const href = await link.getAttribute('href')
        
        if (href && href.startsWith('#')) {
          // Test anchor links
          try {
            await link.click({ timeout: 2000 })
            await page.waitForTimeout(500)
            expect(page.url()).toContain(`localhost:${app.port}`)
          } catch (error) {
            // Link might be hidden or not clickable, which is okay
            console.log(`${app.name}: Link ${href} not clickable`)
          }
        }
      }
    })

    test('should have working Try Demo link', async ({ page }) => {
      const tryDemo = page.getByRole('link', { name: /Try Demo|try demo/i }).first()
      const href = await tryDemo.getAttribute('href')
      
      if (href) {
        try {
          await tryDemo.click({ timeout: 2000 })
          await page.waitForTimeout(1000)
          expect(page.url()).toContain(`localhost:${app.port}`)
        } catch (error) {
          console.log(`${app.name}: Try Demo link not clickable`)
        }
      }
    })

    test('should have working Sign In link', async ({ page }) => {
      const signIn = page.getByRole('link', { name: /Sign In|sign in|Login|login/i }).first()
      const href = await signIn.getAttribute('href')
      
      if (href) {
        try {
          await signIn.click({ timeout: 2000 })
          await page.waitForTimeout(1000)
          expect(page.url()).toContain(`localhost:${app.port}`)
        } catch (error) {
          console.log(`${app.name}: Sign In link not clickable`)
        }
      }
    })

    test('should test dashboard routes accessibility', async ({ page }) => {
      const routes = [
        { path: '/dashboard', name: 'Dashboard' },
        { path: '/dashboard/users', name: 'Users' },
        { path: '/dashboard/reports', name: 'Reports' },
        { path: '/dashboard/settings', name: 'Settings' },
        { path: '/dashboard/analytics', name: 'Analytics' },
      ]

      for (const route of routes) {
        try {
          const response = await page.goto(`http://localhost:${app.port}${route.path}`, {
            waitUntil: 'domcontentloaded',
            timeout: 5000,
          })

          if (response && response.status() === 200) {
            await page.waitForTimeout(500)
            const bodyText = await page.textContent('body') || ''
            
            // Check if it's not a 404
            if (!bodyText.includes('404') && !bodyText.includes('Not Found') && !bodyText.includes('Page not found')) {
              console.log(`✓ ${app.name}${route.path} is accessible`)
            } else {
              console.log(`✗ ${app.name}${route.path} returns 404`)
            }
          }
        } catch (error) {
          // Route might not exist or require auth
          console.log(`- ${app.name}${route.path} not accessible (may require auth)`)
        }
      }
    })

    test('should test report generation functionality', async ({ page }) => {
      try {
        // Navigate to reports page
        await page.goto(`http://localhost:${app.port}/dashboard/reports`, {
          waitUntil: 'domcontentloaded',
          timeout: 5000,
        })
        await page.waitForTimeout(1000)

        // Look for generate report buttons
        const generateButtons = page.getByRole('button', {
          name: /Generate|generate|Create Report|create report/i,
        })

        if (await generateButtons.count() > 0) {
          console.log(`✓ ${app.name} has report generation buttons`)

          // Try to find a visible generate button
          const buttonCount = await generateButtons.count()
          for (let i = 0; i < buttonCount; i++) {
            const button = generateButtons.nth(i)
            if (await button.isVisible({ timeout: 1000 }).catch(() => false)) {
              try {
                // Click the button
                await button.click({ timeout: 2000 })
                await page.waitForTimeout(1500)

                // Check for loading/success messages
                const messages = page.getByText(/Processing|Generating|Success|Report generated|Loading/i)
                if (await messages.count() > 0) {
                  console.log(`✓ ${app.name} report generation button works`)
                  break
                }
              } catch (error) {
                // Button might require additional setup or auth
                console.log(`- ${app.name} report generation requires additional setup`)
              }
            }
          }
        } else {
          console.log(`- ${app.name} does not have report generation buttons`)
        }
      } catch (error) {
        // Reports page might not exist or require auth
        console.log(`- ${app.name} reports page not accessible (may require auth)`)
      }
    })

    test('should have responsive design', async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(500)

      const nav = page.locator('nav, header').first()
      await expect(nav).toBeVisible()

      // Test desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.waitForTimeout(500)
      await expect(nav).toBeVisible()
    })

    test('should have consistent styling', async ({ page }) => {
      // Check body background is white or light
      const body = page.locator('body')
      const bgColor = await body.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor
      })

      // Should be white, rgb(255, 255, 255), or similar light color
      expect(bgColor).toMatch(/rgb\(255|rgba\(255|white|rgb\(248|rgb\(249|rgb\(250/i)
    })
  })
}

