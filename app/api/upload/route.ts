import { auth } from "@/auth";
import { UploadResponse } from "@/types/upload.type";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.backendToken) {
      return NextResponse.json(
        { error: "No authentication token available" },
        { status: 401 }
      );
    }

    // Get category from query params
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("feature") || "general";

    // Get the form data from the request
    const formData = await request.formData();
    
    // Validate that we have a file
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Forward the request to the backend
    const baseUrl = process.env.BACKEND_API_URL || "http://localhost:3001";
    
    const response = await fetch(`${baseUrl}/upload?feature=${category}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${session.user.backendToken}`,
        // Don't set Content-Type for FormData, let fetch handle it
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend upload error:", response.status, errorText);
      
      return NextResponse.json(
        { 
          error: `Upload failed: ${response.status} ${response.statusText}`,
          details: errorText 
        },
        { status: response.status }
      );
    }

    const result: UploadResponse = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error("File upload API error:", error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Upload failed",
        details: "Internal server error" 
      },
      { status: 500 }
    );
  }
}

// Set the runtime to nodejs to handle larger files
export const runtime = 'nodejs';

// Optional: Configure maximum request size (Next.js default is 4MB for API routes)
// You can increase this in next.config.ts if needed
