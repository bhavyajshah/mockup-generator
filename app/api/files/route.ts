import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/supabase/storage';

export async function GET(req: NextRequest) {
  try {
    const files = await storage.listFiles();
    return NextResponse.json({ success: true, files });
  } catch (error) {
    console.error('List files error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list files' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { path } = await req.json();
    
    if (!path) {
      return NextResponse.json(
        { success: false, error: 'No file path provided' },
        { status: 400 }
      );
    }

    const result = await storage.deleteFile(path);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete file error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}