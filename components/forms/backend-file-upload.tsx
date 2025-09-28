"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, Loader2, X } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { cn, truncate } from "@/lib/utils";
import { toast } from "sonner";
import { Features, UploadResponse } from "@/types/upload.type";
import Image from "next/image";
import { useSessionSync } from "@/hooks/use-session-sync";
import { useFileUpload } from "@/lib/file-upload-service";

interface BackendFileUploadProps {
  feature?: Features;
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  onUploadComplete?: (files: UploadResponse[]) => void;
  className?: string;
  directUpload?: boolean; // New prop to enable direct backend upload
  backendUrl?: string; // Override default backend URL
}

export function BackendFileUpload({
  feature = Features.GENERAL,
  accept = "image/*",
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  onUploadComplete,
  className,
  directUpload = false, // Default to false for backward compatibility
  backendUrl,
}: BackendFileUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadResults, setUploadResults] = React.useState<UploadResponse[]>(
    []
  );

  const { session } = useSessionSync();
  const { uploadFiles, notifyUploadComplete } = useFileUpload();

  // Helper function to check if file is large (>4MB)
  const isLargeFile = React.useCallback((file: File) => {
    return file.size > 4 * 1024 * 1024; // 4MB
  }, []);

  // Helper function to check if any files are large
  const hasLargeFiles = React.useCallback((files: File[]) => {
    return files.some(isLargeFile);
  }, [isLargeFile]);

  // Create dynamic schema based on props
  const formSchema = z.object({
    files: z
      .array(z.custom<File>())
      .min(1, "Please select at least one file")
      .max(maxFiles, `Please select up to ${maxFiles} files`)
      .refine((files) => files.every((file) => file.size <= maxSize), {
        message: `File size must be less than ${Math.round(
          maxSize / 1024 / 1024
        )}MB`,
        path: ["files"],
      }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  });

  const onSubmit = React.useCallback(
    async (data: FormValues) => {
      if (isUploading) return;
      if (!session?.user?.backendToken) {
        toast.error("Authentication required for upload");
        return;
      }

      setIsUploading(true);
      let results: UploadResponse[] = [];

      try {
        // Use the upload service
        results = await uploadFiles({
          files: data.files,
          feature,
          backendToken: session.user.backendToken,
          directUpload,
          backendUrl,
        });

        // Notify upload completion (for direct uploads)
        const shouldUseDirectUpload = directUpload || hasLargeFiles(data.files);
        if (shouldUseDirectUpload) {
          await notifyUploadComplete(results, feature);
        }

        setUploadResults((prev) => [...prev, ...results]);

        // have timeout to ensure results are processed
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (onUploadComplete && results.length > 0) {
          onUploadComplete(results);
        }

        // Clear the form after successful upload
        form.reset();

        const uploadMethod = shouldUseDirectUpload ? "direct backend" : "Vercel API";
        toast.success(
          `Successfully uploaded ${results.length} file${results.length !== 1 ? "s" : ""
          } via ${uploadMethod}!`
        );
      } catch (error) {
        const uploadError = error instanceof Error ? error : new Error("Upload failed");
        console.error("Upload error:", uploadError);
        toast.error(`Failed to upload files: ${uploadError.message}`);
      } finally {
        setIsUploading(false);
      }
    },
    [
      isUploading,
      session,
      uploadFiles,
      feature,
      directUpload,
      backendUrl,
      hasLargeFiles,
      notifyUploadComplete,
      onUploadComplete,
      form,
    ]
  );

  const watchedFiles = form.watch("files");

  // Check if current selection has large files
  const hasLargeFilesSelected = React.useMemo(() => {
    return hasLargeFiles(watchedFiles);
  }, [watchedFiles, hasLargeFiles]);

  // Determine which upload method will be used
  const uploadMethod = React.useMemo(() => {
    if (directUpload) return "Direct Backend (Forced)";
    if (hasLargeFilesSelected) return "Direct Backend (Large Files)";
    return "Vercel API (Small Files)";
  }, [directUpload, hasLargeFilesSelected]);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudUpload className="h-5 w-5" />
          File Upload ({feature})
        </CardTitle>
        <CardDescription>
          Upload files to your backend. Max size:{" "}
          {Math.round(maxSize / 1024 / 1024)}MB, Max files: {maxFiles}
          {watchedFiles.length > 0 && (
            <span className="block mt-1 text-sm">
              Upload method: <span className="font-medium">{uploadMethod}</span>
              {hasLargeFilesSelected && (
                <span className="text-orange-600 dark:text-orange-400">
                  {" "}(Large files detected - bypassing Vercel limits)
                </span>
              )}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Files</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onValueChange={field.onChange}
                      accept={accept}
                      maxFiles={maxFiles}
                      maxSize={maxSize}
                      onFileReject={(_, message) => {
                        form.setError("files", {
                          message,
                        });
                      }}
                      multiple
                      disabled={isUploading}
                    >
                      <FileUploadDropzone className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                        <div className="flex flex-col items-center gap-2">
                          <CloudUpload className="h-8 w-8 text-gray-500" />
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Drag and drop files here, or{" "}
                              <FileUploadTrigger asChild>
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 h-auto text-blue-500"
                                  disabled={isUploading}
                                >
                                  choose files
                                </Button>
                              </FileUploadTrigger>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Accepts: {accept} • Max:{" "}
                              {Math.round(maxSize / 1024 / 1024)}MB per file
                            </p>
                          </div>
                        </div>
                      </FileUploadDropzone>

                      <FileUploadList className="space-y-2">
                        {field.value.map((file) => (
                          <FileUploadItem
                            key={`${file.name}-${file.size}-${file.lastModified}`}
                            value={file}
                            className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900"
                          >
                            <FileUploadItemPreview className="shrink-0" />

                            <div className="flex-1 min-w-0">
                              <FileUploadItemMetadata className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate">
                                      {truncate(file?.name, 32)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                              </FileUploadItemMetadata>
                            </div>

                            <FileUploadItemDelete asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                disabled={isUploading}
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </FileUploadItemDelete>
                          </FileUploadItem>
                        ))}
                      </FileUploadList>
                    </FileUpload>
                  </FormControl>
                  <FormDescription>
                    Upload up to {maxFiles} files, each up to{" "}
                    {Math.round(maxSize / 1024 / 1024)}MB.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {watchedFiles.length} file{watchedFiles.length !== 1 ? "s" : ""}{" "}
                selected
              </p>

              <div className="flex gap-2">
                {watchedFiles.length > 0 && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => form.setValue("files", [])}
                      disabled={isUploading}
                    >
                      Clear All
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isUploading || watchedFiles.length === 0}
                    >
                      {isUploading &&
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      }
                      {isUploading
                        ? "Uploading..."
                        : `Upload ${watchedFiles.length} File${watchedFiles.length !== 1 ? "s" : ""
                        }`}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </form>
        </Form>

        {/* Upload Results */}
        {uploadResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-green-600">
              Successfully Uploaded ({uploadResults.length})
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {uploadResults.map((result, index) => (
                <div
                  key={index}
                  className="p-2 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800 flex gap-4"
                >
                  {result.data.file.category === "image" && (
                    <Image
                      width={48}
                      height={48}
                      loading="lazy"
                      src={result.data.file.url}
                      alt={result.data.file.filename}
                      className="w-12 h-12 object-cover rounded mb-1"
                    />
                  )}

                  <div>
                    <p className="text-xs font-medium text-green-700 dark:text-green-300">
                      {truncate(result.data.file.filename, 32)}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 truncate">
                      {result.data.file.url}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
