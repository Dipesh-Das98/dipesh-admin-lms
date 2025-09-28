// components/LeftColumn.tsx

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
import { Switch } from "@/components/ui/switch";

export type LeftColumnFormValues = {
  title: string;
  author: string;
  illustratedBy: string;
  publishedBy: string;
  isActive: boolean;
  overAllScore: number;
};
interface LeftColumnProps {
  form: UseFormReturn<LeftColumnFormValues>;
}


const LeftColumn: React.FC<LeftColumnProps> = ({ form }) => {
  return (
    <div className="space-y-6">
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
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Read Along with Content Details
            </h3>
          </div>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Title
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="What is the title of the content?"
                    {...field}
                    className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Author
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Who is the author of the content?"
                    {...field}
                    className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="illustratedBy"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Illustrator
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Who is the illustrator of the content?"
                    {...field}
                    className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="publishedBy"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Published By
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Who is the publisher of the content?"
                    {...field}
                    className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="overAllScore"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Overall Score
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min={0}
                    placeholder="Enter the overall score of this content"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />



          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-background">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    {field.value
                      ? "This category is currently active"
                      : "This category is not active"}
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default LeftColumn;
