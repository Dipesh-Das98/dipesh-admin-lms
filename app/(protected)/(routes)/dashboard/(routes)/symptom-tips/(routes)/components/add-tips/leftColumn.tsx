"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch"; // Import Switch component

// 1. Import the correct form values type from MainColumn
import { SymptomReliefTipFormValues } from "./mainColumn";

// 2. Define the props to include the 'mode'
interface LeftColumnProps {
  form: UseFormReturn<SymptomReliefTipFormValues>;
  mode: "create" | "edit"; // Added mode prop
}

const LeftColumn: React.FC<LeftColumnProps> = ({ form, mode }) => { // Destructure mode
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              {/* Tip/Text Icon */}
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
              Tip Content
            </h3>
          </div>

          {/* Symptom Name Field */}
          <FormField
            control={form.control}
            name="symptomName"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Symptom Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="E.g., Morning Sickness, Drowsiness"
                    {...field}
                    className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Relief Tip Content Field */}
          <FormField
            control={form.control}
            name="tip"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Relief Tip Content
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the detailed relief tip here."
                    {...field}
                    className="min-h-[100px] border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* CONDITIONALLY RENDER: Active Status (isActive) field only in 'edit' mode */}
          {mode === "edit" && (
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-background mt-6 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-semibold">
                      Tip Status
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {field.value
                        ? "This tip is currently active"
                        : "This tip is currently inactive"}
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
          )}

        </div>
      </div>
    </div>
  );
};

export default LeftColumn;