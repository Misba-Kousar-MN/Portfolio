import { NextRequest, NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/auth';
import { getPortfolioContentAsync, savePortfolioContent } from '@/lib/content-service';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const content = await getPortfolioContentAsync();
  const project = content.projects.find((p) => p.id === params.id);

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const content = await getPortfolioContentAsync();
    const index = content.projects.findIndex((p) => p.id === params.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Update fields while preserving id/slug integrity unless explicitly migrating
    const updatedProject = {
      ...content.projects[index],
      ...body,
      id: params.id, // preserve route id
      caseStudy: `/case-studies/${params.id}`,
    };

    content.projects[index] = updatedProject;
    await savePortfolioContent(content);

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const content = await getPortfolioContentAsync();
  const initialLength = content.projects.length;
  content.projects = content.projects.filter((p) => p.id !== params.id);

  if (content.projects.length === initialLength) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  await savePortfolioContent(content);
  return NextResponse.json({ success: true, message: `Project ${params.id} deleted` });
}
