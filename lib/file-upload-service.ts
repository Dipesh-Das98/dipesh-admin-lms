import { MultipleUploadResponse, UploadResponse, Features } from "@/types/upload.type";
import { env } from "@/env";

interface UploadOptions {
  feature: Features;
  files: File[];
  backendToken: string;
  directUpload?: boolean;
  backendUrl?: string;
  onProgress?: (progress: number) => void;
}

interface UploadService {
  uploadFiles: (options: UploadOptions) => Promise<UploadResponse[]>;
  notifyUploadComplete: (
    files: UploadResponse[],
    feature: Features
  ) => Promise<void>;
}

class FileUploadService implements UploadService {
  private getBackendBaseUrl(backendUrl?: string): string {
    if (backendUrl) return backendUrl;
    return env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
  }

  private isLargeFile(file: File): boolean {
    return file.size > 4 * 1024 * 1024; // 4MB
  }

  private hasLargeFiles(files: File[]): boolean {
    return files.some(this.isLargeFile);
  }

  async uploadFiles(options: UploadOptions): Promise<UploadResponse[]> {
    const {
      files,
      feature,
      backendToken,
      directUpload = false,
      backendUrl,
    } = options;

    // Determine upload method
    const shouldUseDirectUpload = directUpload || this.hasLargeFiles(files);

    if (shouldUseDirectUpload) {
      return this.uploadDirectlyToBackend(
        files,
        feature,
        backendToken,
        backendUrl
      );
    } else {
      return this.uploadViaVercelAPI(files, feature);
    }
  }

  private async uploadDirectlyToBackend(
    files: File[],
    feature: Features,
    backendToken: string,
    backendUrl?: string
  ): Promise<UploadResponse[]> {
    const results: UploadResponse[] = [];
    const baseUrl = this.getBackendBaseUrl(backendUrl);

    if (files.length > 1) {
      // Multiple file upload
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(
        `${baseUrl}/upload/upload-multiple?feature=${feature}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${backendToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Upload failed" }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result: MultipleUploadResponse = await response.json();

      if (result.data && result.data.files) {
        const transformedResults = result.data.files.map((file) => ({
          success: true,
          data: {
            success: true,
            file: file,
          },
          message: "File uploaded successfully",
        }));
        results.push(...transformedResults);
      }
    } else {
      // Single file uploads
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${baseUrl}/upload?feature=${feature}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${backendToken}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Upload failed" }));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const result: UploadResponse = await response.json();
        results.push(result);
      }
    }

    return results;
  }

  private async uploadViaVercelAPI(
    files: File[],
    feature: Features
  ): Promise<UploadResponse[]> {
    const results: UploadResponse[] = [];

    if (files.length > 1) {
      // Multiple file upload via Vercel API
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(
        `/api/upload/multiple?feature=${feature}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result: MultipleUploadResponse = await response.json();

      if (result.data && result.data.files) {
        const transformedResults = result.data.files.map((file) => ({
          success: true,
          data: {
            success: true,
            file: file,
          },
          message: "File uploaded successfully",
        }));
        results.push(...transformedResults);
      }
    } else {
      // Single file uploads via Vercel API
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`/api/upload?feature=${feature}`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const result: UploadResponse = await response.json();
        results.push(result);
      }
    }

    return results;
  }

  async notifyUploadComplete(
    uploadResults: UploadResponse[],
    feature: Features
  ): Promise<void> {
    try {
      const fileUrls = uploadResults
        .filter((r) => r.success && r.data?.file?.url)
        .map((r) => r.data.file.url);

      if (fileUrls.length === 0) return;

      await fetch("/api/notify-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileUrls,
          feature,
          metadata: {
            uploadMethod: "service",
            fileCount: fileUrls.length,
          },
        }),
      });
    } catch (error) {
      console.warn("Failed to send upload notification:", error);
    }
  }
}

// Singleton instance
export const fileUploadService = new FileUploadService();

// Hook for easier usage in components
export const useFileUpload = () => {
  return {
    uploadFiles: fileUploadService.uploadFiles.bind(fileUploadService),
    notifyUploadComplete:
      fileUploadService.notifyUploadComplete.bind(fileUploadService),
  };
};
