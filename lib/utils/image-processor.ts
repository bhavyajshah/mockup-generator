// Browser-compatible image processing
export async function processImage(
  input: File,
  settings: any
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions based on settings
        canvas.width = settings.export.resolution.width;
        canvas.height = settings.export.resolution.height;

        if (ctx) {
          // Draw image with basic processing
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Convert to desired format
          const format = settings.export.format.toLowerCase();
          const quality = settings.export.quality / 100;
          resolve(canvas.toDataURL(`image/${format}`, quality));
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(input);
  });
}

export async function validateImage(file: File): Promise<boolean> {
  const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }

  if (file.size > maxSize) {
    throw new Error('File too large');
  }

  return true;
}