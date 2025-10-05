"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card"; // CardHeader/CardTitle are removed for simpler structure
import { TrendingUp, TrendingDown, User } from "lucide-react";
// Assuming you have 'Smile' for the children icon, if not, you'd need to install it or use a custom one.
// Let's use 'Smile' as a placeholder for the children icon.
import { Smile } from "lucide-react"; 
import { UserSummary } from "@/types/analytics.type";
import { cn } from "@/lib/utils";

interface UserSummaryCardsProps {
  userSummary: UserSummary;
}

// Helper function to format large numbers
const formatNumber = (num: number) =>
  new Intl.NumberFormat('en-US').format(num);

// Card definition (data model based on UserSummary structure)
interface StatCard {
  title: string;
  value: number;
  trend: number;
  role: 'parent' | 'child'; // Used to select the main icon
  type: 'total' | 'paid' | 'unpaid';
}

export const UserSummaryCards: React.FC<UserSummaryCardsProps> = ({ userSummary }) => {

  // 1. Prepare data into a flat array of cards
  const cards: StatCard[] = [
    // Parents
    { title: "Total Parents", value: userSummary.parents.total, trend: userSummary.parents.trends.total, role: 'parent', type: 'total' },
    { title: "Paid Parents", value: userSummary.parents.paid, trend: userSummary.parents.trends.paid, role: 'parent', type: 'paid' },
    { title: "Unpaid Parents", value: userSummary.parents.unpaid, trend: userSummary.parents.trends.unpaid, role: 'parent', type: 'unpaid' },
    // Children
    { title: "Total Children", value: userSummary.children.total, trend: userSummary.children.trends.total, role: 'child', type: 'total' },
    { title: "Paid Children", value: userSummary.children.paid, trend: userSummary.children.trends.paid, role: 'child', type: 'paid' },
    { title: "Unpaid Children", value: userSummary.children.unpaid, trend: userSummary.children.trends.unpaid, role: 'child', type: 'unpaid' },
  ];

  // 2. Determine icon, color, and label based on trend value
  const getTrendProps = (trend: number) => {
    // const isPositive = trend >= 0;
    const absTrend = Math.abs(trend);

    let trendColor = "text-gray-500";
    let TrendIcon = TrendingUp; // Using a different name to avoid conflict with Icon variable

    if (trend > 0) {
      trendColor = "text-green-600"; // Primary success color
      TrendIcon = TrendingUp;
    } else if (trend < 0) {
      trendColor = "text-red-600"; // Primary danger color
      TrendIcon = TrendingDown;
    } else {
      TrendIcon = TrendingUp; // Neutral, use Up icon with gray color
    }

    // Format the percentage with one decimal place as seen in the design (e.g., 8.2%)
    const trendText = `${absTrend.toFixed(1)}%`;

    return { TrendIcon, trendColor, trendText };
  };

  return (
    <div className="space-y-4">
      {/* Title styling matched to the design */}
      <h2 className="text-sm font-semibold text-[#5C6BC0] ml-1">User Overview</h2>

      {/* Grid: Single column on mobile, 6 equal columns on desktop (lg) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
        {cards.map((card, index) => {
          const { TrendIcon, trendColor, trendText } = getTrendProps(card.trend);
          
          // Determine the main icon component based on the role
          const MainIcon = card.role === 'parent' ? User : Smile;
          
          // Determine the main icon color (a specific shade of blue/primary)
          const mainIconColor = 'text-blue-500'; // Adjust as needed for your specific blue

          return (
            // The card has a simple, solid border and a larger radius
            <Card 
              key={index} 
              className="p-4 rounded-xl shadow-sm border border-gray-100" // Added rounded-xl and subtle shadow/border
            >
              <CardContent className="p-0 flex flex-col space-y-2">
                
                {/* 1. Title (Smaller, less emphasis) */}
                <p className="text-sm text-gray-500 font-normal">
                  {card.title}
                </p>

                {/* 2. Main Value & Icon (Flex layout for horizontal arrangement) */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    
                    {/* The value is significantly larger and bolder */}
                    <p className="text-3xl font-extrabold text-gray-900 leading-none">
                      {formatNumber(card.value)}
                    </p>
                    
                    {/* Trend line is directly below the value */}
                    <div className={cn("flex items-center mt-2 text-sm", trendColor)}>
                      <TrendIcon className="inline h-4 w-4 mr-1 stroke-2" />
                      <span className="font-semibold">{trendText}</span>
                    </div>
                  </div>
                  
                  {/* The Main Icon is positioned to the right, larger than before */}
                  <MainIcon className={cn("h-6 w-6", mainIconColor, card.role === 'child' ? 'mt-1' : 'mt-0')} />
                </div>

              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};