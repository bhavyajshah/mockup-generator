import { NextRequest } from 'next/server';

interface RateLimitContext {
  ip: string;
  count: number;
  timestamp: number;
}

const ratelimits = new Map<string, RateLimitContext>();

export async function rateLimit(
  request: NextRequest,
  limit = 10,
  window = 60000
) {
  const ip = request.ip ?? '127.0.0.1';
  const now = Date.now();
  const context = ratelimits.get(ip);

  if (!context) {
    ratelimits.set(ip, { ip, count: 1, timestamp: now });
    return { success: true };
  }

  if (now - context.timestamp > window) {
    context.count = 1;
    context.timestamp = now;
    return { success: true };
  }

  if (context.count >= limit) {
    return { success: false };
  }

  context.count++;
  return { success: true };
}