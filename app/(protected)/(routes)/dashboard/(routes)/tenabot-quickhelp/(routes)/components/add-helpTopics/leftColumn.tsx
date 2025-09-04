"use client";

import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type LeftColumnFormValues = {
  topicName: string;   // <- this is filled via category dropdown
  questions: string[];
};





interface LeftColumnProps {
  form: UseFormReturn<LeftColumnFormValues>;
}

const CATEGORIES = ["Physical Health", "Behavioral Changes", "Emotional Wellbeing", "Development & Learning"];

const LeftColumn: React.FC<LeftColumnProps> = ({ form }) => {
  const [newQuery, setNewQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const queries = form.watch("questions") || [];

  const addQuery = () => {
    if (newQuery.trim()) {
      form.setValue("questions", [
        ...queries,
        newQuery.trim(),
      ]);

      setNewQuery("");
      setIsAdding(false);
    }
  };

  const toggleQueryActive = (index: number) => {
    const updated = [...queries];
    form.setValue("questions", updated);
  };

  const deleteQuery = (index: number) => {
    const updated = [...queries];
    updated.splice(index, 1);
    form.setValue("questions", updated);
    if (editIndex === index) {
      setEditIndex(null);
      setEditText("");
    }
  };

  const startEdit = (index: number) => {
    setEditIndex(index);
    setEditText(queries[index]);
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditText("");
  };

  const saveEdit = () => {
    if (editText.trim() && editIndex !== null) {
      const updated = [...queries];
      updated[editIndex] = editText.trim();
      form.setValue("questions", updated);
      setEditIndex(null);
      setEditText("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-6 space-y-4">
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
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Quick Help Details
            </h3>
          </div>
          {/* Category Dropdown */}
          <FormField
            control={form.control}
            name="topicName"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Category
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="h-12 w-full rounded-md border border-border/50 bg-background/50 px-3 text-sm text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Query Management */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Queries
              </FormLabel>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsAdding(true)}
              >
                + Add Query
              </Button>
            </div>

            {isAdding && (
              <div className="flex items-center gap-2">
                <Input
                  value={newQuery}
                  onChange={(e) => setNewQuery(e.target.value)}
                  placeholder="Enter a question"
                  className="h-10 flex-1"
                />
                <Button
                  type="button"
                  onClick={addQuery}
                  disabled={!newQuery.trim()}
                >
                  Done
                </Button>
              </div>
            )}

            <div className="space-y-2">
              {queries.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No queries added yet.
                </p>
              )}
              {queries.map((query, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-md bg-background"
                >
                  <div className="flex-1 text-sm">
                    {editIndex === index ? (
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                    ) : (
                      query
                    )}
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    {editIndex === index ? (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          onClick={saveEdit}
                          disabled={!editText.trim()}
                        >
                          Save
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(index)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteQuery(index)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftColumn;
