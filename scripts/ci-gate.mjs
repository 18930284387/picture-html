#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, readdirSync, statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd: rootDir,
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });

    let stdout = '';
    let stderr = '';

    if (options.silent) {
      proc.stdout?.on('data', (data) => {
        stdout += data.toString();
      });
      proc.stderr?.on('data', (data) => {
        stderr += data.toString();
      });
    }

    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr, code });
      } else {
        reject(new Error(`Command failed with code ${code}: ${command} ${args.join(' ')}`));
      }
    });

    proc.on('error', reject);
  });
}

async function waitForPort(port, timeout = 30000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      const net = await import('net');
      await new Promise((resolve, reject) => {
        const socket = new net.Socket();
        socket.setTimeout(1000);
        socket.on('connect', () => {
          socket.destroy();
          resolve(true);
        });
        socket.on('error', () => {
          socket.destroy();
          reject(false);
        });
        socket.on('timeout', () => {
          socket.destroy();
          reject(false);
        });
        socket.connect(port, 'localhost');
      });
      return true;
    } catch (e) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  return false;
}

async function checkChunksSize() {
  const assetsDir = join(rootDir, 'dist', 'assets');
  if (!existsSync(assetsDir)) {
    throw new Error('dist/assets directory not found');
  }

  const files = readdirSync(assetsDir);
  let hasOverSize = false;

  console.log('\n📦 Checking chunk sizes...');
  for (const file of files) {
    if (file.endsWith('.js') || file.endsWith('.css')) {
      const filePath = join(assetsDir, file);
      const stats = statSync(filePath);
      const sizeKB = stats.size / 1024;
      
      if (sizeKB > 350) {
        console.error(`❌ ${file}: ${sizeKB.toFixed(2)} KB - OVER 350 KB!`);
        hasOverSize = true;
      } else {
        console.log(`✅ ${file}: ${sizeKB.toFixed(2)} KB`);
      }
    }
  }

  if (hasOverSize) {
    throw new Error('Some chunks exceed 350 KB');
  }

  console.log('\n✅ All chunks are within size limits!');
}

async function takeScreenshots() {
  let puppeteer;
  try {
    puppeteer = await import('puppeteer');
  } catch (e) {
    console.warn('⚠️ puppeteer not available, skipping screenshot step');
    return;
  }

  const artifactsDir = join(rootDir, 'artifacts');
  if (!existsSync(artifactsDir)) {
    mkdirSync(artifactsDir, { recursive: true });
  }

  console.log('\n🎨 Launching browser for screenshots...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('📸 Navigating to homepage...');
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: join(artifactsDir, 'home.png'), fullPage: false });
    console.log('✅ Homepage screenshot saved!');

    console.log('📸 Navigating to profile page...');
    const profileBtn = await page.waitForSelector('img[alt="Profile"]', { timeout: 5000 });
    await profileBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: join(artifactsDir, 'profile.png'), fullPage: false });
    console.log('✅ Profile page screenshot saved!');

  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('🚀 Starting CI pipeline...');

  let previewProcess = null;

  try {
    console.log('\n🔍 Step 1: Running lint check...');
    await runCommand('npm', ['run', 'lint']);
    console.log('✅ Lint passed!');

    console.log('\n🏗️ Step 2: Building the project...');
    await runCommand('npm', ['run', 'build']);
    console.log('✅ Build completed!');

    console.log('\n📦 Step 3: Checking chunk sizes...');
    await checkChunksSize();

    console.log('\n🌐 Step 4: Starting preview server...');
    previewProcess = spawn('npm', ['run', 'preview'], {
      cwd: rootDir,
      detached: true,
      stdio: 'ignore',
    });

    previewProcess.unref();

    const isPortReady = await waitForPort(4173);
    if (!isPortReady) {
      throw new Error('Preview server failed to start');
    }
    console.log('✅ Preview server is ready!');

    console.log('\n📸 Step 5: Taking screenshots...');
    await takeScreenshots();

    console.log('\n🎉 CI pipeline completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ CI pipeline failed:', error.message);
    process.exit(1);
  } finally {
    if (previewProcess) {
      console.log('\n🔪 Killing preview server...');
      try {
        process.kill(-previewProcess.pid);
      } catch (e) {
        try {
          previewProcess.kill('SIGTERM');
        } catch (e2) {
          console.warn('Failed to kill preview process');
        }
      }
    }
  }
}

main();
