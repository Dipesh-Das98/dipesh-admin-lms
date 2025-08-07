"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useModal } from "@/hooks/use-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Upload, X, Image, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { UPLOAD_CATEGORIES, validateFileType } from "@/lib/format";
import { Features, UploadResponse } from "@/types/upload.type";
import { truncate } from "@/lib/utils";
import { useFileUpload } from "@/lib/file-upload-service";
import { useSessionSync } from "@/hooks/use-session-sync";

const MediaUploadModal = () => {
  const { type, onClose, data } = useModal();

  const isOpenModel = type === "media-uplaod-model";
  const { handleUpdate } = data;

  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadResults, setUploadResults] = React.useState<UploadResponse[]>([]);
  
  const { session } = useSessionSync();
  const { uploadFiles, notifyUploadComplete } = useFileUpload();

  const DEFAULT_CATEGORY = Features.GENERAL; // Default category for media uploads
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_FILES = 5;

  // Create form schema with validation
  const formSchema = z.object({
    files: z
      .array(z.custom<File>())
      .min(1, "Please select at least one file")
      .max(MAX_FILES, `Please select up to ${MAX_FILES} files`)
      .refine((files) => files.every((file) => file.size <= MAX_SIZE), {
        message: `File size must be less than ${Math.round(MAX_SIZE / 1024 / 1024)}MB`,
        path: ["files"],
      })
      .refine((files) => {
        const allowedTypes = [...UPLOAD_CATEGORIES.image, ...UPLOAD_CATEGORIES.media];
        return files.every((file) => validateFileType(file, allowedTypes));
      }, {
        message: "Only images, videos, and audio files are allowed",
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
          feature: DEFAULT_CATEGORY,
          backendToken: session.user.backendToken,
          directUpload: false, // Let service decide based on file size
        });

        // Notify upload completion for direct uploads
        const hasLargeFiles = data.files.some(file => file.size > 4 * 1024 * 1024);
        if (hasLargeFiles) {
          await notifyUploadComplete(results, DEFAULT_CATEGORY);
        }

        setUploadResults((prev) => [...prev, ...results]);

        // Call the update handler if provided
        if (handleUpdate && typeof handleUpdate === 'function') {
          const uploadedFiles = results.map(result => {
            const file = result.data.file;
            return {
              key: file.id,
              url: file.url,
              name: file.filename,
              originalName: file.filename,
              size: file.size,
              category: file.category
            };
          });
          handleUpdate(uploadedFiles);
        }

        // Clear the form after successful upload
        form.reset();

        const uploadMethod = hasLargeFiles ? "direct backend" : "Vercel API";
        toast.success(
          `Successfully uploaded ${results.length} file${
            results.length !== 1 ? "s" : ""
          } via ${uploadMethod}!`
        );

        // Close modal after successful upload
        setTimeout(() => {
          setUploadResults([]);
          onClose();
        }, 1500);

      } catch (error) {
        const uploadError = error instanceof Error ? error : new Error("Upload failed");
        console.error("Upload error:", uploadError);
        toast.error(`Failed to upload files: ${uploadError.message}`);
      } finally {
        setIsUploading(false);
      }
    },
    [isUploading, session, uploadFiles, DEFAULT_CATEGORY, handleUpdate, form, notifyUploadComplete, onClose]
  );

  const handleClose = () => {
    if (!isUploading) {
      form.reset();
      setUploadResults([]);
      onClose();
    }
  };

  const watchedFiles = form.watch("files");

  return (
    <Dialog open={isOpenModel} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image className="size-6" />
            Upload Media Files
          </DialogTitle>
          <DialogDescription>
            Upload media files such as images, videos, or audio files. 
            Max size: {Math.round(MAX_SIZE / 1024 / 1024)}MB per file, Max files: {MAX_FILES}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Media Files</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onValueChange={field.onChange}
                        accept="image/*,video/*,audio/*"
                        maxFiles={MAX_FILES}
                        maxSize={MAX_SIZE}
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
                            <Upload className="size-8 text-gray-500" />
                            <div className="text-center">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Drag and drop media files here, or{" "}
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
                                Accepts: Images, Videos, Audio • Max: {Math.round(MAX_SIZE / 1024 / 1024)}MB per file
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
                                        {truncate(file.name, 32)}
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
                      Upload up to {MAX_FILES} media files, each up to {Math.round(MAX_SIZE / 1024 / 1024)}MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {watchedFiles.length} file{watchedFiles.length !== 1 ? "s" : ""} selected
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
                        {isUploading && (
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        )}
                        {isUploading
                          ? "Uploading..."
                          : `Upload ${watchedFiles.length} File${
                              watchedFiles.length !== 1 ? "s" : ""
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
                    {(result.data.file.category === "image" || result.data.file.category === "media") && (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <Image className="w-6 h-6 text-gray-500" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-green-700 dark:text-green-300 truncate">
                        {truncate(result.data.file.filename, 32)}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 truncate">
                        {truncate(result.data.file.url, 50)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaUploadModal;
