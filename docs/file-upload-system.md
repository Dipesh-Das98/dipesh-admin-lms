# File Upload System - Vercel Limitation Workaround

## Overview

This system handles large file uploads by automatically detecting file sizes and choosing the appropriate upload method to bypass Vercel's 4.5MB request body limitation.

## Quick Start

### Basic Usage (Auto-Detection)
```tsx
import { BackendFileUpload } from "@/components/forms/backend-file-upload";
import { Features } from "@/types/upload.type";

<BackendFileUpload
  feature={Features.ATTACHMENTS}
  accept="*/*"
  maxSize={100 * 1024 * 1024} // 100MB
  maxFiles={10}
  onUploadComplete={(files) => console.log("Uploaded:", files)}
/>
```

### Force Direct Upload (Recommended for Large Files)
```tsx
<BackendFileUpload
  feature={Features.MOVIES}
  directUpload={true} // Always use direct backend upload
  backendUrl="https://your-backend.com" // Optional: override default URL
  maxSize={500 * 1024 * 1024} // 500MB
/>
```

## How It Works

### Automatic Detection (Default Behavior)
- **Small files (≤4MB)**: Uploaded via Vercel API routes (`/api/upload`)
- **Large files (>4MB)**: Uploaded directly to backend server
- **Mixed uploads**: If any file is >4MB, all files use direct backend upload

### Upload Flow Diagram
```
User selects files
       ↓
   File size check
       ↓
┌──────────────────┬──────────────────┐
│ Files ≤4MB       │ Files >4MB       │
│                  │                  │
│ Client           │ Client           │
│   ↓              │   ↓              │
│ Vercel API       │ Backend Server   │
│   ↓              │   ↓              │
│ Backend Server   │ Notification API │
└──────────────────┴──────────────────┘
           ↓
     Upload Complete
```

## Environment Configuration

Add to your `.env.local`:
```bash
# For client-side direct uploads (falls back to localhost:3001)
NEXT_PUBLIC_BACKEND_URL=https://your-backend.com

# Existing server-side config
BACKEND_API_URL=https://your-backend.com
```

## Components Updated

### 1. BackendFileUpload Component
- **Location**: `/components/forms/backend-file-upload.tsx`
- **Features**: Smart routing, visual indicators, progress tracking
- **Usage**: General file uploads with configurable behavior

### 2. MediaUploadModal Component  
- **Location**: `/components/modals/media-upload-modal.tsx`
- **Features**: Auto-detection, modal interface
- **Usage**: Media-specific uploads in modal format

### 3. FileUploadService
- **Location**: `/lib/file-upload-service.ts`
- **Features**: Centralized upload logic, reusable across components
- **Usage**: Direct service calls for custom implementations

## API Endpoints

### Backend Server Endpoints (Your Server)
- `POST /upload?feature={feature}` - Single file upload
- `POST /upload/upload-multiple?feature={feature}` - Multiple file upload

### Vercel API Endpoints (This App)
- `POST /api/upload?feature={feature}` - Small file proxy (≤4MB)
- `POST /api/upload/multiple?feature={feature}` - Small files proxy (≤4MB)
- `POST /api/notify-upload` - Upload completion notification

## Visual Indicators

The component automatically shows which upload method will be used:
- **"Direct Backend (Forced)"** - `directUpload={true}`
- **"Direct Backend (Large Files)"** - Auto-detected large files  
- **"Vercel API (Small Files)"** - Small files using legacy method

Large files show a warning: *"(Large files detected - bypassing Vercel limits)"*

## Advanced Usage

### Using the Service Directly
```tsx
import { useFileUpload } from "@/lib/file-upload-service";
import { useSessionSync } from "@/hooks/use-session-sync";
import { Features } from "@/types/upload.type";

function CustomUpload() {
  const { uploadFiles, notifyUploadComplete } = useFileUpload();
  const { session } = useSessionSync();

  const handleUpload = async (files: File[]) => {
    if (!session?.user?.backendToken) return;

    const results = await uploadFiles({
      files,
      feature: Features.CUSTOM,
      backendToken: session.user.backendToken,
      directUpload: true, // Force direct upload
    });

    await notifyUploadComplete(results, Features.CUSTOM);
  };
}
```

### Component Props Reference
```tsx
interface BackendFileUploadProps {
  feature?: Features;           // Upload feature type (default: Features.GENERAL)
  accept?: string;             // File types (default: "image/*")
  maxSize?: number;            // Max file size in bytes (default: 10MB)
  maxFiles?: number;           // Max number of files (default: 5)
  onUploadComplete?: (files: UploadResponse[]) => void;
  className?: string;          // Additional CSS classes
  directUpload?: boolean;      // Force direct backend upload
  backendUrl?: string;         // Override default backend URL
}
```

### Available Features
```tsx
enum Features {
  STORIES = 'stories',
  MUSIC = 'music',
  MOVIES = 'movies',
  GAMES = 'games',
  COURSES = 'courses',
  LANGUAGE_CORNER = 'language-corner',
  LIBRARY = 'library',
  ETHICS = 'ethics',
  CATEGORIES = 'categories',
  AVATARS = 'avatars',
  ADS = 'ads',
  ATTACHMENTS = 'attachments',
  GENERAL = 'general',
}
```

## Benefits

1. **No Vercel Limitations**: Handle files of any size
2. **Backward Compatibility**: Small files still work via existing API
3. **Automatic Detection**: Smart routing based on file size
4. **Performance**: Direct uploads are faster for large files
5. **Monitoring**: Upload notifications for analytics/tracking
6. **Type Safety**: Full TypeScript support
7. **Error Handling**: Comprehensive error management

## Security Considerations

- **Authentication**: All uploads require valid backend tokens
- **CORS**: Ensure your backend accepts requests from your frontend domain
- **File Validation**: Validate file types and sizes on both client and server
- **Rate Limiting**: Implement rate limiting on your backend endpoints

## Troubleshooting

### Common Issues

1. **"Authentication required"**
   - Ensure user is logged in with valid `backendToken`
   - Check NextAuth session configuration

2. **CORS errors on direct upload**
   - Configure your backend to accept requests from your frontend domain
   - Add appropriate CORS headers

3. **Large file uploads failing**
   - Check your backend's maximum request size limits
   - Verify network timeout settings

4. **Files not appearing after upload**
   - Check the `onUploadComplete` callback
   - Verify the upload notification endpoint

### Debug Mode
Enable debug logging:
```tsx
<BackendFileUpload
  feature={Features.GENERAL}
  onUploadComplete={(files) => {
    console.log("Upload results:", files);
    console.log("File URLs:", files.map(f => f.data.file.url));
  }}
/>
```

## Migration Guide

### From Old Upload System
1. **Replace direct API calls** with `useFileUpload` hook
2. **Update environment variables** to include `NEXT_PUBLIC_BACKEND_URL`
3. **Test large file uploads** to ensure they bypass Vercel
4. **Monitor upload notifications** in your analytics

### Gradual Migration
- Use `directUpload={false}` to maintain existing behavior
- Enable `directUpload={true}` only for components that need large files
- Monitor performance and errors during transition
