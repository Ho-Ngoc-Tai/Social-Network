import { NextRequest } from "next/server";

class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public payload?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

function safeJson(error: unknown): object {
  if (typeof error !== "object" || error === null) return { message: String(error) };
  return JSON.parse(
    JSON.stringify(error, Object.getOwnPropertyNames(error)),
  );
}

function extractBackendMessage(errorData: unknown, fallback: string): string {
  if (!errorData || typeof errorData !== "object") return fallback;
  const msg = (errorData as { message?: string; error?: string }).message ??
    (errorData as { error?: string }).error;
  return msg ?? fallback;
}

const updateUser = async (userId: string, data: unknown, token?: string) => {
  try {
    const baseUrl = process.env.API_BASE_URL || 'https://social-backend.bijancob.io.vn';
    const fullUrl = `${baseUrl}/users/${userId}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response: Response;
    try {
      response = await fetch(fullUrl, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw new HttpError(
        error instanceof Error ? error.message : "Failed to reach backend",
        502,
        { cause: error, url: fullUrl },
      );
    }

    if (!response.ok) {
      const rawText = await response.text().catch(() => "");
      let errorData: unknown = {};
      try {
        errorData = rawText ? JSON.parse(rawText) : {};
      } catch {
        errorData = { raw: rawText };
      }

      const message = extractBackendMessage(errorData, `HTTP error! status: ${response.status}`);
      throw new HttpError(message, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    
    const body = await req.json();
    const resp = await updateUser(userId, body, token);

    return Response.json(resp);

  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(
        { 
          error: error.message, 
          message: error.message,
          details: error.payload,
        },
        { status: error.status },
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return Response.json(
      { 
        error: errorMessage, 
        message: 'Failed to update user',
        details: safeJson(error),
      },
      { status: 500 }
    );
  }
}
