import { Browser, Page } from 'puppeteer';
import { getBrowser } from './browser';
import { ScreenshotOptions, DeviceEmulation } from '@/lib/types/screenshot';

async function setupPage(browser: Browser, options: ScreenshotOptions): Promise<Page> {
  const page = await browser.newPage();

  // Apply device emulation if specified
  if (options.device) {
    await applyDeviceEmulation(page, options.device);
  } else {
    await page.setViewport({
      width: options.width || 1920,
      height: options.height || 1080,
      deviceScaleFactor: options.deviceScaleFactor || 2,
    });
  }

  // Set custom user agent if specified
  if (options.userAgent) {
    await page.setUserAgent(options.userAgent);
  }

  // Handle authentication if provided
  if (options.authentication) {
    await page.authenticate(options.authentication);
  }

  // Set custom headers
  if (options.headers) {
    await page.setExtraHTTPHeaders(options.headers);
  }

  // Set cookies if provided
  if (options.cookies) {
    await page.setCookie(...options.cookies);
  }

  return page;
}

async function applyDeviceEmulation(page: Page, device: DeviceEmulation): Promise<void> {
  await page.emulate({
    viewport: {
      width: device.width,
      height: device.height,
      deviceScaleFactor: device.deviceScaleFactor || 2,
      isMobile: device.isMobile,
      hasTouch: device.hasTouch,
      isLandscape: device.isLandscape,
    },
    userAgent: device.userAgent,
  });
}

async function waitForPageLoad(page: Page, url: string, options: ScreenshotOptions): Promise<void> {
  await Promise.race([
    (page as any).goto(url, {
      waitUntil: options.waitUntil || ['load', 'networkidle0'],
      timeout: options.timeout || 30000,
    }),
    page.waitForSelector(options.waitForSelector || 'body', {
      timeout: options.timeout || 30000
    }),
  ]);

  // Custom delay
  if (options.delay) {
    await (page as any).waitForTimeout(options.delay);
  }

  // Wait for network idle
  if (options.waitForNetworkIdle) {
    await page.waitForNetworkIdle();
  }

  // Execute custom JavaScript if provided
  if (options.evaluateScript) {
    await page.evaluate(options.evaluateScript);
  }
}

export async function captureScreenshot(options: ScreenshotOptions): Promise<string> {
  const browser = await getBrowser();
  const page = await setupPage(browser, options);

  try {
    await waitForPageLoad(page, options.url, options);

    // Apply custom CSS if provided
    if (options.css) {
      await page.addStyleTag({ content: options.css });
    }

    // Hide elements if specified
    if (options.hideSelectors) {
      await page.evaluate((selectors) => {
        selectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => {
            (el as HTMLElement).style.display = 'none';
          });
        });
      }, options.hideSelectors);
    }

    // Clip screenshot if dimensions provided
    const clip = options.clip ? {
      x: options.clip.x,
      y: options.clip.y,
      width: options.clip.width,
      height: options.clip.height,
    } : undefined;

    const screenshot = await page.screenshot({
      encoding: 'base64',
      type: options.imageFormat || 'jpeg',
      quality: options.quality || 80,
      fullPage: options.fullPage || false,
      clip,
      omitBackground: options.transparentBackground || false,
      captureBeyondViewport: false,
    });

    return `data:image/${options.imageFormat || 'jpeg'};base64,${screenshot}`;
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    throw new Error('Failed to capture screenshot');
  } finally {
    await page.close();
  }
}