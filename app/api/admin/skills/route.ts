import { NextRequest, NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/auth';
import { getPortfolioContentAsync, savePortfolioContent } from '@/lib/content-service';

export async function GET(request: NextRequest) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const content = await getPortfolioContentAsync();
  return NextResponse.json({
    skills: content.skills,
    categories: content.skillCategories,
  });
}

export async function PUT(request: NextRequest) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { skills, skillCategories } = await request.json();
    const content = await getPortfolioContentAsync();

    if (skills) {
      content.skills = skills;
    }
    if (skillCategories) {
      content.skillCategories = skillCategories;
    }

    await savePortfolioContent(content);
    return NextResponse.json({ success: true, skills: content.skills, skillCategories: content.skillCategories });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update skills' }, { status: 500 });
  }
}
