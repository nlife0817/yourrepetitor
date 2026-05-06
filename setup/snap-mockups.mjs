// Snapshot product pages used as iframe mockups on slide 5,
// so PDF export does not depend on iframe load timing.
//
// Run with the dev server live on http://localhost:3030.
// Output: public/mockups/{calendar,analytics,notifications}.png

import { chromium } from 'playwright-chromium'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { mkdir } from 'node:fs/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')
const outDir = resolve(projectRoot, 'public/mockups')
await mkdir(outDir, { recursive: true })

// Phone screen viewport in slide-5 layout: 358 x 748 px (370x760 with 6px frame padding).
const VIEWPORT = { width: 358, height: 748, deviceScaleFactor: 3 }

const targets = [
  { url: 'http://localhost:3030/product/calendar/index.html', file: 'calendar.png' },
  { url: 'http://localhost:3030/product/analytics/index.html', file: 'analytics.png' },
  { url: 'http://localhost:3030/product/profile/notifications.html', file: 'notifications.png' },
]

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: VIEWPORT })
const page = await ctx.newPage()

for (const t of targets) {
  console.log(`-> ${t.url}`)
  await page.goto(t.url, { waitUntil: 'networkidle', timeout: 30_000 })
  // Wait for fonts and any post-load animations
  await page.evaluate(() => document.fonts && document.fonts.ready)
  await page.waitForTimeout(600)
  const out = resolve(outDir, t.file)
  await page.screenshot({ path: out, type: 'png', clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height } })
  console.log(`   saved: ${out}`)
}

await browser.close()
console.log('done')
