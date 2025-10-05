"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
// Updated imports to include Android and Apple for better visual match
import { Users, User, Smile, Monitor, Smartphone } from "lucide-react"; 
import { cn } from "@/lib/utils";
import { ActiveUsers } from "@/types/analytics.type";

interface LiveActivityCardProps {
  activeUsers: ActiveUsers;
}

// Helper function to format numbers
const formatNumber = (num: number) =>
  new Intl.NumberFormat('en-US').format(num);

// Data structure for the device breakdown
interface DeviceBreakdown {
    name: string;
    count: number;
    color: string;
    icon: React.ElementType;
    key: 'WEB' | 'ANDROID' | 'IOS';
}

export const LiveActivityCard: React.FC<LiveActivityCardProps> = ({ activeUsers }) => {
  const totalActive = activeUsers.total;
  
  // 1. Prepare Device Breakdown Data - Updated icons and colors
  const devices: DeviceBreakdown[] = [
    // Using Android icon and green color as seen in the design
    { name: "Android/Phone", count: activeUsers.byDevice.ANDROID, color: "text-green-600", icon: Smartphone, key: 'ANDROID' }, 
    // Using Apple icon and blue color
    { name: "iPhone", count: activeUsers.byDevice.IOS, color: "text-blue-500", icon: Smartphone, key: 'IOS' }, 
    // Using Monitor icon and purple color
    { name: "Computer/Web", count: activeUsers.byDevice.WEB, color: "text-purple-600", icon: Monitor, key: 'WEB' }, 
  ];
  
  // Define specific colors for "Live Parents" and "Live Children" as per design
  const liveParentTextColor = "text-blue-500";
  const liveChildrenTextColor = "text-green-600"; // Green color from children's count

  return (
    <Card className="flex flex-col h-full p-4 rounded-xl shadow-sm border border-gray-100"> 
      <CardContent className="p-0 flex-grow">
        
        {/* Header - Currently Live Users (Full Width) */}
        <div className="flex justify-between items-center mb-6"> 
          <h2 className="text-sm font-semibold text-[#5C6BC0]"> 
            Currently Live Users
          </h2>
          <Users className="w-5 h-5 text-[#5C6BC0]" />
        </div>
        
        {/* Total Live Users (Full Width) */}
        <div className="flex justify-between items-center mb-1"> {/* Reduced bottom margin */}
          <p className="text-3xl font-extrabold text-gray-900 leading-none">
            {formatNumber(totalActive)}
          </p>
          {/* Main icon moved next to the total number */}
          <Users className="w-6 h-6 text-blue-500" />
        </div>
        <p className="text-sm text-gray-500 mb-6"> 
            Total Active Now
        </p>

        {/* BEGIN: RESPONSIVE TWO-COLUMN SECTION */}
        {/* Mobile: space-y-4 stacks everything vertically. */}
        {/* Desktop (md and up): flex and space-x-6 creates a side-by-side layout. */}
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 justify-between">
            
            {/* LEFT COLUMN: Live User Breakdown (Parents vs Children) */}
            <div className="space-y-3 md:w-1/2">
                {/* Live Parents Card/Pill */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                        <User className={cn("w-4 h-4", liveParentTextColor)} />
                        <span className="text-sm font-medium text-gray-700">Live Parents</span>
                    </div>
                    {/* Count in the blue color */}
                    <span className={cn("text-sm font-semibold", liveParentTextColor)}>{formatNumber(activeUsers.parents)}</span>
                </div>
                
                {/* Live Children Card/Pill */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                        {/* Using Smile for children, with the green color */}
                        <Smile className={cn("w-4 h-4", liveChildrenTextColor)} /> 
                        <span className="text-sm font-medium text-gray-700">Live Children</span>
                    </div>
                    {/* Count in the green color */}
                    <span className={cn("text-sm font-semibold", liveChildrenTextColor)}>{formatNumber(activeUsers.children)}</span>
                </div>
            </div>

            {/* RIGHT COLUMN: Device Breakdown List */}
            <div className="space-y-3 md:w-1/2">
                {devices.map((device) => (
                    <div key={device.name} className="flex justify-between items-center py-1"> {/* Added py-1 for spacing parity */}
                        <div className="flex items-center gap-2">
                            <device.icon className={cn("w-4 h-4", device.color)} />
                            <span className="text-sm text-gray-700">{device.name}</span>
                        </div>
                        {/* Count color applied directly from device data */}
                        <span className={cn("text-sm font-semibold", device.color)}>{formatNumber(device.count)}</span>
                    </div>
                ))}
            </div>
        </div>
        {/* END: RESPONSIVE TWO-COLUMN SECTION */}

      </CardContent>
    </Card>
  );
};