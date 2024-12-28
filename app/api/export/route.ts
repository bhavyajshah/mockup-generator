import { NextRequest, NextResponse } from 'next/server';
import { exportMockup } from '@/lib/services/export';
import { validateExportRequest } from '@/lib/utils/validation';
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

    const body = await req.json();
    const validation = validateExportRequest(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const exportedFile = await exportMockup(validation.data);

    return NextResponse.json({
      success: true,
      url: exportedFile.url,
      format: exportedFile.format,
      size: exportedFile.size
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export mockup' },
      { status: 500 }
    );
  }
}