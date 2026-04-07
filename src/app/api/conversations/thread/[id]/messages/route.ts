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

function safeJson(obj: unknown): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return String(obj);
  }
}

function extractBackendMessage(errorData: unknown, fallback: string): string {
  if (!errorData || typeof errorData !== "object") return fallback;
  const ed = errorData as Record<string, unknown>;
  if (typeof ed.message === "string" && ed.message) return ed.message;
  if (typeof ed.error === "string" && ed.error) return ed.error;
  return fallback;
}

const getMessages = async (userId: string, token?: string, limit: number = 50) => {
  try {
    const baseUrl = process.env.API_BASE_URL || "https://social-backend.bijancob.io.vn";
    const fullUrl = `${baseUrl}/conversations/thread/${encodeURIComponent(userId)}/messages?limit=${limit}`;

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let response: Response;
    try {
      response = await fetch(fullUrl, {
        method: "GET",
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
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : undefined;

    if (!token) {
      return Response.json(
        { error: "Unauthorized", message: "Missing Bearer token" },
        { status: 401 },
      );
    }

    const resp = await getMessages(userId, token);

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

    const errorMessage = error instanceof Error ? error.message : "Internal server error";

    return Response.json(
      {
        error: errorMessage,
        message: "Failed to fetch messages",
        details: safeJson(error),
      },
      { status: 500 },
    );
  }
}
