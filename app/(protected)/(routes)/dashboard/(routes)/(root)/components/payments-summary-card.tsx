"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentsSummary } from "@/types/analytics.type";

interface PaymentsSummaryCardProps {
  paymentsSummary: PaymentsSummary;
}

// FIX: Helper function to format as currency (ETB)
const formatCurrency = (amount: number) => {
  // Assuming the number is already in the base unit (e.g., Birr) as per Figma
  // Format with ETB prefix and US number grouping for large numbers
  const formattedAmount = new Intl.NumberFormat('en-US').format(amount);
  return `ETB ${formattedAmount}`; 
};

// Helper function to format numbers
const formatNumber = (num: number) => 
  new Intl.NumberFormat('en-US').format(num);

// Define a placeholder for the green color used in the breakdown for paid items
const PAID_COLOR = "text-green-600";
const UNPAID_COLOR = "text-red-600";

export const PaymentsSummaryCard: React.FC<PaymentsSummaryCardProps> = ({ paymentsSummary }) => {
  
  const { weeklyTotal, trend, breakdown } = paymentsSummary;

  // Trend utility function
  const getTrendProps = (t: number) => {
    const isPositive = t >= 0;
    const absTrend = Math.abs(t);
    
    const trendColor = isPositive ? PAID_COLOR : UNPAID_COLOR;
    const Icon = isPositive ? TrendingUp : TrendingDown;

    // Use toFixed(1) for consistent decimal
    return { Icon, trendColor, trendText: `${absTrend.toFixed(1)}%` };
  };

  const { Icon, trendColor, trendText } = getTrendProps(trend);

  // Data structure for breakdown display (showing COUNT and title)
  // NOTE: For 'paidParents' and 'paidChildren', we must assume count is a number (or handle it in the types/API).
  const breakdownItems = [
    { title: "Paid Parents", count: breakdown.paidParents.count, color: PAID_COLOR },
    { title: "Unpaid Parents", count: breakdown.unpaidParents.count, color: UNPAID_COLOR },
    { title: "Paid Children", count: breakdown.paidChildren.count, color: PAID_COLOR },
    { title: "Unpaid Children", count: breakdown.unpaidChildren.count, color: UNPAID_COLOR },
  ];

  return (
    // Apply consistent Card styling
    <Card className="p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      <CardContent className="p-0 flex flex-col h-full space-y-4">
        
        {/* 1. HEADER: "Payments" */}
        <div className="text-lg font-semibold text-gray-900">Payments</div>

        {/* 2. TOTAL PAYMENTS SECTION */}
        <div className="space-y-3">
          
          {/* Top Row: Title and Icon */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="font-medium">Total Payments This Week</span>
            {/* Icon (DollarSign, styled green like the paid items) */}
            <DollarSign className={cn("w-5 h-5", PAID_COLOR)} />
          </div>
          
          {/* Bottom Row: Amount and Trend */}
          <div className="flex items-start justify-between">
            {/* Amount */}
            <span className="text-2xl font-extrabold text-gray-900 leading-none">
              {formatCurrency(weeklyTotal)}
            </span>
            
            {/* Trend */}
            <div className="flex items-center pt-1 ml-4 shrink-0">
              <Icon className={cn("inline h-4 w-4 mr-1 stroke-2", trendColor)} />
              <span className={cn("text-sm font-semibold", trendColor)}>
                {trendText}
              </span>
            </div>
          </div>
        </div>
        
        {/* 3. BREAKDOWN LIST */}
        <div className="space-y-3 pt-3 flex-grow">
          {breakdownItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              {/* Title (Paid Parents, Unpaid Children, etc.) */}
              <span className="font-medium text-gray-600">{item.title}</span>
              
              {/* Count (e.g., 8320) with color */}
              {/* FIX: Use the non-null assertion operator (!) to tell TypeScript 
                  that item.count will be a number at this point. 
                  Alternatively, use item.count !== undefined && formatNumber(item.count) */}
              <span className={cn("font-semibold", item.color)}>
                {formatNumber(item.count!)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};