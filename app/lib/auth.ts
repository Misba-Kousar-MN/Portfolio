import crypto from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_USERNAME = process.env['ADMIN_USERNAME'] || 'admin';
const ADMIN_PASSWORD = process.env['ADMIN_PASSWORD'] || 'MisbaAdmin2026!';
const SESSION_SECRET = process.env['ADMIN_SESSION_SECRET'] || 'antigravity-secure-portfolio-secret-key-2026';
const COOKIE_NAME = 'admin_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface SessionPayload {
  username: string;
  role: 'admin';
  exp: number;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

function createSignature(data: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export function generateSessionToken(username: string): string {
  const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
  const payload: SessionPayload = {
    username,
    role: 'admin',
    exp: Date.now() + SESSION_DURATION_MS,
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = createSignature(`${encodedHeader}.${encodedPayload}`, SESSION_SECRET);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const encodedHeader = parts[0];
    const encodedPayload = parts[1];
    const signature = parts[2];

    if (!encodedHeader || !encodedPayload || !signature) return null;

    const expectedSignature = createSignature(`${encodedHeader}.${encodedPayload}`, SESSION_SECRET);

    const sigBuffer = Buffer.from(signature);
    const expectedSigBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedSigBuffer.length) return null;
    if (!crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)) return null;

    const payload: SessionPayload = JSON.parse(base64UrlDecode(encodedPayload));
    if (payload.exp < Date.now()) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

export function validateAdminCredentials(username: string, password: string): boolean {
  if (!username || !password) return false;

  const expectedUser = ADMIN_USERNAME;
  const expectedPass = ADMIN_PASSWORD;

  const userMatch = crypto.timingSafeEqual(
    Buffer.from(username.padEnd(expectedUser.length, ' ')),
    Buffer.from(expectedUser.padEnd(username.length, ' '))
  ) && username.length === expectedUser.length;

  const passMatch = crypto.timingSafeEqual(
    Buffer.from(password.padEnd(expectedPass.length, ' ')),
    Buffer.from(expectedPass.padEnd(password.length, ' '))
  ) && password.length === expectedPass.length;

  return userMatch && passMatch;
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie || !sessionCookie.value) return false;

  const session = verifySessionToken(sessionCookie.value);
  return session !== null;
}

export function verifyApiAuth(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const session = verifySessionToken(token);
  return session !== null;
}

export function setSessionCookie(response: NextResponse, username: string): void {
  const token = generateSessionToken(username);
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env['NODE_ENV'] === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env['NODE_ENV'] === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
