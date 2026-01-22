# Comprehensive Testing Implementation Guide

This guide provides step-by-step instructions for implementing unit, integration, and E2E testing across all apps.

## Overview

All apps should have:
1. **Unit Tests** - Test individual components and functions
2. **Integration Tests** - Test component interactions and workflows
3. **E2E Tests** - Test complete user flows in browsers

## Step 1: Setup Test Configuration

### For each app, ensure you have:

1. **vitest.config.ts** - Copy from `shared-templates/testing/vitest.config.template.ts`
2. **playwright.config.ts** - Copy from `shared-templates/testing/playwright.config.template.ts` (update port)
3. **src/__tests__/setup/vitest-setup.ts** - Copy from `shared-templates/testing/vitest-setup.template.ts`

## Step 2: Create Test Directory Structure

```bash
app-name/
├── src/
│   └── __tests__/
│       ├── setup/
│       │   └── vitest-setup.ts
│       ├── unit/
│       │   ├── landing-page.test.tsx
│       │   ├── components/
│       │   └── utils/
│       ├── integration/
│       │   └── user-flows.test.tsx
│       └── *.test.tsx
└── e2e/
    ├── landing-page.spec.ts
    ├── auth-flow.spec.ts
    └── app.spec.ts
```

## Step 3: Install Dependencies

Ensure these are in `package.json` devDependencies:

```json
{
  "devDependencies": {
    "@playwright/test": "^1.57.0",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.1",
    "@testing-library/user-event": "^14.5.1",
    "@vitejs/plugin-react": "^4.2.1",
    "@vitest/coverage-v8": "^1.2.0",
    "jsdom": "^23.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vitest": "^1.2.0"
  }
}
```

## Step 4: Add Test Scripts to package.json

Add these scripts to each app's `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ci": "vitest run --coverage --reporter=json",
    "test:unit": "vitest run src/__tests__/unit",
    "test:integration": "vitest run src/__tests__/integration",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:all": "npm run test && npm run test:integration && npm run test:e2e"
  }
}
```

## Step 5: Create Test Files

### Unit Test Example

Create `src/__tests__/unit/landing-page.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LandingPage from '@/app/page'

describe('LandingPage Unit Tests', () => {
  it('should render page title', async () => {
    render(<LandingPage />)
    await waitFor(() => {
      expect(screen.getByRole('heading')).toBeInTheDocument()
    })
  })
})
```

### Integration Test Example

Create `src/__tests__/integration/user-flows.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('User Flow Integration Tests', () => {
  it('should complete registration flow', async () => {
    const user = userEvent.setup()
    // Test implementation
  })
})
```

### E2E Test Example

Create `e2e/landing-page.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Landing Page E2E', () => {
  test('should load page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/./)
  })
})
```

## Step 6: Update Playwright Config Port

For each app, update the port in `playwright.config.ts`:

- queue-management: 3000
- repurpose-ai: 3001
- tourism-pilgrimage: 3014
- prior-art-ai: 3010
- projects: 3003
- crm: 3004
- invoicing: 3005
- helpdesk: 3006
- parking-lot-app: 3007
- surprise-app: 3017
- outreach: 3018
- digital-crop-survey: 3013
- gis-property-mapping: 3012
- school-mis: 3011
- lingograde: 3019
- govai-platform: 3020
- abc-software: 3015
- CashConnect: 3008

## Step 7: Run Tests

```bash
# Run all tests
npm run test:all

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## Test Coverage Goals

- **Unit Tests**: 60%+ coverage on components and utilities
- **Integration Tests**: All critical user workflows
- **E2E Tests**: All critical user paths

## Common Test Patterns

### Testing Navigation
```typescript
test('should navigate to demo', async ({ page }) => {
  await page.getByRole('link', { name: 'Try Demo' }).click()
  await expect(page).toHaveURL(/.*demo/)
})
```

### Testing Forms
```typescript
test('should submit form', async ({ page }) => {
  await page.fill('input[name="email"]', 'test@example.com')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByText('Success')).toBeVisible()
})
```

### Testing Authentication
```typescript
test('should login user', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expect(page).toHaveURL(/.*dashboard/)
})
```

## CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Run Tests
  run: |
    npm run test:ci
    npm run test:e2e
```

## Troubleshooting

1. **Tests failing**: Check that all mocks are properly set up
2. **E2E tests timing out**: Increase timeout in playwright.config.ts
3. **Coverage not generating**: Ensure @vitest/coverage-v8 is installed
4. **Port conflicts**: Update port in playwright.config.ts for each app

## Next Steps

1. Apply this setup to all apps
2. Write tests for critical paths first
3. Gradually increase coverage
4. Set up CI/CD pipeline
5. Monitor test results and fix failures

