import { NextRequest, NextResponse } from 'next/server';
import { captureScreenshot } from '@/lib/services/screenshot';
import { validateScreenshotRequest } from '@/lib/utils/validation';
import { rateLimit } from '@/lib/utils/rate-limit';
import { ScreenshotResponse } from '@/lib/types/screenshot';

export async function POST(req: NextRequest): Promise<NextResponse<ScreenshotResponse>> {
  try {
    // Rate limiting
    const limiter = await rateLimit(req);
    if (!limiter.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validation = validateScreenshotRequest(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Capture screenshot
    const imageData = await captureScreenshot(validation.data);

    return NextResponse.json({
      success: true,
      imageData,
      url: validation.data.url
    }, { status: 200 });

  } catch (error) {
    console.error('Screenshot error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to capture screenshot'
    }, { status: 500 });
  }
}