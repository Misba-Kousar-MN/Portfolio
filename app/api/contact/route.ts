import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import * as z from 'zod';
import { createMessage, isRateLimitedAsync, isDuplicateSubmissionAsync } from '@/lib/message-service';

const contactSubmissionSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please provide a valid email address')
    .max(200, 'Email must be under 200 characters'),
  subject: z
    .string({ required_error: 'Subject is required' })
    .trim()
    .min(2, 'Subject must be at least 2 characters')
    .max(200, 'Subject must be under 200 characters'),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be under 5000 characters'),
  website: z.string().optional(), // Honeypot field
});

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();

    // 1. Honeypot check (anti-bot)
    if (rawBody.website && String(rawBody.website).trim().length > 0) {
      // Silently accept bot submission without storing to prevent bot adaptation
      return NextResponse.json({
        success: true,
        message: 'Message sent successfully.',
      });
    }

    // 2. Server-side validation
    const validationResult = contactSubmissionSchema.safeParse(rawBody);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message || 'Validation failed';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, subject, message } = validationResult.data;

    // 3. Compute anonymized IP hash for rate-limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);

    // 4. Rate-limiting check
    if (await isRateLimitedAsync(ipHash)) {
      return NextResponse.json(
        { error: 'You have submitted several messages recently. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    // 5. Duplicate submission check
    if (await isDuplicateSubmissionAsync(email, message)) {
      return NextResponse.json(
        { error: 'A duplicate message was recently received. Please do not submit identical messages repeatedly.' },
        { status: 409 }
      );
    }

    // 6. Persist message permanently to durable storage
    await createMessage({
      name,
      email,
      subject,
      message,
      ipHash,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully. Thank you for reaching out!',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected server error occurred while processing your message.' },
      { status: 500 }
    );
  }
}
