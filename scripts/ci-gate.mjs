import { execSync, spawn } from 'node:child_process'
import { readdirSync, statSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import http from 'node:http'
import puppeteer from 'puppeteer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, '..')
const ARTIFACTS_DIR = join(ROOT, 'artifacts')
const PREVIEW_PORT = 4173
const PREVIEW_URL = `http://localhost:${PREVIEW_PORT}`
const SIZE_LIMIT_KB = 350

function log(msg) {
  console.log(`\x1b[36m[ci-gate]\x1b[0m ${msg}`)
}

function error(msg) {
  console.error(`\x1b[31m[ci-gate:ERROR]\x1b[0m ${msg}`)
}

function warn(msg) {
  console.warn(`\x1b[33m[ci-gate:WARN]\x1b[0m ${msg}`)
}

function success(msg) {
  console.log(`\x1b[32m[ci-gate:OK]\x1b[0m ${msg}`)
}

function exec(cmd, cwd = ROOT) {
  log(`Running: ${cmd}`)
  try {
    execSync(cmd, { cwd, stdio: 'inherit' })
  } catch (err) {
    error(`Command failed: ${cmd}`)
    process.exit(1)
  }
}

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          res.resume()
          resolve()
        })
        req.on('error', reject)
        req.setTimeout(2000, () => {
          req.destroy()
          reject(new Error('timeout'))
        })
      })
      return true
    } catch {
      await new Promise((r) => setTimeout(r, 500))
    }
  }
  return false
}

function killPreview(proc) {
  if (!proc) return
  try {
    proc.kill('SIGTERM')
    setTimeout(() => {
      try {
        if (proc.exitCode === null) {
          proc.kill('SIGKILL')
        }
      } catch {}
    }, 3000)
  } catch {}
}

function checkChunkSizes() {
  const assetsDir = join(ROOT, 'dist', 'assets')
  if (!existsSync(assetsDir)) {
    error('dist/assets directory not found. Build may have failed.')
    process.exit(1)
  }

  const files = readdirSync(assetsDir)
  const oversized = []

  for (const file of files) {
    const filePath = join(assetsDir, file)
    const stat = statSync(filePath)
    if (!stat.isFile()) continue
    const ext = file.split('.').pop()?.toLowerCase()
    if (ext !== 'js' && ext !== 'css') continue

    const sizeKB = (stat.size / 1024).toFixed(2)
    log(`  ${file}: ${sizeKB} KB`)

    if (stat.size / 1024 > SIZE_LIMIT_KB) {
      oversized.push({ file, sizeKB: Number(sizeKB) })
    }
  }

  if (oversized.length > 0) {
    error('='.repeat(60))
    error('CHUNK SIZE LIMIT EXCEEDED!')
    error('='.repeat(60))
    for (const item of oversized) {
      error(`  ${item.file}  =>  \x1b[1;31m${item.sizeKB} KB\x1b[0m  (limit: ${SIZE_LIMIT_KB} KB)`)
    }
    error('='.repeat(60))
    process.exit(1)
  }

  success('All chunk sizes within limit.')
}

async function takeScreenshot(page, name, navigateAction) {
  log(`Taking screenshot: ${name}`)
  await navigateAction(page)
  await page.waitForTimeout(2000)

  const filePath = join(ARTIFACTS_DIR, `${name}.png`)
  await page.screenshot({ path: filePath, fullPage: true })
  success(`Screenshot saved: ${filePath}`)
}

async function runE2EScreenshots() {
  log('Launching Puppeteer browser...')
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  let page
  try {
    page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })

    await takeScreenshot(page, 'home', async (p) => {
      await p.goto(PREVIEW_URL, { waitUntil: 'networkidle0', timeout: 30000 })
      await p.waitForTimeout(2000)
      await p.evaluate(async () => {
        await new Promise((resolve) => {
          let total = 0
          const timer = setInterval(() => {
            window.scrollBy(0, 800)
            total += 800
            if (total >= document.body.scrollHeight) {
              clearInterval(timer)
              window.scrollTo(0, 0)
              resolve()
            }
          }, 400)
        })
      })
      await p.waitForTimeout(1500)
    })

    await takeScreenshot(page, 'profile', async (p) => {
      await p.goto(PREVIEW_URL, { waitUntil: 'networkidle0', timeout: 30000 })
      await p.waitForTimeout(2000)

      const clicked = await p.evaluate(() => {
        const avatarImgs = document.querySelectorAll('img[alt="Profile"]')
        const buttons = document.querySelectorAll('button')
        for (const btn of buttons) {
          const img = btn.querySelector('img[alt="Profile"]')
          if (img) {
            btn.click()
            return true
          }
        }
        for (const img of avatarImgs) {
          const parent = img.closest('button')
          if (parent) {
            parent.click()
            return true
          }
        }
        return false
      })

      if (!clicked) {
        warn('Could not find profile avatar button, navigating directly.')
        await p.evaluate(() => {
          const btn = document.querySelector('button[class*="ml-2"]')
          if (btn) btn.click()
        })
      }

      await p.waitForTimeout(2500)
    })
  } finally {
    await browser.close()
  }
}

async function main() {
  log('=== CI GATE PIPELINE STARTED ===')

  if (!existsSync(ARTIFACTS_DIR)) {
    mkdirSync(ARTIFACTS_DIR, { recursive: true })
  }

  log('Step 1: Lint check')
  exec('npm run lint')

  log('Step 2: Build')
  exec('npm run build')

  log('Step 3: Chunk size guard')
  checkChunkSizes()

  log('Step 4: Starting preview server')
  const previewProc = spawn('npx', ['vite', 'preview', '--port', String(PREVIEW_PORT), '--strictPort'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false,
  })

  const cleanup = () => {
    killPreview(previewProc)
  }

  let previewOutput = ''
  previewProc.stdout?.on('data', (d) => { previewOutput += d.toString() })
  previewProc.stderr?.on('data', (d) => { previewOutput += d.toString() })

  previewProc.on('exit', () => {
    log('Preview server process exited.')
  })

  log('Waiting for preview server to be ready...')
  const ready = await waitForServer(PREVIEW_URL, 30000)

  if (!ready) {
    error('Preview server did not become ready in time.')
    error(`Server output: ${previewOutput}`)
    cleanup()
    process.exit(1)
  }

  success('Preview server is ready.')

  log('Step 5: E2E screenshot inspection')
  try {
    await runE2EScreenshots()
    success('Screenshots captured successfully.')
  } catch (err) {
    error(`Screenshot inspection failed: ${err.message}`)
  } finally {
    log('Step 6: Cleaning up preview server')
    cleanup()
  }

  log('=== CI GATE PIPELINE COMPLETED ===')
}

process.on('SIGINT', () => {
  log('Interrupted.')
  process.exit(1)
})

process.on('SIGTERM', () => {
  log('Terminated.')
  process.exit(1)
})

main().catch((err) => {
  error(`Pipeline failed: ${err.message}`)
  process.exit(1)
})