import { NextRequest, NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/auth';
import { getPortfolioContentAsync, savePortfolioContent } from '@/lib/content-service';
import type { TimelineItem } from '@/types';

export async function GET(request: NextRequest) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const content = await getPortfolioContentAsync();
  return NextResponse.json(content.timeline);
}

export async function POST(request: NextRequest) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const content = await getPortfolioContentAsync();

    if (!body.title || !body.year) {
      return NextResponse.json({ error: 'Title and year are required' }, { status: 400 });
    }

    const maxOrder = content.timeline.reduce((max, t) => Math.max(max, t.order || 0), 0);

    const newMilestone: TimelineItem = {
      id: body.id || `t-${Date.now()}`,
      year: body.year,
      title: body.title,
      description: body.description || '',
      order: body.order || maxOrder + 1,
      published: body.published !== undefined ? Boolean(body.published) : true,
    };

    content.timeline.push(newMilestone);
    await savePortfolioContent(content);

    return NextResponse.json({ success: true, milestone: newMilestone }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create timeline milestone' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { timeline } = await request.json();
    if (!Array.isArray(timeline)) {
      return NextResponse.json({ error: 'Timeline array is required' }, { status: 400 });
    }

    const content = await getPortfolioContentAsync();
    content.timeline = timeline;
    await savePortfolioContent(content);

    return NextResponse.json({ success: true, timeline: content.timeline });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update timeline' }, { status: 500 });
  }
}
