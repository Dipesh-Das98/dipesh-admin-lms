import { Upload } from "lucide-react";
import React from "react";

interface ThumbnailUploadInstructionProps {
  name: string;
}
const ThumbnailUplaodInstruction = ({name}:ThumbnailUploadInstructionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
          <Upload className="w-4 h-4 text-green-600" />
        </div>
        <h4 className="text-lg font-semibold text-foreground">
          Upload New Thumbnail
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30 border border-border/30">
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-foreground">
            Recommended Specifications
          </h5>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Aspect ratio: 16:9 or 1.91:1</li>
            <li>• Minimum size: 1200x630px</li>
            <li>• Maximum file size: 5MB</li>
            <li>• Format: JPG, PNG, WebP</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-foreground">
            Best Practices
          </h5>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use high-contrast images</li>
            <li>• Avoid text in thumbnails</li>
            <li>• Ensure image clarity</li>
            <li>• Match your {name}&apos;s theme</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailUplaodInstruction;
