import { NextRequest, NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const isAuth = verifyApiAuth(request);

  if (!isAuth) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: { role: 'admin' },
  });
}
