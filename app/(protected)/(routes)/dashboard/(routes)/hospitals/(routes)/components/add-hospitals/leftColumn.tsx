// components/add-hospitals/leftColumn.tsx
"use client";

import React from "react";
import { UseFormReturn, useFieldArray, Path, ControllerRenderProps } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { HospitalFormValues } from "./mainform";
import { HospitalVaccinationSlot } from "@/types/hospital.type";


// --- Type Definitions and Helpers ---

interface LeftColumnProps {
  form: UseFormReturn<HospitalFormValues>;
}

const RequiredLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500"></span>
        {children}
    </span>
);

type SlotFieldPath = Path<HospitalFormValues>;

// Helper function to safely cast complex/nullish field values to a string for Input/Textarea
const castToInputString = (field: ControllerRenderProps<HospitalFormValues, SlotFieldPath>) => {
  // Ensure the value is string-compatible or defaults to empty string
  return (field.value as string | undefined) ?? "";
};


// --- Internal Component for a single Slot Item ---

interface SlotItemProps {
  control: UseFormReturn<HospitalFormValues>['control'];
  vaccinationIndex: number;
  slotIndex: number;
  remove: (index: number) => void;
}

const SlotItem: React.FC<SlotItemProps> = ({ control, vaccinationIndex, slotIndex, remove }) => {
  const fieldPrefix = `vaccinations.${vaccinationIndex}.slots.${slotIndex}`;
  
  return (
    <div className="flex items-center gap-2 p-2 border border-dashed rounded-lg bg-background/50">
        <div className="flex-shrink-0 text-sm font-medium text-muted-foreground w-12">Slot {slotIndex + 1}</div>
        
        {/* Date */}
        <FormField
            control={control}
            name={`${fieldPrefix}.date` as SlotFieldPath} 
            render={({ field }) => (
                <FormItem className="flex-1">
                    <FormControl>
                        <Input 
                            type="date" 
                            placeholder="Date" 
                            {...field} 
                            value={castToInputString(field)}
                            className="h-9" 
                        />
                    </FormControl>
                    <FormMessage className="text-[10px] m-0 p-0" />
                </FormItem>
            )}
        />

        {/* Start Time */}
        <FormField
            control={control}
            name={`${fieldPrefix}.start` as SlotFieldPath} 
            render={({ field }) => (
                <FormItem className="flex-1">
                    <FormControl>
                        <Input 
                            type="time" 
                            placeholder="Start" 
                            {...field} 
                            value={castToInputString(field)}
                            className="h-9" 
                        />
                    </FormControl>
                    <FormMessage className="text-[10px] m-0 p-0" />
                </FormItem>
            )}
        />
        
        {/* End Time */}
        <FormField
            control={control}
            name={`${fieldPrefix}.end` as SlotFieldPath} 
            render={({ field }) => (
                <FormItem className="flex-1">
                    <FormControl>
                        <Input 
                            type="time" 
                            placeholder="End" 
                            {...field} 
                            value={castToInputString(field)}
                            className="h-9" 
                        />
                    </FormControl>
                    <FormMessage className="text-[10px] m-0 p-0" />
                </FormItem>
            )}
        />
        
        {/* Session */}
        <FormField
            control={control}
            name={`${fieldPrefix}.session` as SlotFieldPath} 
            render={({ field }) => (
                <FormItem className="flex-1">
                    <FormControl>
                        <Input 
                            placeholder="Session" 
                            {...field} 
                            value={castToInputString(field)}
                            className="h-9" 
                        />
                    </FormControl>
                    <FormMessage className="text-[10px] m-0 p-0" />
                </FormItem>
            )}
        />

        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(slotIndex)}
            className="flex-shrink-0 h-8 w-8 text-red-500 hover:bg-red-500/10"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3" />
            </svg>
        </Button>
    </div>
  );
};


// --- Internal Component for a single Vaccination Item ---

interface VaccinationItemProps {
  control: UseFormReturn<HospitalFormValues>['control'];
  index: number;
  remove: (index: number) => void;
}

const VaccinationItem: React.FC<VaccinationItemProps> = ({ control, index, remove }) => {
  const { fields: slotFields, append: appendSlot, remove: removeSlot } = useFieldArray({
    control: control,
    name: `vaccinations.${index}.slots`,
  });
    
  return (
    <div className="p-4 border border-border/70 rounded-xl space-y-6 bg-background/80 relative">
      <h4 className="text-md font-semibold text-primary/80">Vaccination #{index + 1}</h4>
      
      {/* Remove Vaccination Button */}
      <Button
        type="button"
        variant="destructive"
        size="icon"
        onClick={() => remove(index)}
        className="absolute top-3 right-3 h-8 w-8"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Button>
      
      {/* Vaccination Name */}
      <FormField
        control={control}
        name={`vaccinations.${index}.name` as SlotFieldPath}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm"><RequiredLabel>Name</RequiredLabel></FormLabel>
            <FormControl>
              <Input placeholder="e.g., Polio Vaccine" {...field} value={castToInputString(field)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Age Range */}
      <FormField
        control={control}
        name={`vaccinations.${index}.age_range` as SlotFieldPath}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm"><RequiredLabel>Age Range</RequiredLabel></FormLabel>
            <FormControl>
              <Input placeholder="e.g., 0-5 years" {...field} value={castToInputString(field)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Description */}
      <FormField
        control={control}
        name={`vaccinations.${index}.description` as SlotFieldPath}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm"><RequiredLabel>Description</RequiredLabel></FormLabel>
            <FormControl>
              <Textarea placeholder="Brief description of the vaccine..." {...field} value={castToInputString(field)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <Separator className="my-4" />
      
      {/* Slot Array Management */}
      <div className="space-y-3">
        <h5 className="text-base font-semibold text-foreground/90">Available Time Slots</h5>
        
        {slotFields.map((slotField, slotIndex) => (
            <SlotItem 
                key={slotField.id} 
                control={control} 
                vaccinationIndex={index} 
                slotIndex={slotIndex} 
                remove={removeSlot}
            />
        ))}

        {/* Add Slot Button */}
        <Button
            type="button"
            variant="secondary"
            className="w-full h-10 border-dashed border-2 text-sm"
            onClick={() => 
                appendSlot({ 
                    date: "", 
                    start: "", 
                    end: "", 
                    session: "" 
                } as HospitalVaccinationSlot)
            }
        >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Time Slot
        </Button>
      </div>
    </div>
  );
};


// --- Main LeftColumn Component ---

const LeftColumn: React.FC<LeftColumnProps> = ({ form }) => {
    
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "vaccinations",
  });
    
  // Helper for string fields in LeftColumn (uses the global helper)
  const castToString = (field: ControllerRenderProps<HospitalFormValues, Path<HospitalFormValues>>) => 
    (field.value as string | undefined) ?? "";


  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-6 space-y-4">
          
          {/* Hospital Details Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Hospital Details</h3>
          </div>

          {/* Simple Fields - Fixed: using value={castToString(field)} */}
          <FormField control={form.control} name="name" render={({ field }) => (<FormItem className="space-y-3"><FormLabel><RequiredLabel>Hospital Name</RequiredLabel></FormLabel><FormControl><Input placeholder="e.g., Yekatit 12 Hospital" {...field} value={castToString(field)} /></FormControl><FormMessage className="text-xs" /></FormItem>)} />
          <FormField control={form.control} name="address" render={({ field }) => (<FormItem className="space-y-3"><FormLabel><RequiredLabel>Address</RequiredLabel></FormLabel><FormControl><Input placeholder="e.g., Arat Kilo, Addis Ababa" {...field} value={castToString(field)} /></FormControl><FormMessage className="text-xs" /></FormItem>)} />
          <FormField control={form.control} name="phone" render={({ field }) => (<FormItem className="space-y-3"><FormLabel><RequiredLabel>Phone Number</RequiredLabel></FormLabel><FormControl><Input placeholder="e.g., +251-11-552-7000" {...field} value={castToString(field)} /></FormControl><FormMessage className="text-xs" /></FormItem>)} />
          <FormField control={form.control} name="emergencyContact" render={({ field }) => (<FormItem className="space-y-3"><FormLabel><RequiredLabel>Emergency Contact</RequiredLabel></FormLabel><FormControl><Input placeholder="e.g., 24/7 Emergency" {...field} value={castToString(field)} /></FormControl><FormMessage className="text-xs" /></FormItem>)} />
          
          {/* Rating (Handles number conversion and null coalescing internally) */}
          <FormField control={form.control} name="rating" render={({ field }) => (<FormItem className="space-y-3"><FormLabel><RequiredLabel>Rating (0.0 to 5.0)</RequiredLabel></FormLabel><FormControl><Input type="number" step="0.1" min="0" max="5" placeholder="e.g., 4.5" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} value={field.value ?? ""} /></FormControl><FormMessage className="text-xs" /></FormItem>)} />
          
          {/* Latitude (Handles number conversion and null coalescing internally) */}
          <FormField control={form.control} name="latitude" render={({ field }) => (<FormItem className="space-y-3"><FormLabel>Latitude</FormLabel><FormControl><Input type="number" step="0.0001" placeholder="e.g., 9.03" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value === "" ? null : parseFloat(e.target.value))} /></FormControl><FormMessage className="text-xs" /></FormItem>)} />
          
          {/* Longitude (Handles number conversion and null coalescing internally) */}
          <FormField control={form.control} name="longitude" render={({ field }) => (<FormItem className="space-y-3"><FormLabel>Longitude</FormLabel><FormControl><Input type="number" step="0.0001" placeholder="e.g., 38.74" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value === "" ? null : parseFloat(e.target.value))} /></FormControl><FormMessage className="text-xs" /></FormItem>)} />
          
          {/* Active Status (Unchanged) */}
          <FormField control={form.control} name="isActive" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-background"><div className="space-y-0.5"><FormLabel className="text-base">Hospital Active Status</FormLabel><div className="text-sm text-muted-foreground">{field.value ? "The hospital record is currently visible/active." : "The hospital record is inactive and hidden."}</div></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />

          <Separator className="my-8" />
          
          {/* Vaccination Array Management */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Provided Vaccinations
              </h3>
            </div>
            
            <div className="space-y-6">
              {fields.map((field, index) => (
                <VaccinationItem 
                  key={field.id} 
                  control={form.control} 
                  index={index} 
                  remove={remove} 
                />
              ))}
            </div>

            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-dashed border-2 hover:bg-muted/50 transition-colors"
                onClick={() => 
                    append({ 
                        name: "", 
                        age_range: "", 
                        description: "", 
                        slots: [] 
                    })
                }
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Vaccination
              </Button>
            </div>

            {fields.length === 0 && (
                <p className="text-sm text-center text-muted-foreground mt-4 p-4 border rounded-lg bg-background/50">
                    No vaccinations added yet. Click "Add New Vaccination" to start.
                </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftColumn;