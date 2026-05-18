import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. 前置校验
console.log('--- 1. Running Lint ---');
try {
  execSync('npm run lint', { stdio: 'inherit', cwd: rootDir });
  console.log('Lint passed.\n');
} catch (error) {
  console.error('Lint failed. Aborting CI pipeline.');
  process.exit(1);
}

// 2. 体积守卫
console.log('--- 2. Building and Checking Size ---');
try {
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir });
} catch (error) {
  console.error('Build failed. Aborting CI pipeline.');
  process.exit(1);
}

const assetsDir = path.join(rootDir, 'dist', 'assets');
let oversized = false;
if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  for (const file of files) {
    if (file.endsWith('.js') || file.endsWith('.css')) {
      const filePath = path.join(assetsDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = stats.size / 1024;
      if (sizeKB > 350) {
        console.error(`\x1b[31m[Size Guard Failed] ${file} exceeds 350KB limit: ${sizeKB.toFixed(2)}KB\x1b[0m`);
        oversized = true;
      } else {
        console.log(`[Size Guard Passed] ${file}: ${sizeKB.toFixed(2)}KB`);
      }
    }
  }
} else {
  console.error('dist/assets directory not found!');
  process.exit(1);
}

if (oversized) {
  process.exit(1);
}
console.log('Size check passed.\n');

// 3. E2E 截图巡检
console.log('--- 3. Starting Preview Server ---');
let previewProcess;

async function runE2E() {
  previewProcess = spawn('npm', ['run', 'preview'], { cwd: rootDir, shell: true });
  
  let previewUrl = '';
  
  // 监听输出，获取实际的 URL
  previewProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);
    const match = output.match(/http:\/\/localhost:\d+\/?/);
    if (match && !previewUrl) {
      previewUrl = match[0];
    }
  });

  previewProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  // 轮询等待服务 ready
  const maxRetries = 30;
  let retries = 0;
  let ready = false;
  
  while (retries < maxRetries && !ready) {
    if (previewUrl) {
      try {
        await new Promise((resolve, reject) => {
          const req = http.get(previewUrl, (res) => {
            if (res.statusCode === 200 || res.statusCode === 404) {
              ready = true;
              resolve();
            } else {
              reject(new Error(`Status: ${res.statusCode}`));
            }
          });
          req.on('error', reject);
          req.end();
        });
      } catch (err) {
        // Not ready yet
      }
    }
    if (!ready) {
      await new Promise(r => setTimeout(r, 1000));
      retries++;
    }
  }

  if (!ready) {
    throw new Error('Preview server did not start in time.');
  }

  console.log(`Preview server ready at ${previewUrl}`);

  // 4. 集成历史脚本
  console.log('--- 4. Running Puppeteer E2E Screenshots ---');
  const artifactsDir = path.join(rootDir, 'artifacts');
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir);
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1080 });

  console.log('Navigating to Home...');
  await page.goto(previewUrl, { waitUntil: 'networkidle0' });
  
  // App is rendering, we should check if login page is showing, if so, login
  // App.tsx: const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Default is false, so it shows login page.
  // Wait, if it shows login page, we need to click login button first.
  const loginBtn = await page.$('button.bg-gradient-to-r.from-teal-500');
  if (loginBtn) {
    console.log('Logging in...');
    await loginBtn.click();
    // Wait for navigation/render
    await page.waitForTimeout(2000);
  }

  // Screenshot Home Page
  const homePath = path.join(artifactsDir, 'home.png');
  await page.screenshot({ path: homePath, fullPage: true });
  console.log(`Saved home screenshot to ${homePath}`);

  console.log('Navigating to Profile...');
  // Click the profile button
  await page.click('img[alt="Profile"]');
  await page.waitForTimeout(2000); // Wait for animation/render
  
  // Screenshot Profile Page
  const profilePath = path.join(artifactsDir, 'profile.png');
  await page.screenshot({ path: profilePath, fullPage: true });
  console.log(`Saved profile screenshot to ${profilePath}`);

  await browser.close();
}

runE2E().then(() => {
  console.log('CI Pipeline completed successfully.');
}).catch(err => {
  console.error('E2E tests failed:', err);
  process.exitCode = 1;
}).finally(() => {
  // 5. 退出
  console.log('--- 5. Cleanup ---');
  if (previewProcess) {
    console.log('Killing preview server...');
    previewProcess.kill('SIGTERM');
  }
  process.exit();
});
