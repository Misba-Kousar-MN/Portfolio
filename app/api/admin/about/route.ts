import { NextRequest, NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/auth';
import { getPortfolioContentAsync, savePortfolioContent } from '@/lib/content-service';

export async function GET(request: NextRequest) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const content = await getPortfolioContentAsync();
  return NextResponse.json(content.about);
}

export async function PUT(request: NextRequest) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updatedAbout = await request.json();
    const content = await getPortfolioContentAsync();
    content.about = { ...content.about, ...updatedAbout };
    await savePortfolioContent(content);

    return NextResponse.json({ success: true, about: content.about });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update about content' }, { status: 500 });
  }
}
