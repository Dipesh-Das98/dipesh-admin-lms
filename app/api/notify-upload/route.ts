import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { Features } from "@/types/upload.type";

interface UploadNotificationData {
  fileUrls: string[];
  feature: Features;
  metadata?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const data: UploadNotificationData = await request.json();
    
    // Validate the notification data
    if (!data.fileUrls || !Array.isArray(data.fileUrls) || data.fileUrls.length === 0) {
      return NextResponse.json(
        { error: "File URLs are required" },
        { status: 400 }
      );
    }

    // Log the upload notification for analytics or processing
    console.log("Upload notification received:", {
      userId: session.user.id,
      fileCount: data.fileUrls.length,
      feature: data.feature,
      timestamp: new Date().toISOString(),
    });

    // You can add additional processing here, such as:
    // - Updating database records
    // - Sending notifications
    // - Analytics tracking
    // - etc.

    return NextResponse.json({
      success: true,
      message: "Upload notification received",
      data: {
        filesProcessed: data.fileUrls.length,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error("Upload notification API error:", error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Notification failed",
        details: "Internal server error" 
      },
      { status: 500 }
    );
  }
}
