import { NextRequest } from "next/server";
import { CORE_CURRENT_USER_ENDPOINT } from "../../../routes/core.api";

const get = async (url: string, token: string) => {
  const baseUrl = process.env.API_BASE_URL || 'https://social-backend.bijancob.io.vn';
  const fullUrl = `${baseUrl}/${url}`;
  
  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const resp = await get(CORE_CURRENT_USER_ENDPOINT, token);
    
    return Response.json(resp);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return Response.json(
      { 
        error: errorMessage,
        message: 'Failed to get current user'
      },
      { status: 500 }
    );
  }
}
