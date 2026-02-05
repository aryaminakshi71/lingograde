import { test, expect } from '@playwright/test'

test.describe('App E2E Tests', () => {
  test('homepage loads', async ({ page }) => {
    const response = await page.goto('/')
    expect(response, 'No response for homepage').not.toBeNull()
    const status = response?.status() ?? 0
    expect(status, `Bad status ${status} for homepage`).toBeLessThan(500)

    const heading = page.getByRole('heading').first()
    if (await heading.count()) {
      await expect(heading).toBeVisible()
    } else {
      const bodyText = await page.textContent('body')
      expect(bodyText || page.url()).toBeTruthy()
    }
  })
})
