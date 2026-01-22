# Testing Setup Guide

This directory contains testing templates and configurations for all apps.

## Test Structure

```
app-name/
├── src/
│   ├── __tests__/
│   │   ├── setup/
│   │   │   └── vitest-setup.ts
│   │   ├── unit/
│   │   │   └── *.test.ts
│   │   ├── integration/
│   │   │   └── *.test.ts
│   │   └── *.test.tsx
│   └── ...
├── e2e/
│   └── *.spec.ts
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

## Test Types

### Unit Tests
- Test individual components and functions in isolation
- Located in `src/__tests__/unit/`
- Fast execution, no external dependencies

### Integration Tests
- Test component interactions and workflows
- Located in `src/__tests__/integration/`
- May include API mocks and state management

### E2E Tests
- Test complete user flows in a real browser
- Located in `e2e/`
- Uses Playwright for cross-browser testing

## Running Tests

```bash
# Run all tests
npm run test:all

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Test Configuration

### Vitest (Unit & Integration)
- Configuration: `vitest.config.ts`
- Setup file: `src/__tests__/setup/vitest-setup.ts`
- Coverage threshold: 60% for lines, functions, branches, statements

### Playwright (E2E)
- Configuration: `playwright.config.ts`
- Tests multiple browsers: Chrome, Firefox, Safari
- Mobile testing: Pixel 5, iPhone 12

## Best Practices

1. **Unit Tests**: Test one thing at a time, keep tests simple and fast
2. **Integration Tests**: Test user workflows and component interactions
3. **E2E Tests**: Test critical user paths end-to-end
4. **Coverage**: Aim for 60%+ coverage on critical paths
5. **Naming**: Use descriptive test names that explain what is being tested

## Test Examples

See the template files:
- `unit-test-example.template.ts` - Unit test examples
- `integration-test-example.template.ts` - Integration test examples
- `e2e-test-example.template.ts` - E2E test examples

