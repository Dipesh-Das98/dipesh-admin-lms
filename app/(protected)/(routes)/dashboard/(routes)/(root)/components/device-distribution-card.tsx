"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card"; // Removed CardHeader, CardTitle
// Importing specific icons to match the design (Android, Apple)
import { Monitor, BarChart, Smartphone } from "lucide-react"; 
import { cn } from "@/lib/utils";
import { RegisteredUsers } from "@/types/analytics.type";

interface DeviceDistributionCardProps {
  registeredUsers: RegisteredUsers;
}

// Helper function to format numbers
const formatNumber = (num: number) => 
  new Intl.NumberFormat('en-US').format(num);

// Data structure for the device breakdown list
interface DeviceStat {
    name: string;
    count: number;
    percentage: number;
    color: string;
    icon: React.ElementType;
}

export const DeviceDistributionCard: React.FC<DeviceDistributionCardProps> = ({ registeredUsers }) => {
  const totalRegistered = registeredUsers.total;
  const devicesData = registeredUsers.byDevice;
  
  // 1. Prepare Device Breakdown Data in a list format, mapping colors and icons
  const devices: DeviceStat[] = [
    // Android: Green, Icon: Android
    { name: "Android/Phone", count: devicesData.android.count, percentage: devicesData.android.percentage, color: "bg-green-600", icon: Smartphone },
    // iOS: Blue, Icon: Apple
    { name: "iPhone", count: devicesData.ios.count, percentage: devicesData.ios.percentage, color: "bg-blue-600", icon: Smartphone },
    // Web: Purple, Icon: Monitor
    { name: "Computer/Web", count: devicesData.web.count, percentage: devicesData.web.percentage, color: "bg-purple-600", icon: Monitor },
  ].sort((a, b) => b.count - a.count); // Sort by count descending

  // Utility to map bar colors to text colors
  const getTextColor = (colorClass: string) => colorClass.replace('bg-', 'text-');

  return (
    <Card className="flex flex-col h-full p-4 rounded-xl shadow-sm border border-gray-100"> {/* Updated Card styling */}
      <CardContent className="p-0 flex-grow">
        
        {/* Header - Overall Device Distribution */}
        <div className="flex justify-between items-center mb-6"> 
            {/* Title matches the design styling */}
            <h2 className="text-sm font-semibold text-[#5C6BC0]"> 
              Overall Device Distribution
            </h2>
            {/* Icon matches the design styling */}
            <BarChart className="w-5 h-5 text-gray-400" />
        </div>
        
        {/* Total Registered Users */}
        <div className="text-3xl font-extrabold text-gray-900 leading-none mb-1">
          {formatNumber(totalRegistered)}
        </div>
        <div className="text-sm text-gray-500 mb-6">
            Total Registered Users
        </div>

        {/* Device Distribution List & Bars */}
        <div className="space-y-4">
            {devices.map((device) => (
                <div key={device.name} className="space-y-1">
                    
                    {/* TOP ROW: Icon, Name, Count, Percentage */}
                    <div className="flex justify-between items-start text-sm">
                        
                        {/* Left Side: Icon and Name */}
                        <div className="flex items-center text-gray-700">
                            <device.icon className={cn("w-4 h-4 mr-2", getTextColor(device.color))} />
                            <span>{device.name}</span>
                        </div>
                        
                        {/* Right Side: Count and Percentage (Stacked) */}
                        <div className="flex flex-col items-end gap-0 font-medium">
                            {/* Count with its specific color */}
                            <span className={cn("text-sm", getTextColor(device.color))}>{formatNumber(device.count)}</span>
                            {/* Percentage with its specific color/opacity */}
                            <span className="text-xs text-gray-500">{device.percentage.toFixed(1)}%</span>
                        </div>
                    </div>
                    
                    {/* BOTTOM ROW: Progress Bar */}
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className={cn("h-full rounded-full transition-all duration-500", device.color)}
                            style={{ width: `${device.percentage}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};