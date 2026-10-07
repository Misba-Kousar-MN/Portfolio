import { NextRequest, NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/auth';
import { getPortfolioContentAsync, savePortfolioContent } from '@/lib/content-service';
import type { Project } from '@/types';

// GET all projects (including drafts) for admin
export async function GET(request: NextRequest) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const content = await getPortfolioContentAsync();
  return NextResponse.json(content.projects);
}

// POST create a new project
export async function POST(request: NextRequest) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const content = await getPortfolioContentAsync();

    const name = body.name?.trim();
    if (!name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    const slug = body.id?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check for duplicate slug
    if (content.projects.some((p) => p.id === slug)) {
      return NextResponse.json({ error: `Project with ID '${slug}' already exists` }, { status: 400 });
    }

    const maxOrder = content.projects.reduce((max, p) => Math.max(max, p.order || 0), 0);

    const newProject: Project = {
      id: slug,
      name,
      tagline: body.tagline || '',
      description: body.description || '',
      category: body.category || 'Software Engineering',
      problem: body.problem || '',
      solution: body.solution || '',
      challenges: body.challenges || [],
      impact: body.impact || '',
      features: Array.isArray(body.features) ? body.features : [],
      tech: Array.isArray(body.tech) ? body.tech : [],
      image: body.image || '',
      github: body.github || '',
      demo: body.demo || '',
      caseStudy: `/case-studies/${slug}`,
      badge: body.badge || undefined,
      featured: Boolean(body.featured),
      published: body.published !== undefined ? Boolean(body.published) : true,
      order: body.order || maxOrder + 1,
      results: Array.isArray(body.results) ? body.results : [],
      architecture: Array.isArray(body.architecture) ? body.architecture : [],
    };

    content.projects.push(newProject);
    await savePortfolioContent(content);

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

// PUT batch reorder / update all projects
export async function PUT(request: NextRequest) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { projects } = await request.json();
    if (!Array.isArray(projects)) {
      return NextResponse.json({ error: 'Projects array is required' }, { status: 400 });
    }

    const content = await getPortfolioContentAsync();
    content.projects = projects;
    await savePortfolioContent(content);

    return NextResponse.json({ success: true, projects: content.projects });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update projects' }, { status: 500 });
  }
}
