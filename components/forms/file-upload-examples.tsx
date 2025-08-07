import { BackendFileUpload } from "@/components/forms/backend-file-upload";
import { UploadResponse, Features } from "@/types/upload.type";

// Example usage for large file uploads with Features enum
export function LargeFileUploadExample() {
  const handleUploadComplete = (files: UploadResponse[]) => {
    console.log("Upload completed:", files);
    // Handle successful upload results
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Large File Upload (Direct Backend)</h3>
        <p className="text-sm text-gray-600 mb-4">
          For files larger than 4MB, this will automatically bypass Vercel limitations 
          and upload directly to your backend server.
        </p>
        <BackendFileUpload
          feature={Features.ATTACHMENTS}
          accept="*/*"
          maxSize={100 * 1024 * 1024} // 100MB
          maxFiles={10}
          onUploadComplete={handleUploadComplete}
          directUpload={false} // Auto-detect based on file size
        />
      </div>

      <div>
        <h3 className="text-lg font-medium">Force Direct Upload</h3>
        <p className="text-sm text-gray-600 mb-4">
          This will always upload directly to backend, regardless of file size.
        </p>
        <BackendFileUpload
          feature={Features.MOVIES}
          accept="video/*,audio/*"
          maxSize={500 * 1024 * 1024} // 500MB
          maxFiles={5}
          onUploadComplete={handleUploadComplete}
          directUpload={true} // Force direct upload
          backendUrl="https://your-backend.com" // Override default backend URL
        />
      </div>

      <div>
        <h3 className="text-lg font-medium">Small File Upload (Vercel API)</h3>
        <p className="text-sm text-gray-600 mb-4">
          Small files (&lt;4MB) will use Vercel API for backward compatibility.
        </p>
        <BackendFileUpload
          feature={Features.AVATARS}
          accept="image/*"
          maxSize={3 * 1024 * 1024} // 3MB
          maxFiles={5}
          onUploadComplete={handleUploadComplete}
          directUpload={false} // Use Vercel API for small files
        />
      </div>

      <div>
        <h3 className="text-lg font-medium">Course Materials Upload</h3>
        <p className="text-sm text-gray-600 mb-4">
          Mixed content uploads for educational materials.
        </p>
        <BackendFileUpload
          feature={Features.COURSES}
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          maxSize={200 * 1024 * 1024} // 200MB
          maxFiles={20}
          onUploadComplete={handleUploadComplete}
        />
      </div>

      <div>
        <h3 className="text-lg font-medium">Story Content Upload</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload story assets including images, audio, and documents.
        </p>
        <BackendFileUpload
          feature={Features.STORIES}
          accept="image/*,audio/*,.pdf"
          maxSize={50 * 1024 * 1024} // 50MB
          maxFiles={15}
          onUploadComplete={handleUploadComplete}
        />
      </div>

      <div>
        <h3 className="text-lg font-medium">Music & Audio Upload</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload audio files for music content.
        </p>
        <BackendFileUpload
          feature={Features.MUSIC}
          accept="audio/*"
          maxSize={100 * 1024 * 1024} // 100MB  
          maxFiles={10}
          onUploadComplete={handleUploadComplete}
          directUpload={true} // Force direct for audio files
        />
      </div>

      <div>
        <h3 className="text-lg font-medium">Game Assets Upload</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload game-related files and assets.
        </p>
        <BackendFileUpload
          feature={Features.GAMES}
          accept="image/*,audio/*,.zip,.json"
          maxSize={150 * 1024 * 1024} // 150MB
          maxFiles={25}
          onUploadComplete={handleUploadComplete}
        />
      </div>
    </div>
  );
}
