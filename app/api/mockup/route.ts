import { NextRequest, NextResponse } from 'next/server';
import { MockupSettingsSchema } from '@/lib/types';
import { rateLimit } from '@/lib/utils/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const limiter = await rateLimit(req);
    if (!limiter.success) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const settingsJson = formData.get('settings') as string;

    if (!file || !settingsJson) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Validate settings
    const settings = MockupSettingsSchema.parse(JSON.parse(settingsJson));

    // Return the file as-is for now since processing happens client-side
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': file.type,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error processing mockup:', error);
    return new NextResponse(
      'Error processing mockup',
      { status: 500 }
    );
  }
}