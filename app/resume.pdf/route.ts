import { NextRequest, NextResponse } from 'next/server';
import { getStoredFile } from '@/lib/db-storage';

export async function GET(request: NextRequest) {
  const file = await getStoredFile('resume.pdf');
  if (!file) {
    return NextResponse.json({ error: 'Resume PDF not found' }, { status: 404 });
  }

  return new NextResponse(file.buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="Misba_Kousar_Resume.pdf"',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
