// /dashboard/pop-up-notifications/add/components/add-popup-data/leftColumn.tsx

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
import { Textarea } from "@/components/ui/textarea"; // Ensure this component is available
import { PopupNotificationFormValues } from "./mainform";

// Define the audience options
const AUDIENCE_OPTIONS = [
  { value: "ALL_USERS", label: "All Users" },
  { value: "PARENTS_ONLY", label: "Parents Only" },
] as const;

interface LeftColumnProps {
  form: UseFormReturn<PopupNotificationFormValues>;
}

const LeftColumn: React.FC<LeftColumnProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-6 space-y-6">
          {/* Header */}
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9a9 9 0 01-9 9m0-9a9 9 0 009-9"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Pop-up Content & Scheduling
            </h3>
          </div>

          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Title
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter pop-up title" className="h-12" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Message Field (Textarea) */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Message Content
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter the main content of the pop-up." rows={4} {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Target Audience Dropdown */}
          <FormField
            control={form.control}
            name="targetAudience"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Target Audience
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || "ALL_USERS"}
                    className="h-12 w-full rounded-md border border-border/50 bg-background/50 px-3 text-sm text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="" disabled>Select target audience</option>
                    {AUDIENCE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Button Labels and URL */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <h4 className="text-lg font-semibold text-foreground">Button Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Button 1 Label */}
              <FormField
                control={form.control}
                name="button1Label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Button 1 Label
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Got It" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Button 2 Label */}
              <FormField
                control={form.control}
                name="button2Label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Button 2 Label
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Read More" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Button 2 Redirect URL */}
            <FormField
              control={form.control}
              name="button2RedirectUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Button 2 Redirect URL
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/details" className="h-12" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Scheduling Fields (Start & End Time) */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <h4 className="text-lg font-semibold text-foreground">Scheduling</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Time Field */}
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Start Time
                    </FormLabel>
                    <FormControl>
                      <Input type="datetime-local" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* End Time Field */}
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      End Time
                    </FormLabel>
                    <FormControl>
                      <Input type="datetime-local" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftColumn;