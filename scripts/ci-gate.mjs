import { execSync, spawn } from 'node:child_process'
import { readdirSync, statSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ROOT = resolve(__dirname, '..')
const DIST_DIR = join(ROOT, 'dist')
const DIST_ASSETS = join(DIST_DIR, 'assets')
const ARTIFACTS_DIR = join(ROOT, 'artifacts')
const SIZE_LIMIT_KB = 350
const PREVIEW_URL = 'http://localhost:4173'

const NODE_BIN = process.execPath
const require = createRequire(import.meta.url)
let NPM_CLI
try {
  const npmPath = require.resolve('npm/bin/npm-cli.js', { paths: [ROOT] })
  NPM_CLI = npmPath
} catch {
  NPM_CLI = join(ROOT, 'node_modules', 'npm', 'bin', 'npm-cli.js')
}

function npmCmd(args) {
  return `"${NODE_BIN}" "${NPM_CLI}" ${args}`
}

function logStep(tag, msg) {
  const colors = {
    info: '\x1b[36m',
    ok: '\x1b[32m',
    warn: '\x1b[33m',
    fail: '\x1b[31m',
  }
  const c = colors[tag] || '\x1b[0m'
  console.log(`${c}[${tag.toUpperCase()}]\x1b[0m ${msg}`)
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function runLint() {
  logStep('info', '▶ Step 1: ESLint 前置校验 ...')
  try {
    execSync(npmCmd('run lint'), { cwd: ROOT, stdio: 'inherit', shell: true })
    logStep('ok', 'ESLint 校验通过 ✅')
  } catch (err) {
    logStep('fail', 'ESLint 校验失败，中断流水线 ❌')
    throw err
  }
}

function runBuild() {
  logStep('info', '▶ Step 2: 执行构建 (staging) ...')
  try {
    execSync(npmCmd('run build:staging'), { cwd: ROOT, stdio: 'inherit', shell: true })
    logStep('ok', '构建完成 ✅')
  } catch (err) {
    logStep('fail', '构建失败 ❌')
    throw err
  }
}

function checkBundleSize() {
  logStep('info', `▶ Step 3: 体积守卫 (阈值 ${SIZE_LIMIT_KB}KB) ...`)

  if (!existsSync(DIST_ASSETS)) {
    logStep('fail', `dist/assets 目录不存在: ${DIST_ASSETS} ❌`)
    process.exit(1)
  }

  const files = readdirSync(DIST_ASSETS)
  const jsCss = files.filter(
    (f) => f.endsWith('.js') || f.endsWith('.css')
  )

  if (jsCss.length === 0) {
    logStep('fail', 'dist/assets 下未找到任何 JS/CSS 产物 ❌')
    process.exit(1)
  }

  const oversize = []
  for (const f of jsCss) {
    const full = join(DIST_ASSETS, f)
    const sizeBytes = statSync(full).size
    const sizeKB = sizeBytes / 1024
    if (sizeKB > SIZE_LIMIT_KB) {
      oversize.push({ file: f, sizeKB: sizeKB.toFixed(1) })
    }
  }

  if (oversize.length > 0) {
    logStep('fail', '以下 Chunk 体积超标：')
    for (const o of oversize) {
      console.log(
        `\x1b[31m  🚫 ${o.file}  →  ${o.sizeKB} KB\x1b[0m`
      )
    }
    logStep('fail', '体积守卫未通过，流水线中断 ❌')
    process.exit(1)
  }

  logStep('ok', `所有 Chunk 体积均在 ${SIZE_LIMIT_KB}KB 以内 ✅`)
  for (const f of jsCss) {
    const sizeKB = (statSync(join(DIST_ASSETS, f)).size / 1024).toFixed(1)
    console.log(`  📦 ${f}  →  ${sizeKB} KB`)
  }
}

function startPreviewServer() {
  return new Promise((resolve, reject) => {
    logStep('info', '▶ Step 4: 启动 vite preview 服务 ...')

    const child = spawn(NODE_BIN, [NPM_CLI, 'run', 'preview'], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: true,
    })

    child.unref()

    let ready = false

    child.stdout.on('data', (data) => {
      const msg = data.toString()
      process.stdout.write(msg)
      if (!ready && (msg.includes('Local:') || msg.includes('4173'))) {
        ready = true
        logStep('ok', 'Preview 服务已就绪 ✅')
        resolve(child)
      }
    })

    child.stderr.on('data', (data) => {
      const msg = data.toString()
      process.stderr.write(msg)
      if (!ready && (msg.includes('Local:') || msg.includes('4173') || msg.includes('running'))) {
        ready = true
        logStep('ok', 'Preview 服务已就绪 ✅')
        resolve(child)
      }
    })

    child.on('error', (err) => {
      if (!ready) {
        logStep('fail', `Preview 进程启动失败: ${err.message} ❌`)
        reject(err)
      }
    })

    child.on('exit', (code) => {
      if (!ready) {
        logStep('fail', `Preview 进程意外退出，code=${code} ❌`)
        reject(new Error(`Preview process exited with code ${code}`))
      }
    })

    const pollInterval = setInterval(async () => {
      if (ready) {
        clearInterval(pollInterval)
        return
      }
      try {
        const resp = await fetch(PREVIEW_URL)
        if (resp.ok) {
          clearInterval(pollInterval)
          ready = true
          logStep('ok', 'Preview 服务已就绪 (轮询确认) ✅')
          resolve(child)
        }
      } catch {
        // not ready yet
      }
    }, 2000)

    setTimeout(() => {
      if (!ready) {
        clearInterval(pollInterval)
        logStep('fail', 'Preview 服务启动超时 ❌')
        killProcess(child)
        reject(new Error('Preview server startup timeout'))
      }
    }, 45000)
  })
}

function killProcess(child) {
  try {
    if (child.pid) {
      process.kill(-child.pid, 'SIGKILL')
    }
  } catch {
    // already dead
  }
  try {
    child.kill('SIGKILL')
  } catch {
    // already dead
  }
}

async function takeScreenshots() {
  logStep('info', '▶ Step 5: E2E 截图巡检 ...')
  mkdirSync(ARTIFACTS_DIR, { recursive: true })

  let browser
  try {
    const puppeteer = await import('puppeteer')

    browser = await puppeteer.default.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1440,1080',
      ],
    })

    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 1080 })

    logStep('info', '截图: 首页瀑布流 ...')
    await page.goto(PREVIEW_URL, { waitUntil: 'networkidle2', timeout: 30000 })

    const signInButton = await page.$('button')
    if (signInButton) {
      const buttonText = await page.evaluate(
        (el) => el.textContent,
        signInButton
      )
      if (buttonText && buttonText.includes('Sign In')) {
        await signInButton.click()
        await delay(2000)
      }
    }

    await delay(2000)
    await page.screenshot({
      path: join(ARTIFACTS_DIR, 'home-waterfall.png'),
      fullPage: true,
    })
    logStep('ok', '首页截图已保存 → artifacts/home-waterfall.png ✅')

    logStep('info', '截图: 个人主页 ...')
    const avatarImg = await page.$('img[alt="Profile"]')
    if (avatarImg) {
      await avatarImg.click()
      await delay(2000)
    } else {
      const allButtons = await page.$$('button')
      for (const btn of allButtons) {
        const text = await page.evaluate((el) => el.textContent || '', btn)
        if (text.includes('Profile') || text.includes('头像')) {
          await btn.click()
          await delay(2000)
          break
        }
      }
    }

    await page.screenshot({
      path: join(ARTIFACTS_DIR, 'profile-page.png'),
      fullPage: true,
    })
    logStep('ok', '个人主页截图已保存 → artifacts/profile-page.png ✅')
  } catch (err) {
    logStep('fail', `截图过程出错: ${err.message} ❌`)
    throw err
  } finally {
    if (browser) {
      await browser.close().catch(() => {})
    }
  }
}

async function main() {
  console.log('\n' + '='.repeat(60))
  console.log('\x1b[36m  🚀 PixelHub CI Pipeline\x1b[0m')
  console.log('='.repeat(60) + '\n')

  let previewProcess = null

  try {
    runLint()

    runBuild()

    checkBundleSize()

    previewProcess = await startPreviewServer()

    await takeScreenshots()

    logStep('ok', '🎉 CI Pipeline 全部通过！')
  } catch (err) {
    logStep('fail', `Pipeline 失败: ${err.message}`)
    process.exitCode = 1
  } finally {
    if (previewProcess) {
      logStep('info', '正在关闭 preview 服务 ...')
      killProcess(previewProcess)
      logStep('ok', 'Preview 服务已关闭 ✅')
    }
    console.log('\n' + '='.repeat(60))
    console.log('\x1b[36m  CI Pipeline 结束\x1b[0m')
    console.log('='.repeat(60) + '\n')
  }
}

main()
