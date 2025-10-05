"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Heart, MessageCircle, Bot, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ParentCategories } from "@/types/analytics.type";

interface ParentFeaturesOverviewProps {
    parentCategories: ParentCategories;
}

// Helper function to format large numbers
const formatNumber = (num: number | undefined) =>
    num !== undefined ? new Intl.NumberFormat('en-US').format(num) : "N/A";

// Interface for structuring the display items
interface FeatureStat {
    title: string;
    value: number;
    unit: string;
    trend: number;
    icon: React.ElementType;
    color: string;
}

export const ParentFeaturesOverview: React.FC<ParentFeaturesOverviewProps> = ({ parentCategories }) => {

    const features: FeatureStat[] = [
        {
            title: "Family Health",
            value: parentCategories.familyHealth.newVideosThisWeek || 0,
            unit: "Videos",
            trend: parentCategories.familyHealth.trend,
            icon: Zap,
            color: "text-blue-500",
        },
        {
            title: "Community Hub",
            value: parentCategories.communityHub.activeUsersThisWeek || 0,
            unit: "Users/week",
            trend: parentCategories.communityHub.trend,
            icon: MessageCircle,
            color: "text-blue-500",
        },
        {
            title: "TenaBot",
            value: parentCategories.tenaBot.activeUsersThisWeek || 0,
            unit: "Users/week",
            trend: parentCategories.tenaBot.trend,
            icon: Bot,
            color: "text-blue-500",
        },
    ];

    const getTrendProps = (trend: number) => {
        const isPositive = trend >= 0;
        const absTrend = Math.abs(trend);
        
        let trendColor = isPositive ? "text-green-600" : "text-red-600";
        let Icon = isPositive ? TrendingUp : TrendingDown;

        return { Icon, trendColor, trendText: `${absTrend.toFixed(1)}%` };
    };

    return (
        <Card className="p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col"> 
            
            <div className="space-y-1 mb-4">
                <h2 className="text-sm font-semibold text-[#5C6BC0]">
                    Administrative Overview
                </h2>
                <h3 className="text-xl font-semibold text-gray-800">
                    Parent Features
                </h3>
            </div>
            
            <div className="grid grid-cols-1 gap-2"> 
                {features.map((feature, index) => {
                    const { Icon, trendColor, trendText } = getTrendProps(feature.trend);
                    
                    return (
                        <Card 
                            key={index} 
                            className="p-3 rounded-xl shadow-sm border border-gray-100" 
                        >
                            {/* FIX: Removed justify-between. Now using a flex container with gap-4 
                                   and push the icon to the right with ml-auto. This creates a fixed gap 
                                   and ensures the icon is always on the far right. */}
                            <CardContent className="p-0 flex items-center gap-4">
                                
                                {/* LEFT SIDE: Stacked content */}
                                <div className="flex flex-col"> 
                                    
                                    {/* Title */}
                                    <span className="text-base font-medium text-gray-700 mb-0">{feature.title}</span> 

                                    {/* Value and Unit (on the same line) */}
                                    <div className="flex items-baseline mb-1">
                                        <span className="text-2xl font-extrabold text-gray-900 leading-none mr-2"> 
                                            {formatNumber(feature.value)}
                                        </span>
                                        <span className="text-base text-gray-500 font-medium">{feature.unit}</span>
                                    </div>

                                    {/* Trend */}
                                    <div className="flex items-center">
                                        <Icon className={cn("inline w-4 h-4 mr-1 stroke-2", trendColor)} />
                                        <span className={cn("text-sm font-semibold", trendColor)}>
                                            {trendText}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* RIGHT SIDE: Icon is pushed to the far right using ml-auto 
                                    while maintaining a minimum gap of gap-4 from the text. */}
                                <div className="flex-shrink-0 ml-auto">
                                   <feature.icon className={cn("w-7 h-7", feature.color)} />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </Card>
    );
};