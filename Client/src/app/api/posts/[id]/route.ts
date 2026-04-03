import { NextRequest } from "next/server";
import { CORE_FEED_DETAIL_ENDPOINT } from "@/app/routes/core.api";

const get = async (endpoint: string, token?: string) => {
  const baseUrl = process.env.API_BASE_URL || 'https://social-backend.bijancob.io.vn';
  const fullUrl = `${baseUrl}/${endpoint}`;
  
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
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: postId } = await params;
    
    // Extract token from Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    
    const resp = await get(CORE_FEED_DETAIL_ENDPOINT(postId), token);
    
    return Response.json(resp);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return Response.json(
      { 
        error: errorMessage,
        message: 'Failed to get post detail'
      },
      { status: 500 }
    );
  }
}
