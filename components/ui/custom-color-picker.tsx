"use client";

import * as React from "react";
import { Check, Palette, Sparkles, Wand2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { backgroundColorOptions } from "@/config/forms/story-form-options";

interface CustomColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
  name: string
}

export function CustomColorPicker({
  value,
  onChange,
  disabled = false,
  name
}: CustomColorPickerProps) {
  const [customColor, setCustomColor] = React.useState(value);
  const [showCustomInput, setShowCustomInput] = React.useState(false);

  // Helper function to determine text color based on background
  const getContrastColor = (hexColor: string): string => {
    if (!hexColor) return "#000000";
    
    // Remove # if present
    const hex = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  // Check if the current value is in predefined colors
  const isPredefinedColor = backgroundColorOptions.some(
    (color) => color.value === value
  );

  const handlePredefinedColorSelect = (colorValue: string) => {
    onChange(colorValue);
    setCustomColor(colorValue);
    setShowCustomInput(false);
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    onChange(color);
  };

  const handleCustomColorInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const color = event.target.value;
    setCustomColor(color);
    onChange(color);
  };

  const toggleCustomInput = () => {
    setShowCustomInput(!showCustomInput);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-12 border-2 transition-all duration-200 hover:border-primary/50 hover:shadow-md group",
            !value && "text-muted-foreground",
            "bg-gradient-to-r from-background to-background/50"
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="relative">
              <div
                className="w-6 h-6 rounded-lg border-2 border-white shadow-sm transition-transform duration-200 group-hover:scale-110"
                style={{ 
                  backgroundColor: value || "#ffffff",
                  boxShadow: `0 0 0 1px ${value || "#e5e7eb"}, 0 2px 4px rgba(0,0,0,0.1)`
                }}
              />
              {value && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="block font-medium text-sm truncate">
                {isPredefinedColor
                  ? backgroundColorOptions.find((color) => color.value === value)
                      ?.label
                  : value || "Choose your perfect color"}
              </span>
              <span className="block text-xs text-muted-foreground truncate">
                {value ? `${value} • Click to customize` : "Select from presets or create custom"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Palette className="w-4 h-4 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 border-2 shadow-2xl bg-gradient-to-br from-background via-background to-background/95" align="start">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 pb-2 border-b border-border/50">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-black" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Color Studio</h3>
              <p className="text-xs text-muted-foreground">Craft the perfect background</p>
            </div>
          </div>

          {/* Predefined Colors */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <Label className="text-sm font-semibold">Curated Palette</Label>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {backgroundColorOptions.map((color, index) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handlePredefinedColorSelect(color.value)}
                  className={cn(
                    "size-10 rounded-xl border-2 transition-all duration-300 relative group overflow-hidden",
                    "hover:scale-110 hover:rotate-3 hover:shadow-lg transform-gpu",
                    value === color.value 
                      ? "border-primary ring-4 ring-primary/20 scale-105" 
                      : "border-border/30 hover:border-primary/50"
                  )}
                  style={{ 
                    backgroundColor: color.color,
                    animationDelay: `${index * 50}ms`
                  }}
                  title={color.label}
                  disabled={disabled}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Selection indicator */}
                  {value === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                        <Check className="w-3 h-3 text-gray-900 font-bold" />
                      </div>
                    </div>
                  )}
                  
                  {/* Enhanced Tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                    <div className="font-medium">{color.label}</div>
                    <div className="text-gray-300 text-[10px]">{color.value}</div>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Section */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <Label className="text-sm font-semibold">Custom Creator</Label>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleCustomInput}
                disabled={disabled}
                className="text-xs hover:bg-primary/10 transition-colors"
              >
                {showCustomInput ? "Hide" : "Show"} Advanced
              </Button>
            </div>

            {/* Enhanced Color Input */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    disabled={disabled}
                    className="w-16 h-16 rounded-xl border-2 border-border cursor-pointer disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 hover:shadow-lg overflow-hidden"
                    title="Pick a custom color"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Current Selection</span>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-mono">
                      {value}
                    </span>
                  </div>
                  <div
                    className="w-full h-10 rounded-xl border-2 border-border flex items-center justify-center text-sm font-medium transition-all duration-200 relative overflow-hidden group"
                    style={{ 
                      backgroundColor: value,
                      color: getContrastColor(value),
                      boxShadow: `inset 0 2px 4px rgba(0,0,0,0.1)`
                    }}
                  >
                    <span className="relative z-10">Live Preview</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700" />
                  </div>
                </div>
              </div>

              {/* Advanced Input */}
              {showCustomInput && (
                <div className="space-y-3 p-4 bg-muted/30 rounded-xl border border-border/50 animate-in slide-in-from-top-2 duration-200">
                  <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <Wand2 className="w-3 h-3" />
                    Manual Color Input
                  </Label>
                  <Input
                    type="text"
                    value={customColor}
                    onChange={handleCustomColorInputChange}
                    placeholder="#FF5733"
                    disabled={disabled}
                    className="font-mono text-sm bg-background border-2 focus:border-primary transition-colors"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter hex codes like #FF5733 or use the color picker above
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Preview */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <Label className="text-sm font-semibold">{name} Preview</Label>
            </div>
            
            <div className="relative group">
              <div
                className="w-full h-20 rounded-xl border-2 border-border flex items-center justify-center font-semibold text-lg transition-all duration-300 relative overflow-hidden shadow-inner"
                style={{ 
                  backgroundColor: value,
                  color: getContrastColor(value),
                  boxShadow: `inset 0 4px 8px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.1)`
                }}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-2 left-2 w-8 h-8 border border-current rounded-full"></div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 border border-current rounded-full"></div>
                  <div className="absolute top-1/2 right-4 w-4 h-4 border border-current rounded-full"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  <div className="font-bold text-lg mb-1">{name} Background</div>
                  <div className="text-sm opacity-80">Perfect for magical tales</div>
                </div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
              </div>
              
              {/* Color info badge */}
              <div className="absolute -top-2 -right-2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full shadow-lg animate-pulse">
                {isPredefinedColor ? "Curated" : "Custom"}
              </div>
            </div>
            
            {/* Color details */}
            <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: value }}
                />
                <span className="font-mono">{value}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {isPredefinedColor 
                    ? backgroundColorOptions.find(c => c.value === value)?.label 
                    : "Custom Color"
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}