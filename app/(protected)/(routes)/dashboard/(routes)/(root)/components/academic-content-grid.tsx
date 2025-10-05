"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, BarChart3, FlaskConical, Heart, BookOpenCheck } from "lucide-react"; 
import { cn } from "@/lib/utils";
import { AcademicGradeContent } from "@/types/analytics.type";

interface AcademicContentGridProps {
  academicContent: AcademicGradeContent[];
}

// Helper function to format numbers
const formatNumber = (num: number | undefined) => 
  num !== undefined ? new Intl.NumberFormat('en-US').format(num) : "N/A";

// Map subject keys to display name and icon (Colors corrected from previous step)
const subjectMap: { [key: string]: { name: string; icon: React.ElementType; color: string; badgeColor: string } } = {
  english: { name: "English", icon: BookOpen, color: "text-green-600", badgeColor: "bg-green-50 text-green-600" },
  math: { name: "Math", icon: BarChart3, color: "text-green-600", badgeColor: "bg-green-50 text-green-600" },
  science: { name: "Science", icon: FlaskConical, color: "text-red-600", badgeColor: "bg-red-50 text-red-600" },
  ethics: { name: "Ethics", icon: Heart, color: "text-green-600", badgeColor: "bg-green-50 text-green-600" },
};

export const AcademicContentGrid: React.FC<AcademicContentGridProps> = ({ academicContent }) => {

  const simpleTotalCard = academicContent.find(c => c.total !== undefined);
  const detailedSubjectCards = academicContent.filter(c => c.total === undefined);

  return (
    <div className="space-y-4">
      
      {/* Header styling matches the specific blue/grey text in the Figma */}
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-[#5C6BC0]">
          Content Categories
        </h2>
        <h3 className="text-xl font-semibold text-gray-800">
          Academic Content by Grade
        </h3>
      </div>

      {/* Main Grid Container: Controls the overall vertical flow */}
      <div className="flex flex-col gap-4">
        
        {/* 1. SIMPLE TOTAL CARD (e.g., Preschool) */}
        {simpleTotalCard && (
            <Card className="p-4 rounded-xl shadow-sm border border-gray-100 w-full lg:w-[280px] xl:w-[320px]"> 
                <CardContent className="p-0 flex justify-between items-start">
                    <div className="flex flex-col">
                        <p className="text-lg font-semibold text-blue-500 mb-1">
                            {simpleTotalCard.grade}
                        </p>
                        <p className="text-xl font-semibold text-green-600">
                            {formatNumber(simpleTotalCard.total)} items
                        </p>
                    </div>
                    <BookOpenCheck className="w-8 h-8 text-green-600 opacity-70" />
                </CardContent>
            </Card>
        )}

        {/* 2. DETAILED SUBJECT CARDS (e.g., Grade 1, 2, 3...) */}
        {/* FIX: Removed 'flex' from here, and control flow entirely with utility classes below. 
           Mobile: uses default block layout (stacking). 
           Desktop: uses lg:flex-row for horizontal scrolling. */}
        <div className={cn(
             "gap-4", 
             // Mobile/Default: Cards stack vertically (block layout)
             // Desktop: flex-row with overflow-x-auto for horizontal scrolling
             "lg:flex lg:flex-row lg:overflow-x-auto lg:pb-2", 
             "lg:[&>*]:flex-shrink-0"
        )}>
          {detailedSubjectCards.map((gradeContent, index) => {
            
            return (
              // FIX: Ensure mobile cards are full width, but apply the fixed width only on large screens.
              <Card 
                  key={index} 
                  className="p-4 rounded-xl shadow-sm border border-gray-100 w-full lg:w-[220px]" 
              >
                <CardContent className="p-0 flex flex-col space-y-4">
                  
                  <p className="text-lg font-semibold text-blue-500">
                    {gradeContent.grade}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                      {gradeContent.subjects && Object.entries(gradeContent.subjects).map(([key, count]) => {
                        const subject = subjectMap[key] || { name: key, icon: BookOpen, color: "text-gray-600", badgeColor: "bg-gray-50 text-gray-600" };
                        
                        return (
                          <div key={key} className={cn("flex items-center justify-between px-2 py-1 rounded-full", subject.badgeColor)}>
                            <div className="flex items-center">
                                <subject.icon className={cn("w-3 h-3 mr-1", subject.color)} />
                                <span className="text-xs font-medium">{subject.name}</span>
                            </div>
                            <span className="text-xs font-semibold">{formatNumber(count)}</span>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};