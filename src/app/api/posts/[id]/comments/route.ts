import { NextRequest } from "next/server";

class HttpError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

function extractBackendMessage(errorData: unknown, fallback: string) {
  if (!errorData || typeof errorData !== "object") return fallback;
  const ed = errorData as Record<string, unknown>;

  const direct = ed.message;
  if (typeof direct === "string" && direct.trim()) return direct;

  const nestedError = ed.error;
  if (nestedError && typeof nestedError === "object") {
    const nestedMessage = (nestedError as Record<string, unknown>).message;
    if (typeof nestedMessage === "string" && nestedMessage.trim()) return nestedMessage;
  }

  return fallback;
}

function safeJson(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

const postComment = async (endpoint: string, content: string, token?: string) => {
  const baseUrl = process.env.API_BASE_URL || 'https://social-backend.bijancob.io.vn';
  const fullUrl = `${baseUrl}/${endpoint}`;

  console.log('Comment Backend API Call:', {
    endpoint,
    fullUrl,
    content,
    token: token ? `${token.substring(0, 20)}...` : 'null'
  });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ content }),
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
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

    if (!token) {
      return Response.json(
        { error: "Unauthorized", message: "Missing Bearer token" },
        { status: 401 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const content = typeof body.content === 'string' ? body.content.trim() : '';

    if (!content) {
      return Response.json(
        { error: "Bad Request", message: "Content is required" },
        { status: 400 },
      );
    }

    console.log('Comment API Debug:', {
      postId,
      content,
      authHeader: authHeader ? `${authHeader.substring(0, 20)}...` : 'null'
    });

    const resp = await postComment(`posts/${postId}/comments`, content, token);

    return Response.json(resp);

  } catch (error) {
    if (error instanceof HttpError) {
      console.error('Comment Backend Error:', {
        status: error.status,
        message: error.message,
        details: error.payload,
      });
      return Response.json(
        {
          error: error.message,
          message: error.message,
          details: error.payload,
        },
        { status: error.status },
      );
    }

    console.error('Comment Unexpected Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return Response.json(
      {
        error: errorMessage,
        message: 'Failed to create comment',
        details: safeJson(error),
      },
      { status: 500 }
    );
  }
}
