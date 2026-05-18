import { spawn } from 'node:child_process'
import { access, mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const distAssetsDir = path.join(projectRoot, 'dist', 'assets')
const artifactsDir = path.join(projectRoot, 'artifacts')
const previewHost = process.env.CI_PREVIEW_HOST || '127.0.0.1'
const previewPort = Number(process.env.CI_PREVIEW_PORT || 4173)
const previewUrl = `http://${previewHost}:${previewPort}`
const buildMode = process.env.CI_BUILD_MODE || 'production'
const chunkLimitBytes = 350 * 1024
const requireFromRoot = createRequire(path.join(projectRoot, 'package.json'))
let previewProcess
let previewExitPromise
let previewLogs = ''
let isCleaningUp = false

function color(code, value) {
  return `\u001b[${code}m${value}\u001b[0m`
}

function logStep(message) {
  console.log(color(36, `\n▶ ${message}`))
}

function logSuccess(message) {
  console.log(color(32, `✔ ${message}`))
}

function logError(message) {
  console.error(color(31, `✖ ${message}`))
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return `${(bytes / 1024).toFixed(2)} KB`
}

function trimLogs(value) {
  return value.slice(-16000)
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function runCommand(command, args, options = {}) {
  const {
    cwd = projectRoot,
    env = {},
    streamOutput = true
  } = options

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: { ...process.env, ...env },
      stdio: ['ignore', 'pipe', 'pipe']
    })

    let stdout = ''
    let stderr = ''
    let settled = false

    const finalize = callback => value => {
      if (settled) {
        return
      }

      settled = true
      callback(value)
    }

    child.stdout.on('data', chunk => {
      const text = chunk.toString()
      stdout += text
      if (streamOutput) {
        process.stdout.write(text)
      }
    })

    child.stderr.on('data', chunk => {
      const text = chunk.toString()
      stderr += text
      if (streamOutput) {
        process.stderr.write(text)
      }
    })

    child.once('error', finalize(reject))
    child.once('close', finalize(code => {
      if (code === 0) {
        resolve({ stdout, stderr })
        return
      }

      const output = `${stdout}\n${stderr}`.trim()
      reject(new Error(output || `${command} ${args.join(' ')} 退出码 ${code}`))
    }))
  })
}

async function ensurePuppeteer() {
  try {
    requireFromRoot.resolve('puppeteer')
    return
  } catch {
    logStep('检测到 Puppeteer 未安装，正在补齐依赖')
    await runCommand('npm', ['install', '-D', 'puppeteer'])
    logSuccess('Puppeteer 安装完成')
  }
}

async function collectAssetFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...await collectAssetFiles(entryPath))
      continue
    }

    if (!entry.name.endsWith('.js') && !entry.name.endsWith('.css')) {
      continue
    }

    const fileStat = await stat(entryPath)
    files.push({
      name: path.relative(projectRoot, entryPath),
      size: fileStat.size
    })
  }

  return files.sort((left, right) => right.size - left.size)
}

async function enforceChunkLimit() {
  await access(distAssetsDir)
  const files = await collectAssetFiles(distAssetsDir)
  const oversizeFiles = files.filter(file => file.size > chunkLimitBytes)

  console.log(color(90, files.map(file => `${file.name} ${formatBytes(file.size)}`).join('\n')))

  if (oversizeFiles.length === 0) {
    logSuccess(`体积守卫通过，所有 JS/CSS Chunk 均不超过 ${formatBytes(chunkLimitBytes)}`)
    return
  }

  oversizeFiles.forEach(file => {
    console.error(color(31, `超标 Chunk: ${file.name} ${formatBytes(file.size)}`))
  })

  throw new Error('体积守卫未通过，已中断后续流程')
}

function startPreviewServer() {
  logStep(`启动预览服务: ${previewUrl}`)
  previewLogs = ''

  previewProcess = spawn('npm', ['run', 'preview', '--', '--host', previewHost, '--port', String(previewPort), '--strictPort'], {
    cwd: projectRoot,
    env: { ...process.env },
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true
  })

  previewExitPromise = new Promise(resolve => {
    previewProcess.once('exit', (code, signal) => resolve({ code, signal }))
  })

  const appendLogs = chunk => {
    const text = chunk.toString()
    previewLogs = trimLogs(`${previewLogs}${text}`)
    process.stdout.write(text)
  }

  previewProcess.stdout.on('data', appendLogs)
  previewProcess.stderr.on('data', appendLogs)
  previewProcess.once('error', error => {
    previewLogs = trimLogs(`${previewLogs}\n${error.stack || error.message}`)
  })
}

async function waitForPreviewReady() {
  const deadline = Date.now() + 60000

  while (Date.now() < deadline) {
    if (previewProcess?.exitCode !== null && previewProcess?.exitCode !== undefined) {
      throw new Error(`vite preview 提前退出，退出码 ${previewProcess.exitCode}\n${previewLogs}`)
    }

    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 2500)

      try {
        const response = await fetch(previewUrl, { signal: controller.signal })

        if (response.ok) {
          logSuccess('预览服务已就绪')
          return
        }
      } finally {
        clearTimeout(timer)
      }
    } catch {
    }

    await delay(1000)
  }

  throw new Error(`预览服务在超时前未就绪\n${previewLogs}`)
}

async function stopPreviewServer() {
  if (!previewProcess?.pid || isCleaningUp) {
    return
  }

  isCleaningUp = true

  try {
    process.kill(-previewProcess.pid, 'SIGTERM')
  } catch {
    isCleaningUp = false
    return
  }

  const result = await Promise.race([
    previewExitPromise,
    delay(5000).then(() => 'timeout')
  ])

  if (result === 'timeout') {
    try {
      process.kill(-previewProcess.pid, 'SIGKILL')
      await previewExitPromise
    } catch {
    }
  }

  isCleaningUp = false
  previewProcess = undefined
  previewExitPromise = undefined
}

async function runScreenshots() {
  logStep('执行 E2E 截图巡检')
  await mkdir(artifactsDir, { recursive: true })
  const screenshotModulePath = path.join(projectRoot, 'screenshot.cjs')
  const { captureScreenshots } = requireFromRoot(screenshotModulePath)
  const screenshotPaths = await captureScreenshots({
    baseUrl: previewUrl,
    outputDir: artifactsDir
  })

  screenshotPaths.forEach(filePath => {
    logSuccess(`截图已生成: ${path.relative(projectRoot, filePath)}`)
  })
}

async function runPipeline() {
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, async () => {
      await stopPreviewServer()
      process.exit(1)
    })
  }

  try {
    logStep('前置校验：执行 npm run lint')
    await runCommand('npm', ['run', 'lint'])
    logSuccess('Lint 校验通过')

    logStep(`体积守卫：执行 npm run build -- --mode ${buildMode}`)
    await runCommand('npm', ['run', 'build', '--', '--mode', buildMode])
    logSuccess('构建完成')

    await enforceChunkLimit()
    await ensurePuppeteer()
    startPreviewServer()
    await waitForPreviewReady()
    await runScreenshots()
    logSuccess('本地 CI 流水线执行完成')
  } catch (error) {
    const detail = error instanceof Error ? error.stack || error.message : String(error)
    logError(detail)
    process.exitCode = 1
  } finally {
    await stopPreviewServer()
  }
}

await runPipeline()
