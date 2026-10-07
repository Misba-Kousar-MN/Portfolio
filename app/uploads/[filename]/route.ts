import { NextRequest, NextResponse } from 'next/server';
import { getStoredFile } from '@/lib/db-storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename;
  if (!filename) {
    return NextResponse.json({ error: 'Filename required' }, { status: 400 });
  }

  const file = await getStoredFile(filename);
  if (!file) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  return new NextResponse(file.buffer, {
    status: 200,
    headers: {
      'Content-Type': file.mimeType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
