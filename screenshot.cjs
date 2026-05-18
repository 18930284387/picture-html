const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const PREVIEW_URL = process.env.PREVIEW_URL || 'http://localhost:4173';
const ARTIFACTS_DIR = path.join(__dirname, 'artifacts');
const VIEWPORT = { width: 1440, height: 900 };

async function ensureArtifactsDir() {
  if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  }
}

async function takeHomeScreenshot(page) {
  console.log('Navigating to home page...');
  await page.goto(PREVIEW_URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForTimeout(3000);

  console.log('Scrolling to trigger lazy loading...');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const distance = 800;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        total += distance;
        if (total >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 400);
    });
  });
  await page.waitForTimeout(2000);

  const filePath = path.join(ARTIFACTS_DIR, 'home.png');
  await page.screenshot({ path: filePath, fullPage: true });
  console.log(`Home screenshot saved: ${filePath}`);
}

async function takeProfileScreenshot(page) {
  console.log('Navigating to home page first...');
  await page.goto(PREVIEW_URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForTimeout(2000);

  console.log('Clicking profile avatar to navigate to profile page...');
  const clicked = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
      const img = btn.querySelector('img[alt="Profile"]');
      if (img) {
        btn.click();
        return true;
      }
    }
    return false;
  });

  if (!clicked) {
    console.warn('Could not find profile avatar via image alt, trying fallback selectors...');
    await page.evaluate(() => {
      const btn = document.querySelector('header button:last-of-type');
      if (btn) btn.click();
    });
  }

  await page.waitForTimeout(3000);

  const filePath = path.join(ARTIFACTS_DIR, 'profile.png');
  await page.screenshot({ path: filePath, fullPage: true });
  console.log(`Profile screenshot saved: ${filePath}`);
}

async function run() {
  console.log('Starting screenshot capture...');

  await ensureArtifactsDir();

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);

    await takeHomeScreenshot(page);
    await takeProfileScreenshot(page);

    console.log('All screenshots captured successfully.');
  } catch (err) {
    console.error('Screenshot capture failed:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();