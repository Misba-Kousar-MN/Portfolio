import { NextRequest, NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/auth';
import { getPortfolioContentAsync, savePortfolioContent } from '@/lib/content-service';
import type { Achievement } from '@/types';

export async function GET(request: NextRequest) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const content = await getPortfolioContentAsync();
  return NextResponse.json(content.achievements);
}

export async function POST(request: NextRequest) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const content = await getPortfolioContentAsync();

    if (!body.label) {
      return NextResponse.json({ error: 'Achievement label is required' }, { status: 400 });
    }

    const maxOrder = content.achievements.reduce((max, a) => Math.max(max, a.order || 0), 0);

    const newAchievement: Achievement = {
      id: body.id || `ach-${Date.now()}`,
      label: body.label,
      subtext: body.subtext || '',
      prefix: body.prefix || '',
      value: body.isNumeric ? Number(body.value || 0) : undefined,
      textValue: !body.isNumeric ? String(body.textValue || '') : undefined,
      suffix: body.suffix || '',
      decimals: Number(body.decimals || 0),
      isNumeric: Boolean(body.isNumeric),
      order: body.order || maxOrder + 1,
      published: body.published !== undefined ? Boolean(body.published) : true,
    };

    content.achievements.push(newAchievement);
    await savePortfolioContent(content);

    return NextResponse.json({ success: true, achievement: newAchievement }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { achievements } = await request.json();
    if (!Array.isArray(achievements)) {
      return NextResponse.json({ error: 'Achievements array is required' }, { status: 400 });
    }

    const content = await getPortfolioContentAsync();
    content.achievements = achievements;
    await savePortfolioContent(content);

    return NextResponse.json({ success: true, achievements: content.achievements });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update achievements' }, { status: 500 });
  }
}
