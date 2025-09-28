import { auth } from "@/auth";

/**
 * Helper function to make authenticated API calls to the backend
 */
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const session = await auth();
  
  if (!session?.user?.backendToken) {
    throw new Error("No authentication token available");
  }

  const baseUrl = process.env.BACKEND_API_URL || "http://localhost:3001";
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.user.backendToken}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Client-side helper function to make authenticated API calls
 */
export async function clientApiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`/api/backend-proxy${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
