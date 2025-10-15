// components/add-pregnancy-tips/rightColumn.tsx (Updated for Pregnancy Week Content)
"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
// FIX: Import appropriate icons
import { ImageIcon, Mic2 } from "lucide-react"; 
import { GenericThumbnailForm } from "@/components/forms/generic-thumbnail-form";
// FIX: Update the imported type name
import { PregnancyWeekContentFormValues } from "./mainColumn";
// FIX: Update Features import path/type if necessary, assuming it exists
import { Features } from "@/types"; 
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";


// FIX: Update type alias
type FormValues = PregnancyWeekContentFormValues;

interface RightColumnProps {
  // FIX: Update the UseFormReturn type
  form: UseFormReturn<FormValues, any, FormValues>;
  mode: "create" | "edit";
  // FIX: Rename prop to reflect content ID
  contentId?: string; 
}

const RightColumn: React.FC<RightColumnProps> = ({ form, mode, contentId }) => {
  // FIX: Watch the new fields
  const title = form.watch("sizeComparison"); 
  const comparisonImageUrl = form.watch("comparisonImage"); 
  const heartbeatAudioUrl = form.watch("heartbeatAudio");
  
  // FIX: Use the new ID prop
  const id = contentId || form.watch("id"); 
  const entityId = id || "new-week-content"; 

  // FIX: Logic is updated to set the comparisonImage field
  const handleComparisonImageUpdate = async (data: { thumbnail: string }) => {
    if (data.thumbnail) {
      // FIX: Set the comparisonImage field
      form.setValue("comparisonImage", data.thumbnail, { shouldValidate: true });
      form.trigger("comparisonImage"); 
      return {
        success: true,
        message: "Comparison Image URL updated locally in the form.",
      };
    }
    return { success: false, message: "No image URL received from upload." };
  };

  return (
    <div className="space-y-6">
      {/* --- COMPARISON IMAGE UPLOAD (Using GenericThumbnailForm) --- */}
      <GenericThumbnailForm
        key={comparisonImageUrl} 
        entity={{
          id: entityId,
          // FIX: Use sizeComparison as the title
          title: title || "Untitled Content", 
          // FIX: Use comparisonImageUrl
          thumbnail: comparisonImageUrl || undefined, 
        }}
        // FIX: Update entity type
        entityType="pregnancy-week-content-image" 
        updateMutation={(data) =>
          // FIX: Call the updated handler
          handleComparisonImageUpdate({ thumbnail: data.thumbnail! })
        }
        // FIX: Update query key
        queryKey={["week-content-image", entityId]}
        maxSize={5 * 1024 * 1024}
        acceptedFormats="image/*"
        recommendations={{
          size: "Recommended for week comparisons",
          aspectRatio: "e.g., 1:1 or 4:3",
          formats: "JPG, PNG, WebP",
          maxFileSize: "5MB",
        }}
        displaySettings={{
          imageHeight: "h-80",
          headerIcon: <ImageIcon className="w-6 h-6 text-indigo-600" />, // Changed color for distinction
          headerColor: "indigo",
          showImageInfo: true,
        }}
        // FIX: Update feature type
        feature={Features.PREGNANCY_WEEK_CONTENT} 
      />

      {/* --- HEARTBEAT AUDIO URL FIELD (New Simple Input) --- */}
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 p-6">
        <div className="flex items-center gap-3 mb-4">
            <Mic2 className="w-5 h-5 text-fuchsia-600" />
            <h3 className="text-xl font-semibold text-foreground">
              Heartbeat Audio Link
            </h3>
        </div>
        <FormField
            control={form.control}
            name="heartbeatAudio" // FIX: New field name
            render={({ field }) => (
            <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                    Audio URL (Optional)
                </FormLabel>
                <FormControl>
                <Input
                    placeholder="https://example.com/audio/week24-heartbeat.mp3"
                    {...field}
                    // Ensure null is treated as an empty string for the Input component
                    value={field.value ?? ""} 
                    className="h-12 border-border/50 bg-background/50"
                />
                </FormControl>
                <FormMessage className="text-xs" />
            </FormItem>
            )}
        />
      </div>
    </div>
  );
};

export default RightColumn;