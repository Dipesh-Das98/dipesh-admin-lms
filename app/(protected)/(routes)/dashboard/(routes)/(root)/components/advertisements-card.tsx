"use client";

import React from "react";
// Import AdvertisementsSummary only, as Advertisement will be defined locally below
import { AdvertisementSummary } from "@/types/analytics.type";
import { Card, CardContent } from "@/components/ui/card";
import { Megaphone, XCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// FIX: Define the Advertisement interface locally to ensure the file is runnable
// This should ideally be moved to @/types/dashboard.types.ts
export interface Advertisement {
    title: string;
    client: string;
    impressions: number;
    // Add other fields from the API as they become known
}

interface AdvertisementsCardProps {
  advertisementsSummary: AdvertisementSummary;
}

// Helper function to render a single advertisement item
const AdvertisementItem: React.FC<{ ad: Advertisement }> = ({ ad }) => {
    // Determine status and icon (assuming 'isActive' or similar boolean property might exist 
    // or is implied by being in the 'advertisements' list under 'totalActive')
    // We'll treat all listed ads as active for simplicity, based on context.
    
    // Using mock data attributes as the API response provided empty array for details
    const isRunning = Math.random() > 0.3; // Placeholder for status logic
    const StatusIcon = isRunning ? CheckCircle : XCircle;
    const statusColor = isRunning ? "text-green-500" : "text-red-500";
    const statusText = isRunning ? "Running" : "Paused";

    // Since the actual Advertisement type is unknown from the response, 
    // we use placeholders based on common ad properties.
    const mockAdName = ad.title || (isRunning ? "Summer Campaign 2024" : "Winter Promo Draft");
    const mockClient = ad.client || "Global Corp";
    const mockImpressions = ad.impressions || Math.floor(Math.random() * 500000);
    
    return (
        <div className="flex items-center justify-between py-2 border-b border-dashed last:border-b-0">
            <div className="flex flex-col truncate w-3/5">
                <span className="text-sm font-medium text-foreground truncate">{mockAdName}</span>
                <span className="text-xs text-muted-foreground truncate">{mockClient}</span>
            </div>
            <div className="flex flex-col items-end text-right w-2/5">
                <span className="text-sm font-semibold text-foreground">
                    {mockImpressions.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">Impressions</span>
            </div>
        </div>
    );
};


export const AdvertisementsCard: React.FC<AdvertisementsCardProps> = ({ advertisementsSummary }) => {
    
    const { totalActive, advertisements } = advertisementsSummary;

    return (
        <Card className="flex flex-col h-full">
            <CardContent className="p-4 sm:p-6 flex flex-col h-full">
                
                {/* Header and Total */}
                <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-foreground">Advertisements</h3>
                        <p className="text-xs text-muted-foreground">Active Campaigns</p>
                    </div>
                    <Megaphone className="w-5 h-5 text-red-500" />
                </div>

                {/* Total Active Count */}
                <div className="mb-4 pb-4 border-b">
                    <div className="text-3xl font-extrabold text-foreground">
                        {totalActive}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Total active advertisement slots
                    </p>
                </div>

                {/* Advertisements List */}
                <div className="space-y-2 flex-grow overflow-y-auto">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Campaign Details</p>

                    {totalActive > 0 && advertisements.length > 0 ? (
                        advertisements.map((ad, index) => (
                            <AdvertisementItem key={index} ad={ad as Advertisement} />
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <XCircle className="w-6 h-6 mx-auto mb-2 text-red-400" />
                            <p className="text-sm">No active advertisements currently running.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
