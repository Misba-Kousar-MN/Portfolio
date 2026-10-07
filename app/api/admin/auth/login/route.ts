import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const isValid = validateAdminCredentials(username, password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid administrator credentials' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: { username, role: 'admin' },
    });

    setSessionCookie(response, username);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication processing failed' },
      { status: 500 }
    );
  }
}
