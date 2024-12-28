import sharp from 'sharp';
import { OptimizeOptions } from '@/lib/types/image';

export async function optimizeImage(
  file: File,
  options: OptimizeOptions
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  let image = sharp(buffer);

  // Apply optimizations
  if (options.resize) {
    image = image.resize(options.resize.width, options.resize.height, {
      fit: options.resize.fit || 'contain',
      background: options.resize.background || { r: 255, g: 255, b: 255, alpha: 0 }
    });
  }

  if (options.format === 'jpeg') {
    image = image.jpeg({ quality: options.quality || 80 });
  } else if (options.format === 'png') {
    image = image.png({ quality: options.quality || 80 });
  } else if (options.format === 'webp') {
    image = image.webp({ quality: options.quality || 80 });
  }

  if (options.blur) {
    image = image.blur(options.blur);
  }

  if (options.sharpen) {
    image = image.sharpen();
  }

  const optimizedBuffer = await image.toBuffer();
  return `data:image/${options.format};base64,${optimizedBuffer.toString('base64')}`;
}