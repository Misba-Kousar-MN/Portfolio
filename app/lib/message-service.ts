import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { ContactMessage, MessageStatus, MessageStats } from '@/types';
import { getKVStore, setKVStore } from '@/lib/db-storage';

const DATA_DIR = path.join(process.cwd(), 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'contact-messages.json');

let inMemoryMessages: ContactMessage[] | null = null;

function ensureDataDirectory(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getAllMessages(): ContactMessage[] {
  if (inMemoryMessages !== null) {
    return inMemoryMessages;
  }

  try {
    ensureDataDirectory();
    if (fs.existsSync(MESSAGES_FILE)) {
      const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        inMemoryMessages = parsed;
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error reading contact messages from local file:', error);
  }

  inMemoryMessages = [];
  return [];
}

export async function getAllMessagesAsync(): Promise<ContactMessage[]> {
  try {
    const raw = await getKVStore('contact_messages');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        inMemoryMessages = parsed;
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error reading contact messages from KV store:', error);
  }

  return getAllMessages();
}

export async function saveMessages(messages: ContactMessage[]): Promise<void> {
  inMemoryMessages = messages;

  try {
    ensureDataDirectory();
    const tempFile = `${MESSAGES_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(messages, null, 2), 'utf-8');
    fs.renameSync(tempFile, MESSAGES_FILE);
  } catch (error) {
    console.warn('Local disk file write notice for contact messages:', error);
  }

  try {
    await setKVStore('contact_messages', JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error('Failed to save contact messages to KV store:', error);
  }
}

export async function getMessageByIdAsync(id: string): Promise<ContactMessage | undefined> {
  const messages = await getAllMessagesAsync();
  return messages.find((m) => m.id === id);
}

export function getMessageById(id: string): ContactMessage | undefined {
  const messages = getAllMessages();
  return messages.find((m) => m.id === id);
}

export async function createMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
  ipHash?: string | undefined;
}): Promise<ContactMessage> {
  const messages = await getAllMessagesAsync();
  const now = new Date().toISOString();

  const newMessage: ContactMessage = {
    id: `msg-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
    name: input.name.trim(),
    email: input.email.trim(),
    subject: input.subject.trim(),
    message: input.message.trim(),
    status: 'UNREAD',
    createdAt: now,
    updatedAt: now,
    ipHash: input.ipHash,
  };

  // Insert newest at beginning
  messages.unshift(newMessage);
  await saveMessages(messages);

  return newMessage;
}

export async function updateMessageStatus(id: string, status: MessageStatus): Promise<ContactMessage | null> {
  const messages = await getAllMessagesAsync();
  const index = messages.findIndex((m) => m.id === id);
  if (index === -1) return null;

  const updated: ContactMessage = {
    ...messages[index]!,
    status,
    updatedAt: new Date().toISOString(),
  };

  messages[index] = updated;
  await saveMessages(messages);
  return updated;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const messages = await getAllMessagesAsync();
  const initialLength = messages.length;
  const filtered = messages.filter((m) => m.id !== id);

  if (filtered.length === initialLength) {
    return false;
  }

  await saveMessages(filtered);
  return true;
}

export async function getMessageStatsAsync(): Promise<MessageStats> {
  const messages = await getAllMessagesAsync();
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const total = messages.length;
  const unread = messages.filter((m) => m.status === 'UNREAD').length;
  const thisWeek = messages.filter((m) => new Date(m.createdAt).getTime() >= oneWeekAgo).length;

  return { total, unread, thisWeek };
}

export function getMessageStats(): MessageStats {
  const messages = getAllMessages();
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const total = messages.length;
  const unread = messages.filter((m) => m.status === 'UNREAD').length;
  const thisWeek = messages.filter((m) => new Date(m.createdAt).getTime() >= oneWeekAgo).length;

  return { total, unread, thisWeek };
}

export async function isRateLimitedAsync(ipHash: string): Promise<boolean> {
  if (!ipHash) return false;
  const messages = await getAllMessagesAsync();
  const oneHourAgo = Date.now() - 60 * 60 * 1000;

  const recentFromIp = messages.filter(
    (m) => m.ipHash === ipHash && new Date(m.createdAt).getTime() >= oneHourAgo
  );

  return recentFromIp.length >= 5;
}

export function isRateLimited(ipHash: string): boolean {
  if (!ipHash) return false;
  const messages = getAllMessages();
  const oneHourAgo = Date.now() - 60 * 60 * 1000;

  const recentFromIp = messages.filter(
    (m) => m.ipHash === ipHash && new Date(m.createdAt).getTime() >= oneHourAgo
  );

  return recentFromIp.length >= 5;
}

export async function isDuplicateSubmissionAsync(email: string, message: string): Promise<boolean> {
  const messages = await getAllMessagesAsync();
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

  const duplicate = messages.find(
    (m) =>
      m.email.toLowerCase() === email.toLowerCase() &&
      m.message.trim() === message.trim() &&
      new Date(m.createdAt).getTime() >= fiveMinutesAgo
  );

  return Boolean(duplicate);
}

export function isDuplicateSubmission(email: string, message: string): boolean {
  const messages = getAllMessages();
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

  const duplicate = messages.find(
    (m) =>
      m.email.toLowerCase() === email.toLowerCase() &&
      m.message.trim() === message.trim() &&
      new Date(m.createdAt).getTime() >= fiveMinutesAgo
  );

  return Boolean(duplicate);
}
