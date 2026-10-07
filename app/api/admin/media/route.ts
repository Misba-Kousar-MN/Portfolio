import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { verifyApiAuth } from '@/lib/auth';
import { listStoredMedia, saveStoredFile } from '@/lib/db-storage';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export async function GET(request: NextRequest) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const mediaList = await listStoredMedia();
  return NextResponse.json(mediaList);
}

export async function POST(request: NextRequest) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed formats: JPG, PNG, WebP, SVG, GIF.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds 10MB limit (provided: ${(file.size / (1024 * 1024)).toFixed(2)}MB).` },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = path.extname(file.name) || '.jpg';
    const baseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    const safeFileName = `${baseName}-${Date.now()}${ext}`;

    const url = await saveStoredFile(safeFileName, buffer, file.type);

    return NextResponse.json({
      success: true,
      url,
      name: safeFileName,
      size: file.size,
    });
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json({ error: 'Failed to process media upload.' }, { status: 500 });
  }
}
