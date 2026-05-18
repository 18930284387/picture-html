const fs = require('node:fs/promises')
const path = require('node:path')

async function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function waitForImages(page) {
  await page.waitForFunction(
    () => Array.from(document.images).every(image => image.complete),
    { timeout: 30000 }
  ).catch(() => {})
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise(resolve => {
      const step = Math.max(Math.floor(window.innerHeight * 0.8), 400)
      const timer = setInterval(() => {
        const { scrollHeight } = document.documentElement
        const currentBottom = window.scrollY + window.innerHeight

        if (currentBottom >= scrollHeight) {
          clearInterval(timer)
          resolve()
          return
        }

        window.scrollBy(0, step)
      }, 250)
    })
  })
  await pause(800)
  await page.evaluate(() => window.scrollTo(0, 0))
  await pause(600)
}

async function clickByText(page, texts) {
  return page.evaluate(targetTexts => {
    const selectors = ['button', '[role="button"]', 'a']
    const visible = element => {
      const rect = element.getBoundingClientRect()
      const style = window.getComputedStyle(element)
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none'
    }

    const normalize = value => value.replace(/\s+/g, ' ').trim().toLowerCase()
    const targetSet = new Set(targetTexts.map(normalize))
    const elements = selectors.flatMap(selector => Array.from(document.querySelectorAll(selector)))

    for (const element of elements) {
      if (!visible(element)) {
        continue
      }

      const label = normalize(element.innerText || element.textContent || element.getAttribute('aria-label') || '')
      if (!targetSet.has(label)) {
        continue
      }

      element.click()
      return true
    }

    return false
  }, texts)
}

async function clickProfileAvatar(page) {
  return page.evaluate(() => {
    const image = Array.from(document.querySelectorAll('img')).find(element => {
      const alt = (element.getAttribute('alt') || '').trim().toLowerCase()
      const rect = element.getBoundingClientRect()
      return alt === 'profile' && rect.width > 0 && rect.height > 0
    })

    if (!image) {
      return false
    }

    const clickable = image.closest('button, a, [role="button"]') || image
    clickable.click()
    return true
  })
}

async function takeScreenshot(page, outputPath) {
  await waitForImages(page)
  await autoScroll(page)
  await page.screenshot({
    path: outputPath,
    fullPage: true,
    type: 'png'
  })
}

async function captureScreenshots(options = {}) {
  const {
    baseUrl = 'http://127.0.0.1:4173',
    outputDir = path.join(__dirname, 'artifacts'),
    viewport = { width: 1440, height: 1600 }
  } = options

  await fs.mkdir(outputDir, { recursive: true })

  const puppeteer = require('puppeteer')
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: viewport,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()
    await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 60000 })
    await pause(1200)

    const signedIn = await clickByText(page, ['Sign In', 'Create Account'])
    if (!signedIn) {
      throw new Error('未找到登录入口按钮，无法进入首页')
    }

    await page.waitForFunction(
      () => document.body.innerText.includes('For You') && document.querySelector('img[alt="Profile"]'),
      { timeout: 30000 }
    )
    await pause(1200)

    const homePath = path.join(outputDir, 'home-waterfall.png')
    await takeScreenshot(page, homePath)

    const openedProfile = await clickProfileAvatar(page)
    if (!openedProfile) {
      throw new Error('未找到进入个人主页的头像按钮')
    }

    await page.waitForFunction(
      () => document.body.innerText.includes('Profile') && document.body.innerText.includes('Version'),
      { timeout: 30000 }
    )
    await pause(1200)

    const profilePath = path.join(outputDir, 'profile-page.png')
    await takeScreenshot(page, profilePath)

    return [homePath, profilePath]
  } finally {
    await browser.close()
  }
}

module.exports = {
  captureScreenshots
}

if (require.main === module) {
  const baseUrl = process.env.SCREENSHOT_BASE_URL || 'http://127.0.0.1:4173'
  const outputDir = process.env.SCREENSHOT_OUTPUT_DIR || path.join(__dirname, 'artifacts')

  captureScreenshots({ baseUrl, outputDir })
    .then(paths => {
      console.log(`截图完成: ${paths.join(', ')}`)
    })
    .catch(error => {
      console.error(error)
      process.exitCode = 1
    })
}
