import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/app/config/env';

const extractBackendMessage = (data: unknown, fallback: string): string => {
  if (typeof data === 'object' && data !== null) {
    const msg = (data as { message?: string }).message;
    if (msg) return msg;
    const err = (data as { error?: string }).error;
    if (err) return err;
  }
  return fallback;
};

class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public data: unknown
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    const response = await fetch(`${env.apiBaseUrl}/users/blocks`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const rawText = await response.text().catch(() => '');
      let errorData: unknown = {};
      try {
        errorData = rawText ? JSON.parse(rawText) : {};
      } catch {
        errorData = { raw: rawText };
      }

      const message = extractBackendMessage(errorData, `HTTP error! status: ${response.status}`);
      throw new HttpError(message, response.status, errorData);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { message: error.message, data: error.data },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to fetch blocked users' },
      { status: 500 }
    );
  }
}
