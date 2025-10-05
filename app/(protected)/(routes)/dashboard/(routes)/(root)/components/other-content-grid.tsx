"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
    BookOpen, 
    Film, 
    Music, 
    Gamepad2, 
    LibraryBig, 
    Heart, 
    Globe, 
    Clock, 
    Headphones 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OtherContent } from "@/types/analytics.type";

interface OtherContentGridProps {
    otherContent: OtherContent;
}

// Helper function to format numbers
const formatNumber = (num: number) => 
    new Intl.NumberFormat('en-US').format(num);

// Data structure to map API keys to display properties
interface ContentItem {
    key: keyof OtherContent;
    name: string;
    icon: React.ElementType;
    color: string; // Not used for final color, but kept for structure
}

const contentItems: ContentItem[] = [
    { key: "stories", name: "Stories", icon: BookOpen, color: "text-green-600" },
    { key: "movies", name: "Movies", icon: Film, color: "text-green-600" },
    { key: "music", name: "Music", icon: Music, color: "text-green-600" },
    { key: "games", name: "Games", icon: Gamepad2, color: "text-green-600" },
    { key: "library", name: "Library", icon: LibraryBig, color: "text-green-600" },
    { key: "ethicsCorner", name: "Ethics Corner", icon: Heart, color: "text-green-600" },
    { key: "languageCorner", name: "Language Corner", icon: Globe, color: "text-green-600" },
    { key: "variety", name: "Variety", icon: Clock, color: "text-green-600" },
    { key: "readAlong", name: "Read-Along", icon: Headphones, color: "text-green-600" },
];

// Define shared green styles
const GREEN_ICON_TEXT_COLOR = "text-green-600";
const GREEN_COUNT_TEXT_COLOR = "text-green-600";

export const OtherContentGrid: React.FC<OtherContentGridProps> = ({ otherContent }) => {

    return (
        <div className="space-y-4">
            {/* Header styling matches the specific blue/grey text in the Figma */}
            <div className="space-y-1">
                <h2 className="text-sm font-semibold text-[#5C6BC0]">
                    Other Content
                </h2>
                <h3 className="text-xl font-semibold text-gray-800">
                    Content Categories
                </h3>
            </div>

            {/* Responsive Grid: 
                Mobile (default): 1 column (w-full cards)
                Small screens (sm): 2 columns
                Large screens (lg): 5 columns 
            */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {contentItems.map((item) => {
                    const count = otherContent[item.key] || 0;
                    
                    return (
                        <Card 
                            key={item.key} 
                            // Increased padding/height for the larger card appearance
                            className="p-4 rounded-xl shadow-sm border border-gray-100" 
                        >
                            {/* FIX: Reverted to horizontal layout (flex items-center justify-between) 
                                This places the text stack on the left and the icon on the right, horizontally aligned. */}
                            <CardContent className="p-0 flex items-center justify-between"> 
                                
                                {/* Left Section: Content Name and Count (Stacked) */}
                                <div className="flex flex-col">
                                    <p className="text-base font-medium text-gray-700 truncate mb-1">
                                        {item.name}
                                    </p>
                                    <p className={cn("text-lg font-semibold", GREEN_COUNT_TEXT_COLOR)}>
                                        {formatNumber(count)} items
                                    </p>
                                </div>
                                
                                {/* Right Section: Icon */}
                                <div>
                                    <item.icon className={cn("w-6 h-6", GREEN_ICON_TEXT_COLOR)} />
                                </div>
                                
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};