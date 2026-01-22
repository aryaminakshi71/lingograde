import { test, expect } from '@playwright/test'

test.describe('Security Tests', () => {
  const apps = [
    { name: 'CRM', url: 'http://localhost:3000' },
    { name: 'Helpdesk', url: 'http://localhost:3005' },
    { name: 'Invoicing', url: 'http://localhost:3002' },
    { name: 'Projects', url: 'http://localhost:3003' },
    { name: 'Repurpose AI', url: 'http://localhost:3001' },
  ]

  apps.forEach(({ name, url }) => {
    test(`${name} - Security Headers`, async ({ page }) => {
      const response = await page.goto(url)
      const headers = response.headers()

      expect(headers['x-content-type-options']).toBe('nosniff')
      expect(headers['x-frame-options']).toMatch(/DENY|SAMEORIGIN/)
      expect(headers['x-xss-protection']).toBeDefined()
      
      const csp = headers['content-security-policy']
      if (csp) {
        expect(csp).toContain("default-src")
        expect(csp).toContain("script-src")
      }
    })

    test(`${name} - No Sensitive Data in URL`, async ({ page }) => {
      await page.goto(`${url}/login`)
      
      const url = page.url()
      expect(url).not.toContain('password')
      expect(url).not.toContain('token')
      expect(url).not.toContain('secret')
    })

    test(`${name} - SQL Injection Prevention`, async ({ page }) => {
      const maliciousInputs = [
        "' OR '1'='1",
        "'; DROP TABLE users;--",
        "1; SELECT * FROM users",
        "admin'--",
        "UNION SELECT 1,2,3--",
      ]

      for (const input of maliciousInputs) {
        await page.goto(`${url}/login`)
        const emailInput = page.locator('input[type="email"], input[name="email"]')
        const passwordInput = page.locator('input[type="password"], input[name="password"]')
        
        if (await emailInput.isVisible()) {
          await emailInput.fill(input)
          await passwordInput.fill('test1234')
          
          await page.click('button[type="submit"]')
          
          await expect(page).not.toHaveTitle(/SQL|Error|database/i)
        }
      }
    })

    test(`${name} - XSS Prevention`, async ({ page }) => {
      const xssPayloads = [
        '<script>alert("xss")</script>',
        '<img src=x onerror=alert("xss")>',
        '<svg onload=alert("xss")>',
        'javascript:alert("xss")',
        '{{constructor.constructor("alert(1)")()}}',
      ]

      for (const payload of xssPayloads) {
        await page.goto(`${url}/contact`)
        
        const nameInput = page.locator('input[name="name"], input[id="name"]')
        const messageInput = page.locator('textarea[name="message"], textarea[id="message"]')
        
        if (await nameInput.isVisible()) {
          await nameInput.fill(payload)
          
          if (await messageInput.isVisible()) {
            await messageInput.fill('Test message')
          }
          
          await page.click('button[type="submit"]')
          
          const pageContent = await page.content()
          expect(pageContent).not.toContain('<script>alert')
        }
      }
    })

    test(`${name} - CSRF Protection`, async ({ page }) => {
      const response = await page.goto(url)
      const cookies = await page.context().cookies()
      
      const sessionCookies = cookies.filter(c => 
        c.name.includes('session') || 
        c.name.includes('auth') ||
        c.name.includes('token')
      )

      for (const cookie of sessionCookies) {
        expect(cookie.secure).toBe(true)
        expect(cookie.sameSite).toMatch(/strict|lax/)
      }
    })

    test(`${name} - Authentication Bypass Prevention`, async ({ page }) => {
      const protectedRoutes = ['/dashboard', '/settings', '/admin']
      
      for (const route of protectedRoutes) {
        await page.goto(`${url}${route}`, { waitUntil: 'networkidle' })
        
        const currentUrl = page.url()
        if (!currentUrl.includes('/login') && !currentUrl.includes('/register')) {
          const pageContent = await page.content()
          expect(pageContent).not.toContain('Access Denied')
          expect(pageContent).not.toContain('Unauthorized')
        }
      }
    })

    test(`${name} - Rate Limiting Indicators`, async ({ page }) => {
      for (let i = 0; i < 10; i++) {
        await page.goto(`${url}/login`)
      }
      
      const pageContent = await page.content()
      expect(pageContent).not.toContain('Rate limit exceeded')
    })

    test(`${name} - Secure Cookie Attributes`, async ({ page }) => {
      await page.goto(`${url}/login`)
      
      await page.fill('input[type="email"]', 'test@example.com')
      await page.fill('input[type="password"]', 'testpassword123')
      await page.click('button[type="submit"]')
      
      await page.waitForTimeout(1000)
      
      const cookies = await page.context().cookies()
      const authCookies = cookies.filter(c => 
        c.name.includes('access') || 
        c.name.includes('session')
      )

      for (const cookie of authCookies) {
        expect(cookie.httpOnly).toBe(true)
      }
    })
  })
})

test.describe('Vulnerability Scanning', () => {
  test('should not expose internal paths', async ({ page }) => {
    const internalPaths = [
      '/.env',
      '/.git',
      '/server-status',
      '/phpmyadmin',
      '/admin/db',
      '/config.php',
      '/wp-admin',
      '/.well-known/security.txt',
    ]

    for (const path of internalPaths) {
      const response = await page.goto(`http://localhost:3000${path}`, { waitUntil: 'domcontentloaded' })
      
      expect(response.status()).not.toBe(200)
      expect(response.status()).toBeGreaterThanOrEqual(400)
    }
  })

  test('should not expose stack traces', async ({ page }) => {
    await page.goto('http://localhost:3000/api/nonexistent-endpoint')
    
    const content = await page.content()
    expect(content).not.toContain('undefined is not a function')
    expect(content).not.toContain('ReferenceError')
    expect(content).not.toContain('SyntaxError')
  })
})
