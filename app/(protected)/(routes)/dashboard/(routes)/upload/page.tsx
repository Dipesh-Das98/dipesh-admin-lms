"use client";

import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import { BackendFileUpload } from "@/components/forms/backend-file-upload";
import { Features, UploadResponse } from "@/types";

export default function UploadPage() {
  const handleUploadComplete = (files: UploadResponse[]) => {
    console.log("Upload completed:", files);
    // Toast notification is handled by the component itself
  };

  return (
    <ContentLayout>
      <div>
        <h1 className="text-3xl font-bold">File Upload Test</h1>
        <p className="text-gray-600 mt-2">
          Test the file upload component with your backend API
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Single Image Upload */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Single Image Upload</h3>
          <p className="text-sm text-gray-600">
            Uses single upload endpoint: <code>/upload?category=image</code>
          </p>
          <BackendFileUpload
            accept="image/*"
            maxSize={10 * 1024 * 1024} // 10MB
            maxFiles={3}
            onUploadComplete={handleUploadComplete}
            className="w-full"
          />
        </div>

        <div>
          <h3 className="text-lg font-medium">Force Direct Upload</h3>
          <p className="text-sm text-gray-600 mb-4">
            This will always upload directly to backend, regardless of file
            size.
          </p>
          <BackendFileUpload
            feature={Features.MOVIES}
            accept="video/*,audio/*"
            maxSize={500 * 1024 * 1024} // 500MB
            maxFiles={5}
            onUploadComplete={handleUploadComplete}
            directUpload={true} // Force direct upload
          />
        </div>
      </div>

      {/* Additional Examples */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Bulk File Upload</h2>
        <p className="text-sm text-gray-600">
          Upload up to 5 files - uses multiple upload endpoint for efficiency
        </p>
        <BackendFileUpload
          accept="*/*"
          maxSize={50 * 1024 * 1024} // 50MB
          maxFiles={5}
          onUploadComplete={handleUploadComplete}
          className="w-full"
        />
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Upload Strategy</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            • <strong>Single files (maxFiles=1):</strong> Uses{" "}
            <code>/upload?category=xxx</code>
          </p>
          <p>
            • <strong>Multiple files (maxFiles{">"}1):</strong> Uses{" "}
            <code>/upload/upload-multiple?category=xxx</code>
          </p>
          <p>
            • <strong>Individual files:</strong> Even with multiple files
            selected, if only 1 is chosen, uses single endpoint
          </p>
          <p>• Authentication handled automatically with Bearer token</p>
          <p>• Check browser console for detailed responses</p>
        </div>
      </div>
    </ContentLayout>
  );
}
