import { NextRequest } from "next/server";
import { CORE_REGISTER_ENDPOINT } from "../../../routes/core.api";

const post = async (url: string, data: unknown) => {
  const baseUrl = process.env.API_BASE_URL || 'https://social-backend.bijancob.io.vn';
  const fullUrl = `${baseUrl}/${url}`;
  
  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const resp = await post(CORE_REGISTER_ENDPOINT, body);
    
    return Response.json(resp);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return Response.json(
      { 
        error: errorMessage,
        message: 'Failed to register'
      },
      { status: 500 }
    );
  }
}
