import { NextRequest, NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/auth';
import { getPortfolioContentAsync, savePortfolioContent } from '@/lib/content-service';

export async function GET(request: NextRequest) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const content = await getPortfolioContentAsync();
  return NextResponse.json(content.hero);
}

export async function PUT(request: NextRequest) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updatedHero = await request.json();
    const content = await getPortfolioContentAsync();
    content.hero = { ...content.hero, ...updatedHero };
    await savePortfolioContent(content);

    return NextResponse.json({ success: true, hero: content.hero });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update hero content' }, { status: 500 });
  }
}
