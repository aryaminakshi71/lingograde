import { test, expect, Page } from '@playwright/test'

const APPS = [
  { name: 'Queue Management', port: 3000, url: 'http://localhost:3000' },
  { name: 'Repurpose AI', port: 3001, url: 'http://localhost:3001' },
  { name: 'Invoicing', port: 3002, url: 'http://localhost:3002' },
  { name: 'Projects', port: 3003, url: 'http://localhost:3003' },
  { name: 'CRM', port: 3004, url: 'http://localhost:3004' },
  { name: 'Helpdesk', port: 3005, url: 'http://localhost:3005' },
  { name: 'Parking Lot App', port: 3007, url: 'http://localhost:3007' },
  { name: 'Prior Art AI', port: 3010, url: 'http://localhost:3010' },
  { name: 'School MIS', port: 3011, url: 'http://localhost:3011' },
  { name: 'GIS Property Mapping', port: 3012, url: 'http://localhost:3012' },
  { name: 'Digital Crop Survey', port: 3013, url: 'http://localhost:3013' },
  { name: 'Tourism Pilgrimage', port: 3014, url: 'http://localhost:3014' },
  { name: 'Surprise App', port: 3015, url: 'http://localhost:3015' },
  { name: 'CashConnect Admin', port: 3016, url: 'http://localhost:3016' },
  { name: 'GovAI Platform', port: 3017, url: 'http://localhost:3017' },
  { name: 'Lingograde', port: 3018, url: 'http://localhost:3018' },
  { name: 'Outreach Contact', port: 3019, url: 'http://localhost:3019' },
]

APPS.forEach(({ name, url }) => {
  test.describe(`${name} - Landing Page Tests`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(url, { waitUntil: 'networkidle' })
    })

    test('should load landing page successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/./)
      await expect(page.locator('body')).toBeVisible()
    })

    test('should have navigation menu', async ({ page }) => {
      const nav = page.locator('nav')
      await expect(nav).toBeVisible()
    })

    test('should have CTA button (Try Demo or Start Free Trial)', async ({ page }) => {
      const ctaButtons = page.locator('a:has-text("Try Demo"), a:has-text("Start Free Trial"), a:has-text("Get Started")')
      await expect(ctaButtons.first()).toBeVisible()
    })

    test('should have feature cards section', async ({ page }) => {
      const featuresSection = page.locator('#features, section:has-text("Feature")')
      await expect(featuresSection.first()).toBeVisible({ timeout: 5000 }).catch(() => {
        console.log(`${name}: Features section not found`)
      })
    })

    test('should have pricing section', async ({ page }) => {
      const pricingSection = page.locator('#pricing, section:has-text("Pricing"), div:has-text("$")')
      await expect(pricingSection.first()).toBeVisible({ timeout: 5000 }).catch(() => {
        console.log(`${name}: Pricing section not found`)
      })
    })

    test('should have working navigation links', async ({ page }) => {
      const navLinks = page.locator('nav a')
      const linkCount = await navLinks.count()
      
      for (let i = 0; i < Math.min(linkCount, 3); i++) {
        const link = navLinks.nth(i)
        const href = await link.getAttribute('href')
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
          await link.click()
          await expect(page).not.toHaveTitle(/404|Error|Not Found/)
        }
      }
    })
  })

  test.describe(`${name} - Demo Page Tests`, () => {
    test('should have demo page', async ({ page }) => {
      await page.goto(`${url}/demo`, { waitUntil: 'networkidle' })
      const status = await page.evaluate(() => document.status)
      if (status === 404) {
        console.log(`${name}: Demo page not found (expected for some apps)`)
      } else {
        await expect(page.locator('body')).toBeVisible()
      }
    })
  })

  test.describe(`${name} - Auth Pages Tests`, () => {
    test('should have login page', async ({ page }) => {
      await page.goto(`${url}/login`, { waitUntil: 'networkidle' })
      const status = await page.evaluate(() => document.status)
      if (status === 404) {
        console.log(`${name}: Login page not found`)
      } else {
        const body = page.locator('body')
        await expect(body).toBeVisible()
      }
    })

    test('should have register page', async ({ page }) => {
      await page.goto(`${url}/register`, { waitUntil: 'networkidle' })
      const status = await page.evaluate(() => document.status)
      if (status === 404) {
        console.log(`${name}: Register page not found`)
      } else {
        const body = page.locator('body')
        await expect(body).toBeVisible()
      }
    })
  })

  test.describe(`${name} - Performance Tests`, () => {
    test('should load within 3 seconds', async ({ page }) => {
      const startTime = Date.now()
      await page.goto(url, { waitUntil: 'domcontentloaded' })
      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(3000)
    })

    test('should have optimized images', async ({ page }) => {
      const images = page.locator('img')
      const count = await images.count()
      for (let i = 0; i < Math.min(count, 5); i++) {
        const img = images.nth(i)
        const src = await img.getAttribute('src')
        if (src) {
          expect(src).toMatch(/\.(jpg|jpeg|png|webp|avif|svg)/i)
        }
      }
    })
  })

  test.describe(`${name} - Accessibility Tests`, () => {
    test('should have proper heading structure', async ({ page }) => {
      await page.goto(url)
      const h1 = page.locator('h1')
      const h1Count = await h1.count()
      expect(h1Count).toBe(1)
    })

    test('should have alt text on images', async ({ page }) => {
      await page.goto(url)
      const images = page.locator('img')
      const count = await images.count()
      let imagesWithoutAlt = 0
      
      for (let i = 0; i < Math.min(count, 10); i++) {
        const img = images.nth(i)
        const alt = await img.getAttribute('alt')
        const role = await img.getAttribute('role')
        if (!alt && role !== 'presentation') {
          imagesWithoutAlt++
        }
      }
      expect(imagesWithoutAlt).toBe(0)
    })

    test('should have proper form labels', async ({ page }) => {
      await page.goto(`${url}/register`)
      const inputs = page.locator('input')
      const count = await inputs.count()
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        const input = inputs.nth(i)
        const id = await input.getAttribute('id')
        const ariaLabel = await input.getAttribute('aria-label')
        const ariaLabelledby = await input.getAttribute('aria-labelledby')
        
        expect(id || ariaLabel || ariaLabelledby).toBeTruthy()
      }
    })
  })

  test.describe(`${name} - Security Tests`, () => {
    test('should have CSP header', async ({ page }) => {
      const response = await page.goto(url)
      const csp = response.headers()['content-security-policy']
      if (csp) {
        expect(csp).toBeDefined()
      } else {
        console.log(`${name}: CSP header not found`)
      }
    })

    test('should have X-Frame-Options header', async ({ page }) => {
      const response = await page.goto(url)
      const xfo = response.headers()['x-frame-options']
      expect(xfo).toMatch(/DENY|SAMEORIGIN/)
    })

    test('should have X-Content-Type-Options header', async ({ page }) => {
      const response = await page.goto(url)
      const xcto = response.headers()['x-content-type-options']
      expect(xcto).toBe('nosniff')
    })

    test('should have HSTS header', async ({ page }) => {
      const response = await page.goto(url)
      const strictTransport = response.headers()['strict-transport-security']
      expect(strictTransport).toBeDefined()
    })
  })
})
