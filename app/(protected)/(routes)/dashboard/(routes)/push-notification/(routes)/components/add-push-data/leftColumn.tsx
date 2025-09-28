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
import { PushNotificationFormValues } from "./mainform";

interface LeftColumnProps {
  form: UseFormReturn<PushNotificationFormValues>;
}

const LeftColumn: React.FC<LeftColumnProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-6 space-y-6">
          {/* Header (Kept the same) */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-4.215A2 2 0 0018.5 12H13a2 2 0 00-2 2v3H9a3 3 0 01-3-3V7a3 3 0 013-3h6a3 3 0 013 3v3m-2 4h-4m2 0V17"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Push Notification Details
            </h3>
          </div>

          {/* Title Field (Kept the same) */}
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
                  <Input
                    placeholder="Enter notification title (e.g., Important Update)"
                    className="h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Message Field (Kept the same) */}
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
                  <Textarea
                    placeholder="Enter the main message content of the push notification."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* --- Date/Time Fields (Updated to type="datetime-local") --- */}
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
                    <Input
                      type="datetime-local" // 👈 KEY CHANGE HERE
                      className="h-12"
                      // Field value is automatically a string like "YYYY-MM-DDTHH:MM"
                      {...field}
                    />
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
                    <Input
                      type="datetime-local" // 👈 KEY CHANGE HERE
                      className="h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftColumn;