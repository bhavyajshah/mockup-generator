import { ExportOptions, ExportResult } from '@/lib/types/export';
import { getBrowser } from './browser';

export async function exportMockup(options: ExportOptions): Promise<ExportResult> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    // Set viewport
    await page.setViewport({
      width: options.width || 1920,
      height: options.height || 1080,
      deviceScaleFactor: 2,
    });

    // Render mockup
    await page.goto(options.mockupUrl, { waitUntil: 'networkidle0' });

    // Apply any custom styles or scripts
    if (options.customCSS) {
      await page.addStyleTag({ content: options.customCSS });
    }

    // Capture the mockup
    const buffer = await page.screenshot({
      type: options.format.toLowerCase() as 'png' | 'jpeg',
      quality: options.quality,
      fullPage: options.fullPage,
    });

    // Convert to base64
    const base64 = buffer.toString('base64');
    const url = `data:image/${options.format.toLowerCase()};base64,${base64}`;

    return {
      url,
      format: options.format,
      size: buffer.length,
    };
  } finally {
    await page.close();
  }
}