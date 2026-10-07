import { NextRequest, NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/auth';
import { getAllMessagesAsync, getMessageStatsAsync } from '@/lib/message-service';
import type { ContactMessage, MessageStatus } from '@/types';

export async function GET(request: NextRequest) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const statusFilter = searchParams.get('status') as MessageStatus | 'ALL' | null;
  const searchQuery = (searchParams.get('search') || '').toLowerCase().trim();
  const sortBy = searchParams.get('sort') || 'newest'; // 'newest' or 'oldest'

  let messages = await getAllMessagesAsync();

  // 1. Status Filter
  if (statusFilter && statusFilter !== 'ALL') {
    messages = messages.filter((m) => m.status === statusFilter);
  }

  // 2. Search Query Filter
  if (searchQuery) {
    messages = messages.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery) ||
        m.email.toLowerCase().includes(searchQuery) ||
        m.subject.toLowerCase().includes(searchQuery) ||
        m.message.toLowerCase().includes(searchQuery)
    );
  }

  // 3. Sorting
  messages.sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return sortBy === 'oldest' ? timeA - timeB : timeB - timeA;
  });

  const stats = await getMessageStatsAsync();

  return NextResponse.json({
    messages,
    stats,
  });
}
