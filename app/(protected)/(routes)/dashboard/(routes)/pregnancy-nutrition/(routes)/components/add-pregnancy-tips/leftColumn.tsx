"use client";

import React from "react";
import { Control, FieldValues, UseFormReturn, useFieldArray } from "react-hook-form";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import { PregnancyNutritionFormValues } from "./mainColumn";

interface LeftColumnProps {
  form: UseFormReturn<PregnancyNutritionFormValues>;
  mode: "create" | "edit";
}
type NutritionFactItem = PregnancyNutritionFormValues['nutritionFacts'][number];
type GenericFormArray = Record<string, any[]>;

const LeftColumn: React.FC<LeftColumnProps> = ({ form }) => {
  // Correctly typed useFieldArray calls:

  const { 
    fields: benefitFields, 
    append: appendBenefit, 
    remove: removeBenefit 
  } = useFieldArray<
    GenericFormArray,
    "healthBenefits"
  >({
    control: form.control as unknown as Control<GenericFormArray>, 
    name: "healthBenefits",
  });
  
  const { 
    fields: factFields, 
    append: appendFact, 
    remove: removeFact 
  } = useFieldArray<
    GenericFormArray, // <-- Trick the path checker
    "nutritionFacts"
  >({
    // CRITICAL: Two-step cast
    control: form.control as unknown as Control<GenericFormArray>, 
    name: "nutritionFacts",
  });

  return (
    <div className="space-y-6">
      {/* --- CORE FOOD DETAILS CARD --- */}
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
              Nutrition Details
            </h3>
          </div>

          {/* Food Name Field */}
          <FormField
            control={form.control}
            name="foodName"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Food Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="E.g., Salmon, Spinach, Lentils"
                    {...field}
                    className="h-12 border-border/50 bg-background/50"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Food Category Field */}
          <FormField
            control={form.control}
            name="foodCategory"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Food Category
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="E.g., Protein, Vitamin, Mineral"
                    {...field}
                    className="h-12 border-border/50 bg-background/50"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Week Start/End Fields */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="weekStart"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Week Start
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
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
              name="weekEnd"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Week End
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
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
        </div>
      </div>

      {/* --- HEALTH BENEFITS CARD (DYNAMIC ARRAY) --- */}
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Health Benefits
          </h3>

          {benefitFields.map((item, index) => (
            <div key={item.id} className="flex items-start gap-3">
              <FormField
                control={form.control}
                name={`healthBenefits.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1 space-y-3">
                    <FormLabel className="sr-only">Benefit #{index + 1}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`Enter benefit #${index + 1} here.`}
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
                onClick={() => removeBenefit(index)}
                className="mt-3"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => appendBenefit("")}
            className="w-full mt-4 flex items-center gap-2 border-dashed border-primary/50 text-primary hover:bg-primary/5"
          >
            <Plus className="h-4 w-4" />
            Add Health Benefit
          </Button>
        </div>
      </div>

      {/* --- NUTRITION FACTS CARD (NESTED DYNAMIC ARRAY) --- */}
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Nutrition Facts
          </h3>

          {factFields.map((item, index) => (
            <div key={item.id} className="border border-border/50 rounded-lg p-4 bg-background/50 shadow-inner space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="text-md font-medium text-foreground">Fact #{index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFact(index)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Separator />

              <FormField
                control={form.control}
                name={`nutritionFacts.${index}.nutrient`}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm">Nutrient Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E.g., Omega-3 DHA"
                        {...field}
                        className="h-10 border-border/50 bg-background/50"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`nutritionFacts.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm">Value</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E.g., 12g"
                          {...field}
                          className="h-10 border-border/50 bg-background/50"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`nutritionFacts.${index}.dvPercentage`}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm">DV % (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="E.g., 85"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          value={field.value ?? ""}
                          className="h-10 border-border/50 bg-background/50"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => appendFact({ nutrient: "", value: "", dvPercentage: undefined })}
            className="w-full mt-4 flex items-center gap-2 border-dashed border-primary/50 text-primary hover:bg-primary/5"
          >
            <Plus className="h-4 w-4" />
            Add Nutrition Fact
          </Button>
        </div>
      </div>

      {/* --- IS RECOMMENDED SWITCH --- */}
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-6">
          <FormField
            control={form.control}
            name="isRecommended"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-background shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base font-semibold">
                    Recommendation Status
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    {field.value
                      ? "This food is currently RECOMMENDED for pregnant women."
                      : "This food is currently NOT RECOMMENDED/Pending review."}
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
