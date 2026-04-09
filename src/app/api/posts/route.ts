import { CORE_FEED_LIST_ENDPOINT } from "../../routes/core.api";
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

const get = async (endpoint: string, params: string, token?: string) => {
  try {
    const baseUrl = process.env.API_BASE_URL || 'https://social-backend.bijancob.io.vn';
    const fullUrl = `${baseUrl}/${endpoint}${params ? `?${params}` : ''}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = extractBackendMessage(errorData, `HTTP error! status: ${response.status}`);
      throw new HttpError(message, response.status, errorData);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

const post = async (url: string, data: unknown, token?: string) => {
  const baseUrl = process.env.API_BASE_URL || 'https://social-backend.bijancob.io.vn';
  const fullUrl = `${baseUrl}/${url}`;

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
};

export async function GET(req: NextRequest) {
  console.log('API Route Called:', {
    url: req.url,
    method: req.method,
    headers: Object.fromEntries(req.headers.entries())
  });
  
  try {
    const { searchParams } = new URL(req.url);
    const params = new URLSearchParams();

    // Extract token from Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

    // Forward query params to backend
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });
    
    const resp = await get(CORE_FEED_LIST_ENDPOINT, params.toString(), token);

    return Response.json(resp);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return Response.json(
      {
        error: errorMessage,
        message: 'Failed to load feed'
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as unknown;
    
    // Extract token from Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

    if (!token) {
      return Response.json(
        {
          error: "Unauthorized",
          message: "Missing Bearer token",
        },
        { status: 401 },
      );
    }

    const payload = (() => {
      if (!body || typeof body !== "object") return null;
      const b = body as Record<string, unknown>;

      const content = typeof b.content === "string" ? b.content : null;
      const image = typeof b.image === "string" ? b.image : undefined;
      const status = typeof b.status === "string" ? b.status : "published";

      const filesRaw = b.files;
      const files = Array.isArray(filesRaw)
        ? filesRaw.filter((x): x is string => typeof x === "string")
        : [];

      if (!content) return null;

      const result: Record<string, unknown> = { content };
      result.image = typeof image === "string" ? image : "";
      if (filesRaw !== undefined) {
        result.files = files;
      }
      result.status = status;
      return result;
    })();

    if (!payload) {
      return Response.json(
        {
          error: "Bad Request",
          message: "Invalid payload",
        },
        { status: 400 },
      );
    }
    
    const resp = await post(CORE_FEED_LIST_ENDPOINT, payload, token);

    return Response.json(resp);

  } catch (error) {
    if (error instanceof HttpError) {
      console.error('Create Post Backend Error:', {
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

    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return Response.json(
      {
        error: errorMessage,
        message: 'Failed to create post',
        details: safeJson(error),
      },
      { status: 500 }
    );
  }
}
