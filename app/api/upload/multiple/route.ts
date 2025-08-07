import { auth } from "@/auth";
import { MultipleUploadResponse } from "@/types/upload.type";
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
    
    // Validate that we have files
    const files = formData.getAll("files") as File[];
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Forward the request to the backend multiple upload endpoint
    const baseUrl = process.env.BACKEND_API_URL ;
    
    const response = await fetch(`${baseUrl}/upload/upload-multiple?feature=${category}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${session.user.backendToken}`,
        // Don't set Content-Type for FormData, let fetch handle it
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend multiple upload error:", response.status, errorText);
      
      return NextResponse.json(
        { 
          error: `Upload failed: ${response.status} ${response.statusText}`,
          details: errorText 
        },
        { status: response.status }
      );
    }

    const result: MultipleUploadResponse = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error("Multiple file upload API error:", error);
    
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
