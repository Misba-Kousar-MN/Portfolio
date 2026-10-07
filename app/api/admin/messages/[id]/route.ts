import { NextRequest, NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/auth';
import { getMessageByIdAsync, updateMessageStatus, deleteMessage } from '@/lib/message-service';
import type { MessageStatus } from '@/types';

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

  const message = await getMessageByIdAsync(params.id);
  if (!message) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  }

  return NextResponse.json(message);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const status = body.status as MessageStatus;

    if (!status || !['UNREAD', 'READ', 'ARCHIVED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status parameter' }, { status: 400 });
    }

    const updated = await updateMessageStatus(params.id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update message status' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const isAuth = verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const deleted = await deleteMessage(params.id);
  if (!deleted) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Message deleted successfully' });
}
