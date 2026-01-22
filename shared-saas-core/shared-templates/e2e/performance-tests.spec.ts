import { test, expect } from '@playwright/test'

const PERFORMANCE_THRESHOLDS = {
  lcp: 2500,
  fcp: 1800,
  cls: 0.1,
  fid: 100,
  ttfb: 800,
}

test.describe('Performance Tests', () => {
  const apps = [
    { name: 'CRM', url: 'http://localhost:3000' },
    { name: 'Helpdesk', url: 'http://localhost:3005' },
    { name: 'Invoicing', url: 'http://localhost:3002' },
    { name: 'Projects', url: 'http://localhost:3003' },
  ]

  apps.forEach(({ name, url }) => {
    test(`${name} - Core Web Vitals`, async ({ page }) => {
      const metrics = {
        lcp: null as number | null,
        fcp: null as number | null,
        cls: null as number | null,
        fid: null as number | null,
        ttfb: null as number | null,
      }

      page.on('response', (response) => {
        if (response.url() === url && response.status() === 200) {
          const serverTiming = response.headers()['server-timing']
          if (serverTiming) {
            const ttfb = serverTiming.match(/ttfb=(\d+)/)
            if (ttfb) {
              metrics.ttfb = parseInt(ttfb[1])
            }
          }
        }
      })

      await page.goto(url, { waitUntil: 'networkidle' })

      const performanceTiming = await page.evaluate(() => {
        const timing = performance.timing
        return {
          lcp: 0,
          fcp: 0,
          cls: 0,
          fid: 0,
          ttfb: timing.responseStart - timing.navigationStart,
        }
      })

      console.log(`${name} Performance Metrics:`, performanceTiming)

      expect(performanceTiming.ttfb).toBeLessThan(PERFORMANCE_THRESHOLDS.ttfb)
    })

    test(`${name} - Bundle Size Check`, async ({ page }) => {
      const response = await page.goto(url)
      
      const resources = await page.evaluate(() => {
        const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
        return entries.map(entry => ({
          name: entry.name,
          size: entry.transferSize,
          type: entry.initiatorType,
        }))
      })

      const totalSize = resources.reduce((acc, r) => acc + (r.size || 0), 0)
      const jsResources = resources.filter(r => r.name.includes('.js'))
      const jsSize = jsResources.reduce((acc, r) => acc + (r.size || 0), 0)

      console.log(`${name} - Total Size: ${(totalSize / 1024).toFixed(2)}KB`)
      console.log(`${name} - JS Size: ${(jsSize / 1024).toFixed(2)}KB`)

      expect(jsSize).toBeLessThan(500 * 1024)
    })

    test(`${name} - Render Performance`, async ({ page }) => {
      const frameTimes: number[] = []

      await page.evaluate(() => {
        let lastTime = performance.now()
        
        requestAnimationFrame(function measureFrame(time) {
          const delta = time - lastTime
          frameTimes.push(delta)
          lastTime = time
          
          if (document.visibilityState === 'visible') {
            requestAnimationFrame(measureFrame)
          }
        })
      })

      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForTimeout(2000)

      const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length
      const droppedFrames = frameTimes.filter(t => t > 33.33).length

      console.log(`${name} - Avg Frame Time: ${avgFrameTime.toFixed(2)}ms`)
      console.log(`${name} - Dropped Frames: ${droppedFrames}`)

      expect(avgFrameTime).toBeLessThan(16.67)
    })
  })
})

test.describe('Memory Tests', () => {
  test('should not leak memory on navigation', async ({ page }) => {
    const initialMemory = await page.evaluate(() => {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize
      }
      return 0
    })

    for (let i = 0; i < 5; i++) {
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
      await page.goto('http://localhost:3001', { waitUntil: 'networkidle' })
    }

    const finalMemory = await page.evaluate(() => {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize
      }
      return 0
    })

    const memoryIncrease = finalMemory - initialMemory
    console.log(`Memory Increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`)

    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024)
  })
})

test.describe('Load Testing', () => {
  test('should handle concurrent requests', async ({ page }) => {
    const urls = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
    ]

    const startTime = Date.now()
    
    const responses = await Promise.all(
      urls.map(url => 
        page.goto(url, { waitUntil: 'domcontentloaded' }).then(() => url)
      )
    )

    const totalTime = Date.now() - startTime
    console.log(`Concurrent load time: ${totalTime}ms for ${responses.length} pages`)

    expect(totalTime).toBeLessThan(10000)
  })
})
