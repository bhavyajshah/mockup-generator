import puppeteer, { Browser, PuppeteerLaunchOptions } from 'puppeteer';

let browser: Browser | null = null;

const defaultOptions: PuppeteerLaunchOptions = {
  headless: 'new',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process',
  ],
  timeout: 30000,
};

export async function getBrowser(): Promise<Browser> {
  if (!browser) {
    try {
      browser = await puppeteer.launch(defaultOptions);
    } catch (error) {
      console.error('Failed to launch browser:', error);
      throw new Error('Browser initialization failed');
    }
  }
  return browser;
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    try {
      await browser.close();
      browser = null;
    } catch (error) {
      console.error('Failed to close browser:', error);
    }
  }
}