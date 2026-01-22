import { test, expect } from '@playwright/test'

test.describe('App E2E Tests', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/./)
  })
})
