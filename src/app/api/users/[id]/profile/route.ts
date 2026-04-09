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

const getUserProfile = async (userId: string, params: string, token?: string) => {
  try {
    const baseUrl = process.env.API_BASE_URL || 'https://social-backend.bijancob.io.vn';
    const fullUrl = `${baseUrl}/users/${userId}/profile${params ? `?${params}` : ''}`;
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response: Response;
    try {
      response = await fetch(fullUrl, {
        method: 'GET',
        headers,
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

    // Forward query params
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();

    const resp = await getUserProfile(userId, queryString, token);

    // Transform posts to populate author object
    if (resp?.data?.posts && resp?.data?.user) {
      const user = resp.data.user;
      resp.data.posts = resp.data.posts.map((post: { author: string | object }) => ({
        ...post,
        author: typeof post.author === 'string' ? {
          id: user.id,
          full_name: user.full_name,
          avatar: user.avatar || null,
        } : post.author,
      }));
    }

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
        message: 'Failed to fetch user profile',
        details: safeJson(error),
      },
      { status: 500 }
    );
  }
}
