import { NextRequest, NextResponse } from 'next/server';
import { optimizeImage } from '@/lib/services/image';
import { validateOptimizeRequest } from '@/lib/utils/validation';
import { rateLimit } from '@/lib/utils/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const limiter = await rateLimit(req);
    if (!limiter.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const options = formData.get('options') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const validation = validateOptimizeRequest(JSON.parse(options || '{}'));
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const optimizedImage = await optimizeImage(file, validation.data);

    return NextResponse.json({
      success: true,
      imageData: optimizedImage
    });
  } catch (error) {
    console.error('Image optimization error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to optimize image' },
      { status: 500 }
    );
  }
}