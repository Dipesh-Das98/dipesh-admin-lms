import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import { constructMetadata } from "@/lib/utils";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// FIX 1: Import the new data fetching action

// FIX 2: Import the main container component we will create next
import { getDashboardContentAction } from "@/actions/dashboard/analytics/get-all-analytics";
import { DashboardContainer } from "./components/dashboard-container";

export const metadata = constructMetadata({
  title: "Admin Dashboard", // FIX: Updated title
  description: "View the comprehensive system statistics.",
});

const Home = async () => {
  // 1. Authentication Check
  const session = await auth();
  if (!session?.user?.backendToken) {
    redirect("/login");
  }

  // 2. Fetch Dashboard Data
  // NOTE: The token validation and retrieval logic is handled within getDashboardContent
  const dashboardResponse = await getDashboardContentAction();
  
  // 3. Render
  return (
    <ContentLayout className="space-y-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">System Overview</h1>
        <p className="text-muted-foreground">Comprehensive statistics and activity summary.</p>
      </div>
      
      {/* FIX 4: Use the DashboardContainer to pass data and handle rendering */}
      <DashboardContainer
        data={dashboardResponse.data}
        error={!dashboardResponse.success ? dashboardResponse.message : undefined}
      />
    </ContentLayout>
  );
};

export default Home;