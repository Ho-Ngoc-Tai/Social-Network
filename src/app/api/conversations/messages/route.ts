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

const sendMessage = async (receiverId: string, content: string, token?: string) => {
  try {
    const baseUrl = process.env.API_BASE_URL || "https://social-backend.bijancob.io.vn";
    const fullUrl = `${baseUrl}/conversations/messages`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let response: Response;
    try {
      response = await fetch(fullUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({ receiverId, content }),
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

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : undefined;

    if (!token) {
      return Response.json(
        { error: "Unauthorized", message: "Missing Bearer token" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { receiverId, content } = body;

    if (!receiverId || !content) {
      return Response.json(
        { error: "Bad Request", message: "receiverId and content are required" },
        { status: 400 },
      );
    }

    const resp = await sendMessage(receiverId, content, token);

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
        message: "Failed to send message",
        details: safeJson(error),
      },
      { status: 500 },
    );
  }
}
