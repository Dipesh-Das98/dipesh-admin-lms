"use client";

import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

import { DashboardContentData } from '@/types/analytics.type';
import { UserSummaryCards } from './user-summary-cards';
import { LiveActivityCard } from './live-activity-card';
import { DeviceDistributionCard } from './device-distribution-card';
import { AcademicContentGrid } from './academic-content-grid';
import { OtherContentGrid } from './other-content-grid';
import { ParentFeaturesOverview } from './parents-features-overview';
import { PaymentsSummaryCard } from './payments-summary-card';
import { AdvertisementsCard } from './advertisements-card';

interface DashboardContainerProps {
  data: DashboardContentData | null;
  error?: string;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({ data, error }) => {
  
  if (error) {
    return (
      <div className="p-6 border border-red-400 rounded-lg bg-red-50/50 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <p className="text-sm font-medium text-red-800">
          Error loading dashboard data: {error}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading dashboard content...
      </div>
    );
  }

  // --- Render the complex, responsive layout based on the Figma design ---
  return (
    <div className="space-y-6">
      
      {/* 1. User Overview (Full Width, 6 Cards) */}
      <UserSummaryCards userSummary={data.userSummary} />
      
      {/* 2. Live Activity & Device Distribution (Grid of 2 Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveActivityCard
          activeUsers={data.activeAndRegisteredUsers.activeUsers}
        />
        <DeviceDistributionCard 
          registeredUsers={data.activeAndRegisteredUsers.registeredUsers}
        />
      </div>

      {/* 3. Content Categories */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground pt-4">Content Categories</h2>
        
        {/* Academic Content */}
        <AcademicContentGrid 
          academicContent={data.contentCategories.academic} 
        />
        
        {/* Other Content */}
        <OtherContentGrid 
          otherContent={data.contentCategories.other} 
        />
      </div>

      {/* 4. Administrative Overview */}
      {/* 4. Administrative Overview */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground pt-4">Administrative Overview</h2>
        
        {/* FIX: Changed grid layout to lg:grid-cols-3 for an equal 1:1:1 column split. 
                 Kept the tighter gap-4. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> 
          
          {/* FIX: Parent Features (Now spans 1 column on lg screens and up) */}
          <div className="lg:col-span-1"> 
            <ParentFeaturesOverview 
              parentCategories={data.parentCategories} 
            />
          </div>
          
          {/* Payments Summary (Spans 1 column) */}
          <div className="lg:col-span-1">
            <PaymentsSummaryCard 
              paymentsSummary={data.paymentsSummary} 
            />
          </div>

          {/* Advertisements (Spans 1 column) */}
          <div className="lg:col-span-1">
            <AdvertisementsCard
              advertisementsSummary={data.advertisementsSummary} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};