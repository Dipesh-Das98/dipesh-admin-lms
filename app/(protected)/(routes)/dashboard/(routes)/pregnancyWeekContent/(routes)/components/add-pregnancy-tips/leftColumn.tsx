// components/add-pregnancy-tips/leftColumn.tsx (Updated for Pregnancy Week Content)
"use client";

import React from "react";
import { Control, UseFormReturn, useFieldArray } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

// FIX: Update the imported type name
import { PregnancyWeekContentFormValues } from "./mainColumn";

interface LeftColumnProps {
  // FIX: Update the UseFormReturn type
  form: UseFormReturn<PregnancyWeekContentFormValues>;
  mode: "create" | "edit";
}

// Generic type definition to handle the form control array casting
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericFormArray = Record<string, any[]>;

const LeftColumn: React.FC<LeftColumnProps> = ({ form }) => {
  
  // FIX: Rename fields and array names to match the new schema

  // Development Milestones Array
  const { 
    fields: milestoneFields, 
    append: appendMilestone, 
    remove: removeMilestone 
  } = useFieldArray<
    GenericFormArray,
    "developmentMilestones" // FIX: New array name
  >({
    control: form.control as unknown as Control<GenericFormArray>, 
    name: "developmentMilestones", // FIX: New array name
  });
  
  // Maternal Changes Array (Replaces Nutrition Facts)
  const { 
    fields: changeFields, 
    append: appendChange, 
    remove: removeChange 
  } = useFieldArray<
    GenericFormArray, 
    "maternalChanges" // FIX: New array name
  >({
    control: form.control as unknown as Control<GenericFormArray>, 
    name: "maternalChanges", // FIX: New array name
  });


  return (
    <div className="space-y-6">
      {/* --- CORE WEEK DETAILS CARD --- */}
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v2m-7 13v-9m-5 9h12a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Week and Fetal Details
            </h3> {/* FIX: Update Title */}
          </div>

          {/* Week & Trimester Fields (Replaces Week Start/End) */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="week" // FIX: New Field Name
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Week Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="E.g., 24"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      className="h-12 border-border/50 bg-background/50"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trimester" // FIX: New Field Name
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Trimester (1-3)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="E.g., 2"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      className="h-12 border-border/50 bg-background/50"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Fetal Size Field (New Field) */}
          <FormField
            control={form.control}
            name="fetalSizeCm" // FIX: New Field Name
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Fetal Size (cm)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1" // Allow decimals for size
                    placeholder="E.g., 30"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    className="h-12 border-border/50 bg-background/50"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Size Comparison Field (Replaces Food Name) */}
          <FormField
            control={form.control}
            name="sizeComparison" // FIX: New Field Name
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Size Comparison Text
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="E.g., About the Size of Corn on Cob"
                    {...field}
                    className="h-12 border-border/50 bg-background/50"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* --- DEVELOPMENT MILESTONES CARD (DYNAMIC ARRAY) --- */}
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Development Milestones
          </h3> {/* FIX: Update Title */}

          {milestoneFields.map((item, index) => ( // FIX: Use milestoneFields
            <div key={item.id} className="flex items-start gap-3">
              <FormField
                control={form.control}
                name={`developmentMilestones.${index}`} // FIX: Update array name
                render={({ field }) => (
                  <FormItem className="flex-1 space-y-3">
                    <FormLabel className="sr-only">Milestone #{index + 1}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`Enter milestone #${index + 1} here.`}
                        {...field}
                        className="min-h-[60px] border-border/50 bg-background/50"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeMilestone(index)} // FIX: Use removeMilestone
                className="mt-3"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => appendMilestone("")} // FIX: Use appendMilestone
            className="w-full mt-4 flex items-center gap-2 border-dashed border-primary/50 text-primary hover:bg-primary/5"
          >
            <Plus className="h-4 w-4" />
            Add Milestone
          </Button>
        </div>
      </div>

      {/* --- MATERNAL CHANGES CARD (DYNAMIC ARRAY) --- */}
      {/* FIX: This replaces the NUTRITION FACTS CARD */}
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Maternal Changes
          </h3> {/* FIX: Update Title */}

          {changeFields.map((item, index) => ( // FIX: Use changeFields
            <div key={item.id} className="flex items-start gap-3">
              <FormField
                control={form.control}
                name={`maternalChanges.${index}`} // FIX: Update array name
                render={({ field }) => (
                  <FormItem className="flex-1 space-y-3">
                    <FormLabel className="sr-only">Change #{index + 1}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`Enter maternal change #${index + 1} here.`}
                        {...field}
                        className="min-h-[60px] border-border/50 bg-background/50"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeChange(index)} // FIX: Use removeChange
                className="mt-3"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => appendChange("")} // FIX: Use appendChange
            className="w-full mt-4 flex items-center gap-2 border-dashed border-primary/50 text-primary hover:bg-primary/5"
          >
            <Plus className="h-4 w-4" />
            Add Maternal Change
          </Button>
        </div>
      </div>


      {/* --- HEARTBEAT SWITCH --- */}
      {/* FIX: This replaces the IS RECOMMENDED SWITCH */}
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-6">
          <FormField
            control={form.control}
            name="hasHeartbeat" // FIX: New Field Name
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-background shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base font-semibold">
                    Heartbeat Status
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    {field.value
                      ? "The content includes heartbeat audio/details."
                      : "Heartbeat audio/details are not available for this week."} {/* FIX: Update description */}
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default LeftColumn;