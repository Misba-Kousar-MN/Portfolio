import { NextRequest, NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/auth';
import { getPortfolioContentAsync, savePortfolioContent } from '@/lib/content-service';
import { saveStoredFile } from '@/lib/db-storage';

const MAX_PDF_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(request: NextRequest) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Invalid file format. Only PDF files (.pdf) are allowed.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_PDF_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the 15MB limit (provided: ${(file.size / (1024 * 1024)).toFixed(2)}MB).` },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Verify PDF Magic Bytes (%PDF-)
    const header = buffer.subarray(0, 5).toString('ascii');
    if (!header.startsWith('%PDF-')) {
      return NextResponse.json(
        { error: 'Invalid file contents. The file does not contain a valid PDF binary header (%PDF-).' },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const safeFileName = `resume-${timestamp}.pdf`;

    // Persist into production durable storage engine
    const publicUrl = await saveStoredFile(safeFileName, buffer, 'application/pdf');
    await saveStoredFile('resume.pdf', buffer, 'application/pdf');

    // Update content service metadata
    const content = await getPortfolioContentAsync();
    content.resume = {
      url: publicUrl,
      fileName: file.name || 'Misba_Kousar_Resume.pdf',
      fileSize: file.size,
      updatedAt: new Date().toISOString(),
    };
    content.socialLinks.resume = publicUrl;

    await savePortfolioContent(content);

    return NextResponse.json({
      success: true,
      message: 'Resume PDF successfully uploaded and published.',
      resume: content.resume,
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json({ error: 'Failed to process resume upload.' }, { status: 500 });
  }
}
