import { CORE_FEED_LIST_ENDPOINT } from "../../routes/core.api";
import { NextRequest } from "next/server";

const get = async (endpoint: string, params: string, token?: string) => {
  try {
    const baseUrl = process.env.API_BASE_URL || 'https://social-backend.bijancob.io.vn';
    const fullUrl = `${baseUrl}/${endpoint}${params ? `?${params}` : ''}`;
    
    console.log('Backend API Call:', {
      endpoint,
      params,
      fullUrl,
      token: token ? `${token.substring(0, 20)}...` : 'null'
    });
    
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
    
    console.log('Backend API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend API Error:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get Function Error:', error);
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

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
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

    console.log('API Route Debug:', {
      authHeader,
      token: token ? `${token.substring(0, 20)}...` : 'null',
      searchParams: Object.fromEntries(searchParams)
    });

    // Forward query params to backend
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });
    
    const resp = await get(CORE_FEED_LIST_ENDPOINT, params.toString(), token);

    return Response.json(resp);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    console.error('API Route Error:', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : 'No stack'
    });

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
    const body = await req.json();
    
    // Extract token from Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    
    const resp = await post(CORE_FEED_LIST_ENDPOINT, body, token);

    return Response.json(resp);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return Response.json(
      {
        error: errorMessage,
        message: 'Failed to create post'
      },
      { status: 500 }
    );
  }
}
